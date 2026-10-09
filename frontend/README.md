# AgentDesign 智能工作台

基于 React、TypeScript 和 Vite 的中文 Agent 工作台，连接项目现有的 Python HTTP API。

## 启动

需要 Node.js 22.12+（建议 Node.js 24）和 Python 3.9+。

### 构建并由 Python 托管

在 `frontend/` 中运行：

```bash
npm ci
npm run build
```

回到项目根目录：

```bash
python3 server.py --mock --port 8000
```

打开 <http://127.0.0.1:8000>。不需要另开前端服务器；Python 会托管 `frontend/dist/`。未构建时仍提供原有 `web/agent-chat.html`。

### 开发模式

分别在两个终端运行：

```bash
# 项目根目录
python3 server.py --mock --port 8000
```

```bash
# frontend/
npm ci
npm run dev
```

打开 Vite 输出的地址（默认 <http://127.0.0.1:5173>）。`/health` 与 `/v1` 自动代理到 8000 端口。

### 真实模型

在根目录 `.env` 中配置 `QWEN_API_KEY`、`QWEN_MODEL`，重启后端时移除 `--mock`。没有 Key 时自动进入演示模式。Key 只由 Python 读取，前端不存储或传输 Key。

## 页面与交互

- **对话工作台**：POST SSE 流式聊天、Markdown/GFM 表格与代码、工具调用详情、停止接收、错误重试、复制与 Markdown 导出。
- **历史对话**：SQLite 自动保存，搜索（⌘/Ctrl + K）、恢复、重命名和删除；服务器重启后仍可继续同一段对话。
- **工具箱**：搜索已注册工具，查看实际参数及必填字段。
- **知识库**：查看知识来源与片段数，区分未启用与空知识库。
- **长期记忆**：查看偏好与最近 20 条事实；使用对话中的记忆工具管理。
- **运行洞察**：真实模型/工具调用次数、Token 分布、耗时与内置价格估算。
- 深浅主题、Enter 发送偏好、手机侧边导航、键盘焦点与弹窗焦点限制。

主题和发送偏好保存在浏览器本地；历史对话保存在后端的 `data/chat_history.db`。停止按钮断开浏览器接收，不能保证取消已经发出的远端模型请求或正在执行的工具。历史恢复包含用户与助手文本；工具详情目前只显示当前页面产生的调用。

## 检查

```bash
npm run build
npm run lint
npm run format:check
```

在项目根目录运行 `python3 tests/run_tests.py`，包含真实本地 HTTP 服务的离线回归测试，无需 API Key。
