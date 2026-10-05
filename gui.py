"""桌面窗口前端（tkinter 实现，零第三方依赖）——极简对话窗。

运行：
  python gui.py            # 连接 Qwen（.env 配置）
  python gui.py --mock     # 无 Key 离线模拟演示

设计：
- 只有一个对话窗：消息区 + 输入区，没有任何按钮；
- 窗口大小自适应：消息区随窗口缩放，输入框随内容自动增高（1~5 行）；
- 操作全靠键盘：Enter 发送 · Shift+Enter 换行 · Ctrl+L 清空对话；
- 代码执行走授权弹窗（ask 模式）：Agent 想运行代码/命令时弹出确认框；
- 模型、上下文占用、执行模式显示在窗口标题与顶部一行小字里。
"""
from __future__ import annotations

import argparse
import ctypes
import queue
import sys
import threading
import uuid
from datetime import datetime
from tkinter import messagebox

from config import Config
from factory import create_agent

try:
    import tkinter as tk
except ImportError:  # pragma: no cover
    print("本机 Python 未安装 tkinter（GUI 不可用）。仍可使用命令行：python main.py chat")
    sys.exit(1)

# ---- 深色主题色板 ----
C = {
    "bg": "#0B1220", "panel": "#111A2E", "panel2": "#182542", "border": "#233453",
    "text": "#E7EDF7", "muted": "#8CA3C3", "dim": "#5B7290",
    "accent": "#2DD4BF", "amber": "#F5B23E", "red": "#F87171", "green": "#34D399",
}
FONT = ("Microsoft YaHei", 11)
FONT_H = ("Microsoft YaHei", 10, "bold")
MONO = ("Consolas", 10)
SMALL = ("Microsoft YaHei", 9)


def _enable_dpi_awareness() -> None:
    """开启 Windows 高分屏 DPI 感知：否则 tkinter 窗口会被系统位图拉伸而模糊。"""
    if sys.platform != "win32":
        return
    try:
        try:
            ctypes.windll.shcore.SetProcessDpiAwareness(2)  # per-monitor DPI aware
        except Exception:
            ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass


