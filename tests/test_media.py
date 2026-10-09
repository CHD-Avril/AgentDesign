"""媒体接口与管线回归：本地 HTTP Audio API，不使用真实音频账户。"""
from __future__ import annotations

import json
import base64
import io
import os
import subprocess
import tempfile
import threading
import urllib.error
import wave
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from config import Config
from llm.base import LLMResponse
from tools.media import (AudioTranscribeTool, MediaAPIClient, QwenMediaAPIClient, PodcastGenerateTool,
                         TextToSpeechTool, VideoAnalyzeTool, VoiceChatTool)


class FakeLLM:
    def __init__(self, replies):
        self.replies = iter(replies)
        self.requests = []

    def chat(self, messages):
        self.requests.append(messages)
        return LLMResponse(content=next(self.replies))


@contextmanager
def audio_api():
    requests = []
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_POST(self):
            body = self.rfile.read(int(self.headers.get("Content-Length", "0")))
            requests.append((self.path, dict(self.headers), body))
            if self.path == "/v1/audio/transcriptions":
                data, mime = json.dumps({"text": "I want to learn English."}).encode(), "application/json"
            elif self.path == "/v1/audio/speech":
                data, mime = b"ID3-test-audio-payload", "audio/mpeg"
            elif self.path == "/compatible-mode/v1/chat/completions":
                data, mime = json.dumps({"choices": [{"message": {"content": "Qwen 原生转写结果"}}]}).encode(), "application/json"
            elif self.path == "/api/v1/services/aigc/multimodal-generation/generation":
                data = json.dumps({"output": {"audio": {"url": f"http://127.0.0.1:{server.server_port}/result.wav"}}}).encode()
                mime = "application/json"
            else:
                self.send_error(404)
                return
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            requests.append((self.path, dict(self.headers), b""))
            output = io.BytesIO()
            with wave.open(output, "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(24000)
                wav.writeframes(b"\x00\x00" * 240)
            data = output.getvalue()
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        client = MediaAPIClient("test-only-credential", f"http://127.0.0.1:{server.server_port}/v1")
        yield client, requests
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def test_media_transcription_real_local_multipart_request():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, requests):
        root = Path(directory)
        (root / "voice.wav").write_bytes(b"RIFF-local-test-audio")
        result = json.loads(AudioTranscribeTool(client, root).run("voice.wav", "en"))
        assert result["text"] == "I want to learn English."
        endpoint, headers, body = requests[0]
        assert endpoint == "/v1/audio/transcriptions"
        assert headers["Authorization"] == "Bearer test-only-credential"
        assert headers["Content-Type"].startswith("multipart/form-data; boundary=")
        assert b'name="model"\r\n\r\nwhisper-1' in body
        assert b'name="language"\r\n\r\nen' in body
        assert b'filename="audio.wav"' in body and b"RIFF-local-test-audio" in body


def test_media_speech_response_is_saved_to_playable_artifact():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, requests):
        root = Path(directory)
        result = json.loads(TextToSpeechTool(client, root).run("Welcome to the podcast.", "alloy"))
        assert result["media_url"] == "/v1/media/" + Path(result["file"]).name
        assert len(Path(result["file"]).stem) == 32 and result["ai_generated"]
        assert (root / result["file"]).read_bytes() == b"ID3-test-audio-payload"
        body = json.loads(requests[0][2])
        assert body["model"] == "tts-1" and body["response_format"] == "mp3"
        assert body["input"] == "Welcome to the podcast."


def test_media_missing_configuration_and_sandbox_are_explicit():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        missing = MediaAPIClient()
        assert "MEDIA_API_KEY" in AudioTranscribeTool(missing, root).run("voice.wav")
        assert "MEDIA_API_KEY" in TextToSpeechTool(missing, root).run("hello")
        client = MediaAPIClient("test-credential")
        tool = AudioTranscribeTool(client, root)
        assert "路径越界" in tool.run("/etc/passwd")
        (root / "empty.wav").write_bytes(b"")
        assert "非空" in tool.run("empty.wav")
        (root / "voice.exe").write_bytes(b"data")
        assert "不支持" in tool.run("voice.exe")
        assert "1–4096" in TextToSpeechTool(client, root).run("a" * 4097)


