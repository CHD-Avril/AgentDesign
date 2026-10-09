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

在根目录复制 `.env.example` 为 `.env`，选择以下一套配置，重启后端时移除 `--mock`。两种接口使用同一个前端，切换后刷新页面即可。

Qwen 沿用 OpenAI 兼容接口，Python 端只需标准库：

```env
LLM_PROVIDER=qwen
QWEN_API_KEY=你的百炼-key
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
LLM_MAX_TOKENS=4096
```

GLM 使用 Z.ai Anthropic Messages 接口，先在项目根目录安装 SDK：

```bash
python3 -m pip install anthropic
```

```env
LLM_PROVIDER=zai
ZAI_API_KEY=你的Z.ai-key
ZAI_BASE_URL=https://api.z.ai/api/anthropic
ZAI_MODEL=glm-5.3-flash
LLM_MAX_TOKENS=4096
LLM_TIMEOUT=90
LLM_MAX_RETRIES=1
```

`LLM_MAX_TOKENS` 为两种接口的单次输出预算。GLM 的思考也会使用这份预算，建议保留 `4096` 或按任务增加；`thinking` 及签名只在后端的当前工具调用过程中回传模型，界面与持久化会话只保留文本。Qwen 配置仍兼容 `DASHSCOPE_API_KEY`。

没有所选接口的 Key 时自动进入演示模式。Key 只由 Python 读取，前端不存储或传输 Key，`.env` 不应提交到 Git。后端启动命令为：

```bash
python3 server.py --port 8000
```

知识库使用独立的 `EMBEDDING_API_KEY`、`EMBEDDING_BASE_URL`、`EMBEDDING_MODEL`。Qwen 默认复用聊天 Key 与接口，可显式改为独立服务；GLM 需要另行配置兼容 Embedding 的服务，未配置时页面会提示原因。Z.ai 聊天 Key 不会自动用于百炼 Embedding。

GLM 的 `image_understand` 工具会将本地 JPEG、PNG、WebP、GIF 文件转换为 base64 图片内容块。把图片放入 `workspace/`，在对话中指定文件名或允许访问的本地路径；单张上限为 10 MB。当前前端通过文本指定图片路径，没有图片上传控件。

## 页面与交互

- **对话工作台**：POST SSE 流式聊天、Markdown/GFM 表格与代码、工具调用详情、停止接收、错误重试、复制与 Markdown 导出。
- **创作工坊**：自然语言生成应用、隔离网页预览、音视频上传、浏览器录音、转写/口语陪练/配音/播客与视频分析；语音结果在对话中可播放下载。`MEDIA_PROVIDER=auto` 可复用 Qwen Key 接入原生 ASR/TTS，也可单独配置兼容 Audio API。GLM 的聊天 Key 不会被用于 Qwen 服务。
- **历史对话**：SQLite 自动保存，搜索（⌘/Ctrl + K）、恢复、重命名和删除；服务器重启后仍可继续同一段对话。
- **工具箱**：搜索已注册工具，查看实际参数及必填字段。
- **知识库**：查看知识来源与片段数，区分未启用与空知识库。
- **长期记忆**：查看偏好与最近 20 条事实；使用对话中的记忆工具管理。
- **运行洞察**：模型/工具调用次数、Token 分布、耗时与内置价格估算；无内置单价的模型显示“暂无单价”。
- 深浅主题、Enter 发送偏好、手机侧边导航、键盘焦点与弹窗焦点限制。

主题和发送偏好保存在浏览器本地；历史对话保存在后端的 `data/chat_history.db`。停止按钮断开浏览器接收，不能保证取消已经发出的远端模型请求或正在执行的工具。历史恢复包含用户与助手文本；工具详情目前只显示当前页面产生的调用。

## 检查

```bash
npm run build
npm run lint
npm run format:check
```

在项目根目录运行 `python3 tests/run_tests.py`，包含真实本地 HTTP 服务、两种接口配置、Anthropic 工具调用与 base64 图片转换的离线回归测试，无需 API Key 或 Anthropic SDK。