class AgentWindow:
    def __init__(self, cfg: Config, use_mock: bool) -> None:
        self.cfg = cfg
        self.use_mock = use_mock
        self.busy = False
        self.events: queue.Queue = queue.Queue()    # 工作线程 → UI
        self.confirms: queue.Queue = queue.Queue()  # 工作线程 → UI（授权请求）
        self.answers: queue.Queue = queue.Queue()   # UI → 工作线程（授权结果）
        self._clearing_thinking = False

        agent, note = create_agent(cfg, use_mock=use_mock, asker=self._asker, interactive=False)
        self.agent = agent

        _enable_dpi_awareness()
        self.root = tk.Tk()
        self.root.title("Agent 控制台")
        self.root.geometry("1280x800")
        self.root.minsize(720, 480)
        self.root.configure(bg=C["bg"])
        self._build_ui()
        self._apply_status(note)
        self.root.after(100, self._poll)

    # ================= UI 构建（仅消息区 + 输入区） =================
    def _build_ui(self) -> None:
        # 顶部一行小字状态（不占空间，随时可缩）
        self.head = tk.Label(
            self.root, text="", bg=C["panel"], fg=C["muted"], font=SMALL,
            anchor="w", padx=16, pady=6,
        )
        self.head.pack(fill="x")

        # 消息区（随窗口缩放）
        mid = tk.Frame(self.root, bg=C["bg"])
        mid.pack(fill="both", expand=True, padx=14, pady=(6, 6))
        self.log = tk.Text(mid, bg="#0E1626", fg=C["text"], font=FONT, wrap="word",
                           borderwidth=0, highlightthickness=0, padx=14, pady=10,
                           selectbackground=C["accent"], selectforeground="#06121a")
        sb = tk.Scrollbar(mid, command=self.log.yview)
        self.log.configure(yscrollcommand=sb.set)
        sb.pack(side="right", fill="y")
        self.log.pack(side="left", fill="both", expand=True)
        self.log.configure(state="disabled")
        self._config_tags()

        # 输入区（单行自适应增高，无按钮）
        foot = tk.Frame(self.root, bg=C["panel"])
        foot.pack(fill="x", padx=14, pady=(0, 12))
        self.input = tk.Text(foot, bg=C["panel2"], fg=C["text"], font=FONT, wrap="word",
                             height=1, borderwidth=0, highlightthickness=0,
                             insertbackground=C["text"], padx=12, pady=8)
        self.input.pack(fill="both", expand=True)
        self.input.bind("<Return>", self._on_enter)
        self.input.bind("<Shift-Return>", self._on_shift_enter)
        self.input.bind("<Control-l>", self._on_clear)
        self.input.bind("<KeyRelease>", self._auto_height)
        self.input.focus_set()

        self._welcome()

    def _config_tags(self) -> None:
        t = self.log
        t.tag_configure("user_h", foreground=C["accent"], font=FONT_H)
        t.tag_configure("user_b", foreground=C["text"], lmargin1=18, lmargin2=18, spacing2=2)
        t.tag_configure("agent_h", foreground=C["amber"], font=FONT_H)
        t.tag_configure("agent_b", foreground=C["text"], lmargin1=18, lmargin2=18, spacing2=2)
        t.tag_configure("tool_h", foreground=C["amber"], font=MONO, lmargin1=30, spacing2=1)
        t.tag_configure("tool_b", foreground=C["muted"], font=MONO, lmargin1=34, lmargin2=34, spacing3=6)
        t.tag_configure("thinking", foreground=C["dim"], font=(SMALL[0], SMALL[1], "italic"))
        t.tag_configure("error", foreground=C["red"], font=FONT)
        t.tag_configure("meta", foreground=C["dim"], font=SMALL)

    # ================= 消息渲染 =================
    def _insert(self, tag, text) -> None:
        self.log.configure(state="normal")
        self.log.insert("end", text, tag)
        self.log.configure(state="disabled")
        self.log.see("end")

    def _append_user(self, text) -> None:
        self._insert("user_h", f"你 · {self._now()}\n")
        self._insert("user_b", f"{text}\n\n")

    def _append_agent(self, text) -> None:
        self._insert("agent_h", f"Agent · {self._now()}\n")
        self._insert("agent_b", f"{text}\n\n")

    def _append_tool(self, name, args, ok, result) -> None:
        mark = "✓" if ok else "✗"
        args_str = ", ".join(f"{k}={v}" for k, v in (args or {}).items())
        self._insert("tool_h", f"{mark} 工具: {name}({args_str[:120]})\n")
        preview = (result or "")[:220].replace("\n", " ")
        self._insert("tool_b", f"   {preview}\n")

    def _append_thinking(self) -> None:
        self._insert("thinking", "正在思考并调用工具…\n")

    def _remove_thinking(self) -> None:
        if self._clearing_thinking:
            return
        self._clearing_thinking = True
        self.log.configure(state="normal")
        first = self.log.search("正在思考并调用工具…", "1.0", stopindex="end")
        if first:
            self.log.delete(first, f"{first} lineend+1c")
        self.log.configure(state="disabled")

    def _welcome(self) -> None:
        self._insert("meta", "欢迎使用 Agent 控制台 —— 远端大模型思考，本地工具干活。\n\n"
                             "可以算数、联网查资料、读写沙箱文件，还能在授权下帮你写程序并运行。\n"
                             "试试：帮我写个程序算 1 到 100 能被 3 整除的数之和，并运行\n\n"
                             "操作：Enter 发送 · Shift+Enter 换行 · Ctrl+L 清空对话\n\n")

    @staticmethod
    def _now() -> str:
        return datetime.now().strftime("%H:%M")

    # ================= 授权弹窗桥 =================
    def _asker(self, text: str) -> bool:
        """工作线程调用：把确认请求交给主线程弹窗，等待结果。"""
        cid = uuid.uuid4().hex
        self.confirms.put((cid, text))
        while True:
            try:
                aid, ok = self.answers.get(timeout=0.5)
            except queue.Empty:
                continue
            if aid == cid:
                return ok

    def _poll(self) -> None:
        try:
            while True:
                cid, text = self.confirms.get_nowait()
                ok = messagebox.askyesno("授权执行", text, parent=self.root, icon="question")
                self.answers.put((cid, ok))
        except queue.Empty:
            pass
        try:
            while True:
                ev = self.events.get_nowait()
                self._apply(ev)
        except queue.Empty:
            pass
        self.root.after(100, self._poll)

    def _apply(self, ev) -> None:
        kind = ev[0]
        if kind == "tool":
            _, name, args, ok, result = ev
            self._remove_thinking()
            self._append_tool(name, args, ok, result)
        elif kind == "delta":
            _, text = ev
            self._remove_thinking()
            self._insert("agent_b", text)
        elif kind == "done":
            _, turns, interrupted, usage = ev
            self._remove_thinking()
            if interrupted:
                self._insert("error", "\n[注意] 达到最大轮数，结果可能不完整。\n")
            self._insert("meta", f"（本轮调用工具 {turns - 1} 次）\n\n")
            if usage:
                self._apply_status(tokens=usage["tokens"], max_tokens=usage["max_tokens"])
            self._set_busy(False)
        elif kind == "error":
            _, msg = ev
            self._remove_thinking()
            self._insert("error", f"\n[出错] {msg}\n\n")
            self._set_busy(False)

    # ================= 交互 =================
    def _send(self) -> None:
        if self.busy:
            return
        text = self.input.get("1.0", "end").strip()
        if not text:
            return
        self.input.delete("1.0", "end")
        self._auto_height()
        self._append_user(text)
        self._set_busy(True)
        threading.Thread(target=self._work, args=(text,), daemon=True).start()

    def _work(self, text: str) -> None:
        def on_tool(name, args, ok, result):
            self.events.put(("tool", name, args, ok, result))
        self.agent.on_tool = on_tool
        try:
            result = self.agent.run(text, on_delta=lambda t: self.events.put(("delta", t)))
            usage = self.agent.memory.usage()
            self.events.put(("done", result.turns, result.interrupted, usage))
        except Exception as err:  # noqa: BLE001
            self.events.put(("error", f"{type(err).__name__}: {err}"))
        finally:
            self.agent.on_tool = None

    def _on_enter(self, event):
        self._send()
        return "break"

    def _on_shift_enter(self, event):
        return None  # 默认行为：插入换行

    def _on_clear(self, event=None):
        if self.busy:
            return "break"
        if messagebox.askyesno("清空对话", "清空当前对话记录与上下文？", parent=self.root):
            self.agent.reset()
            self.log.configure(state="normal")
            self.log.delete("1.0", "end")
            self.log.configure(state="disabled")
            self._apply_status(tokens=0)
            self._welcome()
        return "break"

    def _auto_height(self, event=None):
        lines = int(self.input.index("end-1c").split(".")[0])
        self.input.configure(height=max(1, min(lines, 5)))

    def _set_busy(self, busy: bool) -> None:
        self.busy = busy
        self._clearing_thinking = False

    def _apply_status(self, note: str = "", tokens: int | None = None, max_tokens: int | None = None) -> None:
        model = getattr(self.agent.llm, "name", self.cfg.model)
        try:
            mode = self.agent.tools.get("run_python").authorizer.mode
        except Exception:
            mode = "?"
        if tokens is None:
            usage = self.agent.memory.usage()
            tokens, max_tokens = usage["tokens"], usage["max_tokens"]
        max_tokens = max_tokens or self.cfg.context_tokens
        conn = "离线演示" if (self.use_mock or not self.cfg.has_api_key()) else "已连接"
        text = (f"模型 {model} · 上下文 {tokens:,}/{max_tokens:,} · 执行 {mode} · {conn}")
        self.head.configure(text=text)
        self.root.title(f"Agent 控制台 · {model} · 上下文 {tokens:,}/{max_tokens:,}")

    def run(self) -> None:
        self.root.mainloop()


def main() -> int:
    parser = argparse.ArgumentParser(description="Agent 桌面对话窗（tkinter，零依赖）。")
    parser.add_argument("--mock", action="store_true", help="强制使用离线模拟 LLM")
    args = parser.parse_args()

    cfg = Config.from_env()
    win = AgentWindow(cfg, use_mock=args.mock)
    win.run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