def test_media_speech_rejects_external_output_symlink():
    with tempfile.TemporaryDirectory() as directory, tempfile.TemporaryDirectory() as external, audio_api() as (client, _):
        root = Path(directory)
        (root / "media").symlink_to(external, target_is_directory=True)
        assert "工作目录外部" in TextToSpeechTool(client, root).run("hello")
        assert list(Path(external).iterdir()) == []


def test_media_http_failure_does_not_expose_secret_or_response_body():
    client = MediaAPIClient("very-private-key")
    error = urllib.error.HTTPError("https://example.com/private?key=very-private-key", 429,
                                   "very-private-key in remote error", {}, None)
    with patch("tools.media.urllib.request.urlopen", side_effect=error):
        result = TextToSpeechTool(client, Path(tempfile.gettempdir())).run("hello")
    assert "429" in result and "very-private-key" not in result


def test_voice_chat_continues_and_resets_conversation():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, requests):
        root = Path(directory)
        (root / "voice.wav").write_bytes(b"RIFF-local-test-audio")
        llm = FakeLLM(["Great! What would you like to talk about?", "Let's practice ordering food.", "Let's start a new conversation."])
        tool = VoiceChatTool(llm, client, root)
        first = json.loads(tool.run("voice.wav", "lesson-1"))
        second = json.loads(tool.run("voice.wav", "lesson-1"))
        third = json.loads(tool.run("voice.wav", "lesson-1", reset=True))
        assert first["transcript"] == "I want to learn English."
        assert second["reply"] == "Let's practice ordering food."
        assert len(llm.requests[0]) == 2 and len(llm.requests[1]) == 4 and len(llm.requests[2]) == 2
        assert "do not claim to evaluate pronunciation" in llm.requests[0][0]["content"]
        assert first["media_url"] != second["media_url"] != third["media_url"]
        assert len(requests) == 6


def test_podcast_generates_script_and_audio():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, _):
        root = Path(directory)
        tool = PodcastGenerateTool(FakeLLM(["大家好，今天我们聊聊智能体。它可以把需求转成工具调用。"]), client, root)
        result = json.loads(tool.run("解释智能体", 60))
        assert result["target_duration_seconds"] == 60
        assert (root / result["file"]).is_file()
        assert (root / result["script_file"]).read_text() == result["script"]
        assert "30–240" in tool.run("test", 1000)


def fake_video_process(args, **kwargs):
    if "-show_entries" in args:
        result = {"format": {"duration": "12"}, "streams": [{"codec_type": "video"}, {"codec_type": "audio"}]}
        return subprocess.CompletedProcess(args, 0, json.dumps(result).encode(), b"")
    Path(args[-1]).write_bytes(b"test-jpeg-payload")
    return subprocess.CompletedProcess(args, 0, b"", b"")


def test_video_analysis_extracts_timestamped_anthropic_frames():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "demo.mp4").write_bytes(b"test-video")
        llm = FakeLLM(["2 秒处显示开场，6 秒处出现红色方块。"])
        tool = VideoAnalyzeTool(llm, root, image_format="anthropic")
        with patch("tools.media.shutil.which", side_effect=lambda name: "/usr/bin/" + name), patch("tools.media.subprocess.run", side_effect=fake_video_process) as process:
            result = json.loads(tool.run("demo.mp4", "描述画面", 3, include_audio=True))
        assert result["frame_timestamps"] == [2.0, 6.0, 10.0]
        content = llm.requests[0][0]["content"]
        images = [item for item in content if item["type"] == "image"]
        assert len(images) == 3 and all(item["source"]["media_type"] == "image/jpeg" for item in images)
        assert images[0]["source"]["data"] == "dGVzdC1qcGVnLXBheWxvYWQ="
        assert "不能覆盖" in result["coverage"] and "MEDIA_API_KEY" in result["audio_note"]
        assert process.call_count == 4 and not Path(process.call_args[0][0][-1]).exists()


