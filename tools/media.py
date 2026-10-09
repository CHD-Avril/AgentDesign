"""语音、播客和视频抽帧工具。

音频支持 Qwen 原生 ASR/TTS 和独立 OpenAI-compatible Audio API。
GLM 的 Key 不会发送到 Qwen。视频使用本地 ffmpeg + ffprobe 抽帧，再发送给视觉客户端。
官方接口：https://developers.openai.com/api/docs/guides/speech-to-text
https://developers.openai.com/api/docs/guides/text-to-speech
"""
from __future__ import annotations

import base64
import hashlib
import io
import json
import math
import mimetypes
import re
import shutil
import subprocess
import tempfile
import threading
import urllib.error
import urllib.parse
import urllib.request
import uuid
import wave
from collections import OrderedDict
from pathlib import Path
from typing import Any

from tools.base import Tool
from tools.builtin import FileReadTool

MAX_AUDIO_BYTES = 25 * 1024 * 1024
MAX_VIDEO_BYTES = 200 * 1024 * 1024
AUDIO_TYPES = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".ogg", ".flac"}
VIDEO_TYPES = {".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"}
SPEECH_FORMATS = {"mp3", "wav", "opus", "aac", "flac"}


def _json(data: dict) -> str:
    return json.dumps(data, ensure_ascii=False)


def _input_path(work_dir: Path, source: str, extensions: set[str], limit: int) -> Path:
    path = FileReadTool(work_dir)._resolve(source)
    if not path.is_file():
        raise ValueError("媒体文件不存在，请先上传或提供本地文件路径。")
    if path.suffix.lower() not in extensions:
        raise ValueError("不支持的媒体格式：" + path.suffix.lower())
    size = path.stat().st_size
    if size == 0 or size > limit:
        raise ValueError(f"媒体文件须为非空文件，且不能超过 {limit // (1024 * 1024)} MB。")
    return path


def _output_path(work_dir: Path, extension: str) -> Path:
    directory = work_dir / "media"
    directory.mkdir(parents=True, exist_ok=True)
    # media 目录不可借由符号链接写出工作目录。
    if not directory.resolve().is_relative_to(work_dir.resolve()):
        raise ValueError("media 目录不能指向工作目录外部。")
    return directory / f"{uuid.uuid4().hex}.{extension}"


def _artifact(path: Path) -> dict[str, str]:
    return {"file": "media/" + path.name, "media_url": "/v1/media/" + path.name}


