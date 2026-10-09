"""多模态工具：图像理解（Qwen-VL）+ 图像生成（文生图）。

图像理解：调用 qwen-vl-plus 模型，让 Agent 能"看"图片内容。
图像生成：调用 DashScope 文生图接口（wanx 系列），让 Agent 能"画"图。
零第三方依赖，只用 urllib。
"""
from __future__ import annotations

import base64
import json
import urllib.request
from pathlib import Path
from typing import Any

from tools.base import Tool


# ================= 图像理解 =================

class ImageUnderstandTool(Tool):
    """图像理解：让 Agent 能看懂图片内容。"""

    name = "image_understand"
    description = (
        "理解/分析一张图片的内容。当用户给你图片、或需要分析图片时使用这个工具。"
        "支持图片 URL 或本地文件路径（相对沙箱目录）。"
        "返回对图片内容的文字描述。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "image_source": {"type": "string", "description": "图片来源：URL 或本地文件路径（相对沙箱目录）"},
            "question": {"type": "string", "description": "你想问这张图的问题，如'图里有什么'、'帮我描述这张图'"},
        },
        "required": ["image_source", "question"],
    }

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: str = "qwen-vl-plus",
        work_dir: Path | None = None,
        timeout: int = 60,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        self.work_dir = work_dir
        self._endpoint = base_url.rstrip("/") + "/chat/completions"

    def run(self, image_source: str, question: str) -> str:
        # 处理图片来源
        if image_source.startswith(("http://", "https://")):
            image_url = image_source
        else:
            # 本地文件转 base64
            try:
                if self.work_dir:
                    img_path = (self.work_dir / image_source).resolve()
                else:
                    img_path = Path(image_source).resolve()
                if not img_path.exists():
                    return f"错误：图片文件不存在：{image_source}"
                img_data = img_path.read_bytes()
                b64 = base64.b64encode(img_data).decode("utf-8")
                image_url = f"data:image/png;base64,{b64}"
            except Exception as err:
                return f"读取本地图片失败：{err}"

        # 构造多模态消息
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": question},
                ],
            }
        ]

        payload = {
            "model": self.model,
            "messages": messages,
        }

        request = urllib.request.Request(
            self._endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except Exception as err:
            return f"图像理解 API 调用失败：{type(err).__name__}: {err}"

        try:
            content = data["choices"][0]["message"]["content"]
            return f"图片分析结果：\n{content}"
        except (KeyError, IndexError):
            return f"图像理解返回格式异常：{json.dumps(data, ensure_ascii=False)[:300]}"


# ================= 图像生成 =================

class ImageGenerateTool(Tool):
    """图像生成：文生图，让 Agent 能根据文字描述画图。"""

    name = "image_generate"
    description = (
        "根据文字描述生成一张图片（文生图）。当用户要求生成图片、插画、海报时使用。"
        "生成的图片会保存到沙箱目录，并返回文件路径。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "prompt": {"type": "string", "description": "图片描述（中英文均可，越详细越好）"},
            "filename": {"type": "string", "description": "保存的文件名（含扩展名，如 cat.png），默认自动生成"},
            "size": {"type": "string", "description": "图片尺寸，如 1024*1024、768*1024（竖版）", "default": "1024*1024"},
        },
        "required": ["prompt"],
    }

    def __init__(
        self,
        api_key: str,
        model: str = "wanx2.1-t2i-turbo",
        work_dir: Path | None = None,
        timeout: int = 120,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        self.work_dir = work_dir
        self._base = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"

    def run(self, prompt: str, filename: str = "", size: str = "1024*1024") -> str:
        # 提交任务
        payload = {
            "model": self.model,
            "input": {"prompt": prompt},
            "parameters": {"size": size, "n": 1},
        }
        request = urllib.request.Request(
            self._base,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "X-DashScope-Async": "enable",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except Exception as err:
            return f"文生图提交失败：{type(err).__name__}: {err}"

        task_id = data.get("output", {}).get("task_id", "")
        if not task_id:
            return f"文生图返回异常：{json.dumps(data, ensure_ascii=False)[:300]}"

        # 轮询任务结果
        image_url = self._poll_task(task_id)
        if not image_url:
            return "文生图任务超时或失败。"

        # 下载图片
        try:
            img_data = urllib.request.urlopen(image_url, timeout=30).read()
        except Exception as err:
            return f"图片下载失败：{err}\n图片链接：{image_url}"

        # 保存到沙箱
        if not filename:
            filename = f"generated_{abs(hash(prompt)) % 10000}.png"
        if self.work_dir:
            save_path = self.work_dir / filename
            save_path.parent.mkdir(parents=True, exist_ok=True)
        else:
            save_path = Path(filename)
        save_path.write_bytes(img_data)

        return f"图片已生成并保存到：{filename}\n尺寸：{size}\n描述：{prompt[:100]}\n文件大小：{len(img_data) // 1024} KB"

    def _poll_task(self, task_id: str, max_wait: int = 90) -> str:
        """轮询异步任务，直到完成或超时。"""
        import time
        url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
        request = urllib.request.Request(
            url,
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        waited = 0
        while waited < max_wait:
            try:
                with urllib.request.urlopen(request, timeout=30) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                status = data.get("output", {}).get("status", "")
                if status == "SUCCEEDED":
                    results = data.get("output", {}).get("results", [])
                    if results:
                        return results[0].get("url", "")
                elif status in ("FAILED", "CANCELED"):
                    return ""
            except Exception:
                pass
            time.sleep(3)
            waited += 3
        return ""


class AnthropicImageUnderstandTool(Tool):
    """用当前 Z.ai 模型读取本地图片，按真实文件类型发送 base64 内容块。"""
    name = "image_understand"
    description = "理解本地 JPEG、PNG、WebP 或 GIF 图片。输入图片文件路径和问题，返回文字分析。"
    parameters = {
        "type": "object",
        "properties": {
            "image_source": {"type": "string", "description": "本地图片文件路径，相对沙箱或用户目录内的绝对路径"},
            "question": {"type": "string", "description": "关于图片的问题"},
        },
        "required": ["image_source", "question"],
    }

    def __init__(self, client, work_dir: Path) -> None:
        self.client = client
        self.work_dir = work_dir

    def run(self, image_source: str, question: str) -> str:
        from tools.builtin import FileReadTool
        allowed_types = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                         ".webp": "image/webp", ".gif": "image/gif"}
        try:
            path = FileReadTool(self.work_dir)._resolve(image_source)
            mime = allowed_types.get(path.suffix.lower())
            if mime is None:
                return "错误：只支持 JPEG、PNG、WebP、GIF 图片。"
            if path.stat().st_size > 10 * 1024 * 1024:
                return "错误：图片大小不得超过 10 MB。"
            content = [
                {"type": "image", "source": {"type": "base64", "media_type": mime,
                                                "data": base64.standard_b64encode(path.read_bytes()).decode("ascii")}},
                {"type": "text", "text": question},
            ]
            result = self.client.chat([{"role": "user", "content": content}])
            return f"图片分析结果：\n{result.content}"
        except Exception as error:
            return f"错误：图片分析失败：{error}"