def test_video_analysis_uses_qwen_image_url_frames():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "demo.webm").write_bytes(b"test-video")
        llm = FakeLLM(["测试画面"])
        with patch("tools.media.shutil.which", return_value="ffmpeg"), patch("tools.media.subprocess.run", side_effect=fake_video_process):
            result = json.loads(VideoAnalyzeTool(llm, root).run("demo.webm", "describe", 1))
        content = llm.requests[0][0]["content"]
        assert content[1]["type"] == "image_url"
        assert content[1]["image_url"]["url"].startswith("data:image/jpeg;base64,")
        assert result["duration_seconds"] == 12


def test_video_audio_track_is_transcribed_and_included_in_analysis():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, requests):
        root = Path(directory)
        (root / "demo.mp4").write_bytes(b"test-video")
        llm = FakeLLM(["画面与转写联合分析"])
        with patch("tools.media.shutil.which", return_value="ffmpeg"), patch("tools.media.subprocess.run", side_effect=fake_video_process) as process:
            result = json.loads(VideoAnalyzeTool(llm, root, client).run("demo.mp4", "what happens?", 1, True))
        assert result["audio_transcript"] == "I want to learn English."
        assert "音轨已转写" in result["audio_note"]
        assert "I want to learn English." in llm.requests[0][0]["content"][-1]["text"]
        assert requests[0][0] == "/v1/audio/transcriptions" and process.call_count == 3


def test_video_rejects_long_clip_before_extracting_frames():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "demo.mp4").write_bytes(b"test-video")
        probe = subprocess.CompletedProcess([], 0, b'{"format":{"duration":"1900"},"streams":[{"codec_type":"video"}]}', b"")
        with patch("tools.media.shutil.which", return_value="ffmpeg"), patch("tools.media.subprocess.run", return_value=probe) as process:
            result = VideoAnalyzeTool(FakeLLM([]), root).run("demo.mp4", "describe")
        assert "1800" in result and process.call_count == 1


def test_video_missing_ffmpeg_and_invalid_frame_count_are_readable():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "demo.mp4").write_bytes(b"test-video")
        tool = VideoAnalyzeTool(FakeLLM([]), root)
        with patch("tools.media.shutil.which", return_value=None):
            result = tool.run("demo.mp4", "describe")
        assert "brew install ffmpeg" in result and "ffprobe" in result
        assert "1–12" in tool.run("demo.mp4", "describe", 13)
        assert "路径越界" in tool.run("/etc/test.mp4", "describe")


def test_media_configuration_is_independent_of_language_provider():
    with patch("config.load_dotenv"), patch.dict(os.environ, {
        "LLM_PROVIDER": "zai", "ZAI_API_KEY": "text-key", "MEDIA_API_KEY": "audio-key",
        "MEDIA_BASE_URL": "http://127.0.0.1:9000/v1", "MEDIA_TTS_MODEL": "custom-tts",
        "MEDIA_TRANSCRIBE_MODEL": "custom-asr", "MEDIA_VOICE": "speaker-one",
        "QWEN_VISION_MODEL": "qwen-vl-test",
    }, clear=True):
        config = Config.from_env()
    assert config.api_key == "text-key" and config.media_api_key == "audio-key"
    assert config.media_base_url == "http://127.0.0.1:9000/v1"
    assert config.media_tts_model == "custom-tts" and config.media_transcribe_model == "custom-asr"
    assert config.media_voice == "speaker-one" and config.vision_model == "qwen-vl-test"