class MediaAPIClient:
    """仅标准库依赖的 Audio API；模型和音色由服务方提供。"""
    default_format = "mp3"

    def __init__(self, api_key: str = "", base_url: str = "https://api.openai.com/v1",
                 transcribe_model: str = "whisper-1", tts_model: str = "tts-1",
                 voice: str = "alloy", timeout: int = 120) -> None:
        self.api_key, self.base_url = api_key, base_url.rstrip("/")
        self.transcribe_model, self.tts_model = transcribe_model, tts_model
        self.voice, self.timeout = voice, timeout

    @property
    def configured(self) -> bool:
        return bool(self.api_key and self.base_url)

    def require_config(self) -> None:
        if not self.configured:
            raise ValueError("语音服务未启用：请配置 MEDIA_API_KEY、MEDIA_BASE_URL，及服务支持的 MEDIA_TRANSCRIBE_MODEL / MEDIA_TTS_MODEL。文本模型的 Key 不会自动用于音频。")
        parsed = urllib.parse.urlsplit(self.base_url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise ValueError("MEDIA_BASE_URL 必须是有效的 HTTP(S) API 根地址（含 /v1，不含凭据或查询参数）。")

    def _request(self, endpoint: str, body: bytes, content_type: str, limit: int) -> tuple[bytes, str]:
        self.require_config()
        request = urllib.request.Request(self.base_url + endpoint, data=body, method="POST",
                                         headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": content_type})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                data = response.read(limit + 1)
                mime = response.headers.get("Content-Type", "")
                if len(data) > limit:
                    raise ValueError("语音接口响应过大，请减少输入长度。")
                return data, mime
        except urllib.error.HTTPError as error:
            # 不将服务端原文或含凭据的 URL 放进工具输出。
            if error.code in (401, 403):
                raise RuntimeError(f"语音服务鉴权失败（HTTP {error.code}），请检查 MEDIA_API_KEY 和模型权限。") from None
            if error.code == 429:
                raise RuntimeError("语音服务限流或余额不足（HTTP 429）。") from None
            raise RuntimeError(f"语音接口请求失败（HTTP {error.code}），请检查 Audio API 兼容性及模型配置。") from None
        except (urllib.error.URLError, TimeoutError, OSError):
            raise RuntimeError("语音服务连接失败或超时，请检查 MEDIA_BASE_URL 和网络。") from None

    def transcribe(self, path: Path, language: str = "") -> str:
        self.require_config()
        if language and not re.fullmatch(r"[A-Za-z]{2,3}", language):
            raise ValueError("language 使用 ISO 语言代码，例如 zh、en；留空自动识别。")
        boundary = "agentdesign-" + uuid.uuid4().hex
        parts: list[bytes] = []
        fields = {"model": self.transcribe_model, "response_format": "json"}
        if language:
            fields["language"] = language
        for key, value in fields.items():
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode())
        # 使用固定 ASCII 名称，避免用户文件名破坏 multipart 头。
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio{path.suffix.lower()}"\r\nContent-Type: {mime}\r\n\r\n'.encode())
        parts.extend((path.read_bytes(), f"\r\n--{boundary}--\r\n".encode()))
        raw, _ = self._request("/audio/transcriptions", b"".join(parts), f"multipart/form-data; boundary={boundary}", 2 * 1024 * 1024)
        try:
            text = json.loads(raw.decode("utf-8"))["text"]
        except (ValueError, KeyError, TypeError, UnicodeDecodeError):
            raise RuntimeError("语音转写返回格式异常，期望 JSON text 字段。") from None
        if not isinstance(text, str) or not text.strip():
            raise RuntimeError("未识别出语音文本，请确认录音包含清晰的人声。")
        return text.strip()

    def synthesize(self, text: str, voice: str = "", response_format: str = "mp3") -> bytes:
        self.require_config()
        if not text.strip() or len(text) > 4096:
            raise ValueError("待合成文本须为 1–4096 个字符；较长播客请分段生成。")
        if response_format not in SPEECH_FORMATS:
            raise ValueError("response_format 支持 mp3、wav、opus、aac、flac。")
        body = json.dumps({"model": self.tts_model, "input": text, "voice": voice or self.voice,
                           "response_format": response_format}, ensure_ascii=False).encode("utf-8")
        data, mime = self._request("/audio/speech", body, "application/json", 32 * 1024 * 1024)
        if not data or "json" in mime.lower() or "text/html" in mime.lower():
            raise RuntimeError("语音合成未返回音频文件，请检查 TTS 模型和兼容接口。")
        return data


class QwenMediaAPIClient(MediaAPIClient):
    """千问原生语音：ASR 用 chat/completions，TTS 用 DashScope 专用端点。

    Qwen3-TTS-Flash 单请求最多 600 字符，原生返回 WAV；长稿分段后用
    Python wave 合并 PCM。显式请求其他格式时才需要 ffmpeg 转码。
    官方：https://help.aliyun.com/zh/model-studio/qwen-asr-api-reference
    https://help.aliyun.com/zh/model-studio/qwen-tts-api
    """
    default_format = "wav"

    def __init__(self, api_key: str = "",
                 asr_base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1",
                 tts_base_url: str = "https://dashscope.aliyuncs.com/api/v1",
                 transcribe_model: str = "qwen3-asr-flash", tts_model: str = "qwen3-tts-flash",
                 voice: str = "Cherry", timeout: int = 120) -> None:
        super().__init__(api_key, asr_base_url, transcribe_model, tts_model, voice, timeout)
        self.tts_base_url = tts_base_url.rstrip("/")
        self._cache: OrderedDict[str, bytes] = OrderedDict()
        self._cache_bytes = 0
        self._cache_lock = threading.Lock()

    @property
    def configured(self) -> bool:
        return bool(self.api_key and self.base_url and self.tts_base_url)

    def require_config(self) -> None:
        if not self.configured:
            raise ValueError("Qwen 语音未启用：请配置 QWEN_API_KEY / DASHSCOPE_API_KEY（或 MEDIA_API_KEY），以及 QWEN_ASR_BASE_URL / QWEN_TTS_BASE_URL。ZAI_API_KEY 不用于 Qwen 服务。")
        for url in (self.base_url, self.tts_base_url):
            parsed = urllib.parse.urlsplit(url)
            if parsed.scheme not in ("http", "https") or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
                raise ValueError("Qwen 语音地址必须是有效的 HTTP(S) API 根地址，不含凭据或查询参数。")

    def _tts_request(self, payload: dict) -> dict:
        # 复用同一安全请求实现；创建轻量实例避免并发临时修改 ASR 地址。
        transport = MediaAPIClient(self.api_key, self.tts_base_url, timeout=self.timeout)
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        raw, _ = transport._request("/services/aigc/multimodal-generation/generation", body, "application/json", 32 * 1024 * 1024)
        try:
            data = json.loads(raw)
            status = data.get("status_code", 200)
            if status != 200 or data.get("code"):
                raise RuntimeError("Qwen TTS 返回服务错误，请检查模型、音色、区域和额度。")
            return data
        except (ValueError, TypeError):
            raise RuntimeError("Qwen TTS 返回格式异常。") from None

    def transcribe(self, path: Path, language: str = "") -> str:
        self.require_config()
        if language and not re.fullmatch(r"[A-Za-z]{2,3}", language):
            raise ValueError("language 使用 zh、en 等语言代码；留空自动识别。")
        encoded = base64.standard_b64encode(path.read_bytes()).decode("ascii")
        if len(encoded) > 10 * 1024 * 1024:
            raise ValueError("Qwen3-ASR-Flash 的 Base64 输入不能超过 10 MB，请先压缩音频；单次录音最多 5 分钟。")
        mime = {".wav": "audio/wav", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".webm": "audio/webm"}.get(path.suffix.lower(), mimetypes.guess_type(path.name)[0] or "audio/wav")
        payload: dict = {"model": self.transcribe_model, "stream": False,
                         "messages": [{"role": "user", "content": [{"type": "input_audio", "input_audio": {"data": f"data:{mime};base64,{encoded}"}}]}],
                         "asr_options": {"enable_itn": True}}
        if language:
            payload["asr_options"]["language"] = language
        raw, _ = self._request("/chat/completions", json.dumps(payload).encode(), "application/json", 2 * 1024 * 1024)
        try:
            text = json.loads(raw)["choices"][0]["message"]["content"]
        except (ValueError, KeyError, IndexError, TypeError):
            raise RuntimeError("Qwen ASR 返回格式异常，期望 choices[0].message.content。") from None
        if not isinstance(text, str) or not text.strip():
            raise RuntimeError("Qwen 未识别出语音，请确认录音包含清晰的人声。")
        return text.strip()

    @staticmethod
    def _segments(text: str) -> list[str]:
        parts = []
        while len(text) > 600:
            boundaries = [m.end() for m in re.finditer(r"[。！？.!?\n，,;；:： ]", text[:600])]
            end = boundaries[-1] if boundaries and boundaries[-1] >= 300 else 600
            parts.append(text[:end])
            text = text[end:]
        if text:
            parts.append(text)
        return parts

    def _audio_bytes(self, data: dict) -> bytes:
        try:
            audio = data["output"]["audio"]
            url = audio.get("url", "")
            if url:
                parsed = urllib.parse.urlsplit(url)
                if parsed.scheme not in ("http", "https") or not parsed.netloc or parsed.username or parsed.password:
                    raise RuntimeError("Qwen TTS 返回的音频 URL 无效。")
                # 结果 URL 自带短期签名；禁止将 API Key 放进下载请求。
                try:
                    with urllib.request.urlopen(url, timeout=self.timeout) as response:
                        body = response.read(32 * 1024 * 1024 + 1)
                except (urllib.error.URLError, OSError, TimeoutError):
                    raise RuntimeError("Qwen TTS 音频下载失败或超时。") from None
            elif audio.get("data"):
                pcm = base64.b64decode(audio["data"], validate=True)
                buffer = io.BytesIO()
                with wave.open(buffer, "wb") as wav:
                    wav.setnchannels(1)
                    wav.setsampwidth(2)
                    wav.setframerate(24000)
                    wav.writeframes(pcm)
                body = buffer.getvalue()
            else:
                raise RuntimeError("Qwen TTS 没有返回音频 URL 或 Base64 音频。")
        except (ValueError, KeyError, TypeError):
            raise RuntimeError("Qwen TTS 音频返回格式异常。") from None
        if not body or len(body) > 32 * 1024 * 1024:
            raise RuntimeError("Qwen TTS 音频为空或超过 32 MB。")
        return body

    @staticmethod
    def _merge_wav(parts: list[bytes]) -> bytes:
        result = io.BytesIO()
        params = None
        try:
            with wave.open(result, "wb") as output:
                for part in parts:
                    with wave.open(io.BytesIO(part), "rb") as source:
                        current = (source.getnchannels(), source.getsampwidth(), source.getframerate(), source.getcomptype())
                        if params is None:
                            params = current
                            output.setnchannels(current[0])
                            output.setsampwidth(current[1])
                            output.setframerate(current[2])
                        elif current != params:
                            raise RuntimeError("Qwen 分段语音的采样规格不一致，无法合并。")
                        output.writeframes(source.readframes(source.getnframes()))
        except (wave.Error, EOFError):
            raise RuntimeError("Qwen TTS 返回的音频不是有效 WAV。") from None
        return result.getvalue()

    def synthesize(self, text: str, voice: str = "", response_format: str = "") -> bytes:
        self.require_config()
        if not text.strip() or len(text) > 4096:
            raise ValueError("待合成文本须为 1–4096 个字符。")
        response_format = response_format or self.default_format
        if response_format not in SPEECH_FORMATS:
            raise ValueError("response_format 支持 wav、mp3、opus、aac、flac。")
        cache_key = hashlib.sha256((self.tts_model + "\0" + (voice or self.voice) + "\0" + response_format + "\0" + text).encode()).hexdigest()
        with self._cache_lock:
            if cache_key in self._cache:
                self._cache.move_to_end(cache_key)
                return self._cache[cache_key]
        parts = [self._audio_bytes(self._tts_request({"model": self.tts_model,
                 "input": {"text": part, "voice": voice or self.voice, "language_type": "Auto"}})) for part in self._segments(text)]
        audio = self._merge_wav(parts)
        if response_format != "wav":
            ffmpeg = shutil.which("ffmpeg")
            if not ffmpeg:
                raise RuntimeError("Qwen 原生输出 WAV；转换其他格式需要安装 ffmpeg，或选择 response_format='wav'。")
            with tempfile.TemporaryDirectory(prefix="agentdesign-tts-") as directory:
                source, target = Path(directory) / "source.wav", Path(directory) / ("output." + response_format)
                source.write_bytes(audio)
                try:
                    subprocess.run([ffmpeg, "-nostdin", "-v", "error", "-i", str(source), str(target)],
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=90, check=True)
                except (subprocess.CalledProcessError, subprocess.TimeoutExpired, OSError):
                    raise RuntimeError("Qwen 音频转码失败，请选择 WAV 格式。") from None
                audio = target.read_bytes()
        with self._cache_lock:
            if len(audio) <= 8 * 1024 * 1024:
                # 避免并发重复请求重复累计缓存容量。
                previous = self._cache.pop(cache_key, None)
                if previous:
                    self._cache_bytes -= len(previous)
                self._cache[cache_key] = audio
                self._cache_bytes += len(audio)
                while len(self._cache) > 16 or self._cache_bytes > 8 * 1024 * 1024:
                    _, expired = self._cache.popitem(last=False)
                    self._cache_bytes -= len(expired)
        return audio


class AudioTranscribeTool(Tool):
    name = "audio_transcribe"
    description = "将本地录音转为文字，可用于会议摘要或口语练习。支持 Qwen 原生 ASR 和独立 Audio API。OpenAI 文件最多25 MB；Qwen3-ASR Base64 输入最多10 MB、录音最多5分钟。"
    parameters = {"type": "object", "properties": {
        "audio_source": {"type": "string", "description": "录音本地路径，如上传后的 media/xxx.webm"},
        "language": {"type": "string", "description": "zh/en 等语言代码，留空自动识别", "default": ""},
    }, "required": ["audio_source"]}

    def __init__(self, media_client: MediaAPIClient, work_dir: Path) -> None:
        self.media_client, self.work_dir = media_client, work_dir

    def run(self, audio_source: str, language: str = "") -> str:
        try:
            self.media_client.require_config()
            path = _input_path(self.work_dir, audio_source, AUDIO_TYPES, MAX_AUDIO_BYTES)
            return _json({"text": self.media_client.transcribe(path, language), "audio_source": audio_source})
        except Exception as error:
            return f"错误：{error}"


class TextToSpeechTool(Tool):
    name = "text_to_speech"
    description = "将文本合成为 AI 语音，保存到 media/ 并返回可播放链接。支持 Qwen 原生 TTS（默认 WAV）或独立 Audio API（默认 MP3）。"
    parameters = {"type": "object", "properties": {
        "text": {"type": "string", "description": "朗读文本，最多 4096 字符"},
        "voice": {"type": "string", "description": "服务支持的音色，留空用 MEDIA_VOICE"},
        "response_format": {"type": "string", "enum": sorted(SPEECH_FORMATS), "default": "mp3"},
    }, "required": ["text"]}

    def __init__(self, media_client: MediaAPIClient, work_dir: Path) -> None:
        self.media_client, self.work_dir = media_client, work_dir
        self.parameters = {**type(self).parameters, "properties": {
            **type(self).parameters["properties"],
            "response_format": {**type(self).parameters["properties"]["response_format"], "default": media_client.default_format},
        }}

    def run(self, text: str, voice: str = "", response_format: str = "") -> str:
        try:
            response_format = response_format or self.media_client.default_format
            data = self.media_client.synthesize(text, voice, response_format)
            path = _output_path(self.work_dir, response_format)
            path.write_bytes(data)
            return _json({**_artifact(path), "text": text, "voice": voice or self.media_client.voice,
                          "bytes": len(data), "ai_generated": True})
        except Exception as error:
            return f"错误：{error}"


class VoiceChatTool(Tool):
    name = "voice_chat"
    description = "一轮语音对话：转写录音 → 当前 Qwen/GLM 推理 → 合成语音回复。english 模式为英语口语陪练，conversation_id 相同会保留最近对话。非实时电话，不提供声学发音评分。"
    parameters = {"type": "object", "properties": {
        "audio_source": {"type": "string", "description": "上传录音的本地路径"},
        "conversation_id": {"type": "string", "description": "练习会话 ID，相同 ID 延续上下文", "default": "practice"},
        "mode": {"type": "string", "enum": ["english", "chat"], "default": "english"},
        "reset": {"type": "boolean", "description": "清除该练习的上轮上下文", "default": False},
        "voice": {"type": "string", "description": "TTS 音色，留空使用配置"},
    }, "required": ["audio_source"]}

    def __init__(self, client: Any, media_client: MediaAPIClient, work_dir: Path) -> None:
        self.client, self.media_client, self.work_dir = client, media_client, work_dir
        self._conversations: OrderedDict[str, list[dict]] = OrderedDict()
        self._lock = threading.Lock()

    def run(self, audio_source: str, conversation_id: str = "practice", mode: str = "english",
            reset: bool = False, voice: str = "") -> str:
        try:
            self.media_client.require_config()
            if mode not in ("english", "chat"):
                raise ValueError("mode 支持 english 或 chat。")
            if not re.fullmatch(r"[\w-]{1,80}", conversation_id):
                raise ValueError("conversation_id 使用 1–80 位字母、数字、下划线或短横线。")
            path = _input_path(self.work_dir, audio_source, AUDIO_TYPES, MAX_AUDIO_BYTES)
            transcript = self.media_client.transcribe(path, "en" if mode == "english" else "")
            instruction = (
                "You are a friendly English speaking partner. Answer in natural English in at most 100 words. "
                "If needed, briefly correct one grammar or vocabulary issue, then continue the conversation with a question. "
                "You only see a transcript: do not claim to evaluate pronunciation, accent, or audio quality."
                if mode == "english" else "你是简洁友好的语音对话伙伴。根据录音转写文本回答，不超过 200 字。"
            )
            with self._lock:
                # 两种练习模式分别保存，避免切换模式污染会话。
                session_key = mode + ":" + conversation_id
                history = [] if reset else self._conversations.get(session_key, [])
                messages = [{"role": "system", "content": instruction}] + history[-18:] + [{"role": "user", "content": transcript}]
                reply = self.client.chat(messages).content.strip()
                if not reply:
                    raise RuntimeError("语言模型未返回口语回复。")
                response_format = self.media_client.default_format
                data = self.media_client.synthesize(reply, voice, response_format)
                output = _output_path(self.work_dir, response_format)
                output.write_bytes(data)
                self._conversations[session_key] = (history + [{"role": "user", "content": transcript}, {"role": "assistant", "content": reply}])[-20:]
                self._conversations.move_to_end(session_key)
                while len(self._conversations) > 32:
                    self._conversations.popitem(last=False)
            return _json({**_artifact(output), "transcript": transcript, "reply": reply,
                          "conversation_id": conversation_id, "mode": mode, "ai_generated": True})
        except Exception as error:
            return f"错误：{error}"


class PodcastGenerateTool(Tool):
    name = "podcast_generate"
    description = "根据主题生成单人播客脚本，调用独立 TTS 服务合成可播放的 AI 语音，并保存文本稿。时长是目标，不保证精确时长。"
    parameters = {"type": "object", "properties": {
        "topic": {"type": "string", "description": "主题或需要改写成播客的资料"},
        "duration_seconds": {"type": "integer", "minimum": 30, "maximum": 240, "default": 90},
        "language": {"type": "string", "enum": ["zh", "en"], "default": "zh"},
        "voice": {"type": "string", "description": "TTS 音色，留空使用配置"},
    }, "required": ["topic"]}

    def __init__(self, client: Any, media_client: MediaAPIClient, work_dir: Path) -> None:
        self.client, self.media_client, self.work_dir = client, media_client, work_dir

    def run(self, topic: str, duration_seconds: int = 90, language: str = "zh", voice: str = "") -> str:
        try:
            self.media_client.require_config()
            if not topic.strip() or len(topic) > 10000:
                raise ValueError("播客主题或资料须为 1–10000 字符。")
            if isinstance(duration_seconds, bool) or not isinstance(duration_seconds, int) or not 30 <= duration_seconds <= 240:
                raise ValueError("duration_seconds 须为 30–240 的整数。")
            if language not in ("zh", "en"):
                raise ValueError("language 支持 zh 或 en。")
            budget = int(duration_seconds / 60 * (240 if language == "zh" else 130))
            unit = "中文字" if language == "zh" else "English words"
            script = self.client.chat([
                {"role": "system", "content": f"编写一段{'中文' if language == 'zh' else '英文'}单人播客口播稿。约 {budget} {unit}，目标 {duration_seconds} 秒。包含自然开场、具体讲解和结尾，只输出可朗读的正文，不要 Markdown、音效指令或主持人标签。不能编造资料中的事实。总字符数必须少于 4096。"},
                {"role": "user", "content": topic},
            ]).content.strip()
            response_format = self.media_client.default_format
            data = self.media_client.synthesize(script, voice, response_format)
            output = _output_path(self.work_dir, response_format)
            output.write_bytes(data)
            manuscript = output.with_suffix(".txt")
            manuscript.write_text(script, encoding="utf-8")
            return _json({**_artifact(output), "script_file": "media/" + manuscript.name,
                          "script": script, "target_duration_seconds": duration_seconds,
                          "language": language, "ai_generated": True})
        except Exception as error:
            return f"错误：{error}"


class VideoAnalyzeTool(Tool):
    name = "video_analyze"
    description = "分析本地视频：用 ffmpeg 均匀抽取带时间戳的画面，再让视觉模型分析。可选提取音轨转写。最多 200 MB / 30 分钟，抽帧不能覆盖每个瞬间；需要 ffmpeg 和 ffprobe。"
    parameters = {"type": "object", "properties": {
        "video_source": {"type": "string", "description": "视频本地路径，如 media/xxx.mp4"},
        "question": {"type": "string", "description": "希望了解的视频内容"},
        "max_frames": {"type": "integer", "minimum": 1, "maximum": 12, "default": 6},
        "include_audio": {"type": "boolean", "description": "提取并转写音轨，需要独立音频服务配置", "default": False},
    }, "required": ["video_source", "question"]}

    def __init__(self, client: Any, work_dir: Path, media_client: MediaAPIClient | None = None,
                 image_format: str = "openai") -> None:
        self.client, self.work_dir, self.media_client = client, work_dir, media_client
        # glm 使用 Anthropic base64 块，Qwen 视觉模型使用 image_url data URI。
        self.image_format = image_format

    @staticmethod
    def _process(args: list[str], timeout: int = 45) -> subprocess.CompletedProcess:
        try:
            return subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                  timeout=timeout, check=True)
        except subprocess.TimeoutExpired:
            raise RuntimeError("视频解码超时，请使用较短的视频或减少抽帧数量。") from None
        except subprocess.CalledProcessError:
            raise RuntimeError("视频解码失败，请检查视频文件完整性及编码格式。") from None

    def run(self, video_source: str, question: str, max_frames: int = 6, include_audio: bool = False) -> str:
        try:
            if not question.strip() or len(question) > 4000:
                raise ValueError("question 须为 1–4000 字符。")
            if isinstance(max_frames, bool) or not isinstance(max_frames, int) or not 1 <= max_frames <= 12:
                raise ValueError("max_frames 须为 1–12 的整数。")
            path = _input_path(self.work_dir, video_source, VIDEO_TYPES, MAX_VIDEO_BYTES)
            ffmpeg, ffprobe = shutil.which("ffmpeg"), shutil.which("ffprobe")
            if not ffmpeg or not ffprobe:
                raise RuntimeError("视频功能需要 ffmpeg 和 ffprobe 并加入 PATH。macOS: brew install ffmpeg；Ubuntu: sudo apt install ffmpeg；Windows: winget install Gyan.FFmpeg。")
            probe = self._process([ffprobe, "-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", str(path)], timeout=20)
            try:
                info = json.loads(probe.stdout)
                duration = float(info["format"]["duration"])
            except (ValueError, KeyError, TypeError):
                raise ValueError("无法读取视频时长。") from None
            if not math.isfinite(duration) or duration <= 0 or duration > 1800:
                raise ValueError("视频时长须大于 0 且不超过 1800 秒，请先裁剪长视频。")
            if not any(item.get("codec_type") == "video" for item in info.get("streams", [])):
                raise ValueError("该文件没有视频画面。")
            times = [round(duration * (index + 0.5) / max_frames, 3) for index in range(max_frames)]
            content: list[dict] = []
            audio_text, audio_note = "", "未分析音轨。"
            with tempfile.TemporaryDirectory(prefix="agentdesign-video-") as temp_dir:
                temp = Path(temp_dir)
                for index, timestamp in enumerate(times):
                    frame = temp / f"frame-{index}.jpg"
                    self._process([ffmpeg, "-nostdin", "-v", "error", "-ss", str(timestamp), "-i", str(path),
                                   "-frames:v", "1", "-vf", "scale=640:640:force_original_aspect_ratio=decrease", "-q:v", "3", str(frame)])
                    if not frame.is_file() or not frame.stat().st_size or frame.stat().st_size > 2 * 1024 * 1024:
                        raise RuntimeError("无法提取有效的视频画面。")
                    encoded = base64.standard_b64encode(frame.read_bytes()).decode("ascii")
                    content.append({"type": "text", "text": f"画面 {index + 1}，时间 {timestamp:.3f} 秒："})
                    if self.image_format == "anthropic":
                        content.append({"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": encoded}})
                    else:
                        content.append({"type": "image_url", "image_url": {"url": "data:image/jpeg;base64," + encoded}})
                if include_audio:
                    has_audio = any(item.get("codec_type") == "audio" for item in info.get("streams", []))
                    if not has_audio:
                        audio_note = "视频没有音轨。"
                    elif not self.media_client or not self.media_client.configured:
                        audio_note = "音轨未转写：请配置独立 MEDIA_API_KEY / MEDIA_BASE_URL。"
                    else:
                        audio = temp / "track.mp3"
                        self._process([ffmpeg, "-nostdin", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", "16000",
                                       "-b:a", "48k", str(audio)], timeout=120)
                        if audio.stat().st_size > MAX_AUDIO_BYTES:
                            audio_note = "提取音轨超过 25 MB，未转写。"
                        else:
                            audio_text = self.media_client.transcribe(audio)
                            audio_note = "音轨已转写。"
            content.append({"type": "text", "text": (
                f"视频总时长 {duration:.3f} 秒。以上是均匀采样的 {max_frames} 帧；只能根据所示画面回答，"
                "不要声称看过完整视频，不要推测未采样瞬间。按时间戳描述观察依据。\n"
                + ("音轨转写（可能有识别误差）：\n" + audio_text[:20000] + "\n" if audio_text else "")
                + audio_note + "\n用户问题：" + question
            )})
            analysis = self.client.chat([{"role": "user", "content": content}]).content.strip()
            if not analysis:
                raise RuntimeError("视觉模型未返回视频分析。")
            return _json({"analysis": analysis, "duration_seconds": duration, "frame_timestamps": times,
                          "coverage": "均匀抽帧，不能覆盖全部画面", "audio_transcript": audio_text, "audio_note": audio_note})
        except Exception as error:
            return f"错误：{error}"