def qwen_audio_client(client):
    host = client.base_url.removesuffix("/v1")
    return QwenMediaAPIClient("qwen-test-key", host + "/compatible-mode/v1", host + "/api/v1")


def test_qwen_native_asr_uses_base64_chat_completion_protocol():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, requests):
        root = Path(directory)
        (root / "voice.wav").write_bytes(b"RIFF-test")
        result = json.loads(AudioTranscribeTool(qwen_audio_client(client), root).run("voice.wav", "zh"))
        assert result["text"] == "Qwen 原生转写结果"
        assert requests[0][0] == "/compatible-mode/v1/chat/completions"
        body = json.loads(requests[0][2])
        assert body["model"] == "qwen3-asr-flash" and body["asr_options"]["language"] == "zh"
        audio = body["messages"][0]["content"][0]
        assert audio["type"] == "input_audio"
        assert audio["input_audio"]["data"] == "data:audio/wav;base64," + base64.b64encode(b"RIFF-test").decode()


def test_qwen_native_tts_segments_merges_wav_and_caches():
    with audio_api() as (client, requests):
        qwen = qwen_audio_client(client)
        text = "这是一段播客口播稿。" * 80
        data = qwen.synthesize(text)
        posts = [item for item in requests if item[0].endswith("/generation")]
        assert len(posts) == 2
        payloads = [json.loads(item[2]) for item in posts]
        assert all(len(item["input"]["text"]) <= 600 for item in payloads)
        assert "".join(item["input"]["text"] for item in payloads) == text
        assert all(item["model"] == "qwen3-tts-flash" and item["input"]["voice"] == "Cherry" for item in payloads)
        assert all("Authorization" not in headers for path, headers, _ in requests if path == "/result.wav")
        with wave.open(io.BytesIO(data), "rb") as wav:
            assert wav.getnframes() == 480 and wav.getframerate() == 24000
        count = len(requests)
        assert qwen.synthesize(text) == data and len(requests) == count


def test_qwen_voice_chat_and_podcast_preserve_native_wav_extension():
    with tempfile.TemporaryDirectory() as directory, audio_api() as (client, _):
        root = Path(directory)
        (root / "voice.wav").write_bytes(b"RIFF-test")
        qwen = qwen_audio_client(client)
        voice = json.loads(VoiceChatTool(FakeLLM(["Hello, how are you?"]), qwen, root).run("voice.wav"))
        podcast = json.loads(PodcastGenerateTool(FakeLLM(["大家好，今天聊聊智能体。"]), qwen, root).run("智能体"))
        speech = json.loads(TextToSpeechTool(qwen, root).run("你好"))
        for result in (voice, podcast, speech):
            assert result["file"].endswith(".wav") and result["media_url"].endswith(".wav")
            assert (root / result["file"]).read_bytes().startswith(b"RIFF")


def test_qwen_media_auto_uses_qwen_key_and_never_zai_key():
    with patch("config.load_dotenv"), patch.dict(os.environ, {"LLM_PROVIDER": "zai", "ZAI_API_KEY": "glm-only", "QWEN_API_KEY": "qwen-only"}, clear=True):
        cfg = Config.from_env()
    assert cfg.media_provider == "qwen" and cfg.media_api_key == "qwen-only"
    assert cfg.media_voice == "Cherry" and cfg.qwen_asr_model == "qwen3-asr-flash"
    with patch("config.load_dotenv"), patch.dict(os.environ, {"LLM_PROVIDER": "zai", "ZAI_API_KEY": "glm-only"}, clear=True):
        cfg = Config.from_env()
    assert cfg.media_provider == "openai" and cfg.media_api_key == ""
    with patch("config.load_dotenv"), patch.dict(os.environ, {"QWEN_API_KEY": "qwen-only", "MEDIA_PROVIDER": "openai", "MEDIA_API_KEY": "audio-only"}, clear=True):
        cfg = Config.from_env()
    assert cfg.media_provider == "openai" and cfg.media_api_key == "audio-only"
