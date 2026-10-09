# AgentDesign 智能工作台

一个能调用工具干活的智能体框架，配有 React 中文工作台。远端模型负责理解与决策，本地执行计算、联网、文件等工具。支持 **Qwen 的 OpenAI 兼容接口**与 **Z.ai 的 Anthropic Messages 接口（GLM）**，通过配置切换，无需修改代码。

Python 3.9+ 即可运行 Qwen 或离线模式；使用 GLM 时需安装 `anthropic` SDK。本地无需部署模型，构建新版前端需要 Node.js。

> 你的智能来自云端，你的工具跑在本地。

---

## 新版智能工作台

React 前端已接入后端 API，提供中文对话工作台、历史搜索与管理、工具详情、知识库、长期记忆和运行洞察；支持流式输出、Markdown 导出、深浅主题与手机布局。

新增“创作工坊”：描述生成网页应用、音频上传/录音、语音转写、英语口语陪练、文字配音、单人播客、视频上传与分析。生成的应用可在隔离预览里交互，语音结果可播放和下载。

`MEDIA_PROVIDER=auto` 会在配置 `QWEN_API_KEY`（或 `DASHSCOPE_API_KEY`）时启用百炼原生 `qwen3-asr-flash` 与 `qwen3-tts-flash`，使用同一个 Qwen Key；模型须在账号中可用。GLM 聊天也能搭配独立的 Qwen Key 使用语音。GLM Key 不会用于百炼语音接口。也可设置 `MEDIA_PROVIDER=openai` 并填写 `MEDIA_API_KEY`、`MEDIA_BASE_URL` 及兼容的转写/合成模型。Qwen 默认输出 WAV，长口播会分段合成并合并；OpenAI 兼容服务默认输出 MP3。配置项见 `.env.example`，空 `MEDIA_VOICE` 自动选择接口默认音色。

视频分析用 FFmpeg 均匀抽帧，Qwen 使用 `QWEN_VISION_MODEL`（默认 `qwen-vl-plus`），GLM 使用当前视觉模型；可选转写音轨。macOS 安装 `brew install ffmpeg`，Windows 安装 `winget install Gyan.FFmpeg`。网页上传限制 32 MB；语音转写最大 25 MB。抽帧分析不代表看过每一帧，语音陪练根据转写反馈，不提供声学发音评分。

`app_generate` 根据自然语言生成单文件 HTML/CSS/JavaScript，支持 Qwen/GLM，生成预算至少 8192 tokens；保存于 `workspace/generated-apps/`，失败不发布半成品。预览限制联网和同源访问；它是可交互的本地原型，数据保留在页面内存中，不含后端和持久数据库。

工作流向后兼容原有工具步骤，新增 `assign`、`aggregate`、`branch`、`workflow`、`for_each` 节点，支持结构化工具结果 `${name.data.field}`、类型保留、子流程输入/输出、多路分支与变量聚合。条件使用白名单表达式，所有嵌套共享步骤预算并限制深度。示例与边界测试见 `tests/test_workflow.py`。

本项目用 Python 实现这些 Agent 能力，界面是自建工作台，不包含 Coze 平台的拖拽操作流程。

```bash
cd frontend
npm ci
npm run build
cd ..
python3 server.py --mock --port 8000
```

浏览器打开 <http://127.0.0.1:8000>。配置根目录 `.env` 中的模型与 API Key 后，移除 `--mock` 并重启以使用真实模型。未构建 React 前端时，Python 仍提供原有单文件界面。开发代理、检查命令与使用限制见 [前端说明](frontend/README.md)。

---

## 特性

### 核心能力
- **函数调用式 ReAct 闭环**：思考 → 调工具 → 观察结果 → 继续思考 → 给出最终回答
- **干净的接口**：`LLMClient` 抽象接口、`Tool` 工具基类、`ToolRegistry` 注册表、`Agent.run()`，随时可扩展
- **双模型接口**：Qwen 保留原有配置；GLM 使用 Z.ai Anthropic SDK，统一文本、流式输出与工具调用
- **轻量后端**：Qwen 和离线模式只用 Python 标准库，GLM 按需安装 `anthropic`
- **流式输出**：Qwen SSE 与 Anthropic 文本流均通过 `LLMClient.chat_stream()` 输出到界面
- **上下文管理**：按 token 预算的滑动窗口（默认 100k），超出自动裁剪最老对话，不会撑爆模型上下文

### 智能增强（新增）
- **🧠 长期记忆**：跨会话记住用户偏好和重要事实（SQLite 持久化），每次对话自动注入用户画像
- **📚 知识库 RAG**：本地文档语义检索（向量嵌入 + 余弦相似度），让 Agent 能"读"你的资料
- **📋 任务规划器**：复杂任务自动拆解成步骤计划，按计划执行不跑飞
- **🔄 自我反思与重试**：工具网络错误自动重试，失败结果回传 LLM 自动调整策略
- **📊 遥测与成本统计**：模型用量、费用估算与运行日志；无内置单价的模型显示“暂无单价”

### 工具系统
- **内置 15+ 个工具**：计算器（AST 白名单防注入）、时间、网页抓取、网页搜索、文件读写（沙箱隔离）、代码执行（授权模式）
- **🔍 知识库工具**：`knowledge_search` 语义检索、`knowledge_add` 添加文档、`knowledge_list` 列出来源
- **💾 记忆工具**：`remember` 主动记住、`recall` 回忆、`forget` 删除
- **🔀 工作流编排**：`workflow_run` 一次定义多步骤，支持变量引用和条件分支
- **🖼️ 多模态工具**：Qwen 提供看图与文生图工具；GLM 将本地图片转为 base64 内容块后调用 `image_understand`
- **🤖 多 Agent 协作**（可选）：主管-员工模式，复杂任务自动拆解分配给专门的 Worker

### 其他
- **双入口 + 网页前端**：命令行对话（`main.py chat`）+ HTTP 服务（`server.py`，自带网页聊天界面）
- **自带测试**：无需 pytest，`python tests/run_tests.py` 一键验证

---

## 项目结构

```
AgentDesign/
├── config.py            # 配置加载（.env / 环境变量，全部有默认值）
├── factory.py           # 装配工厂：按配置创建 LLM + Agent + 所有增强模块
├── main.py              # 命令行入口（对话模式 / 单次问答 / --mock 演示）
├── server.py            # HTTP 服务 + 网页托管 + SSE 流式接口（标准库实现）
├── frontend/            # React / TypeScript / Vite 中文工作台
├── web/agent-chat.html  # 网页前端（深色控制台，浏览器打开即用）
├── .env.example         # 环境变量模板（复制为 .env 后填写）
├── llm/
│   ├── base.py          # ★ LLMClient 抽象接口（接模型的唯一入口）
│   ├── qwen_client.py   # Qwen / 任意 OpenAI 兼容接口实现
│   ├── anthropic_client.py  # Z.ai Anthropic Messages / GLM 实现
│   ├── embedding.py     # 独立 OpenAI 兼容 Embedding 客户端（RAG 用）
│   └── mock_client.py   # 离线模拟客户端（无 Key 演示 / 测试用）
├── agent/
│   ├── core.py          # ★ Agent 核心循环（思考→调工具→回答）
│   ├── chat_history.py  # 稳定会话 ID、历史保存与重命名/删除
│   ├── memory.py        # 短期上下文管理（token 滑动窗口）
│   ├── long_term_memory.py  # 长期记忆与用户画像（SQLite 持久化）
│   ├── memory_extractor.py  # 自动记忆提取（从对话中提取值得记住的信息）
│   ├── rag.py           # 知识库 RAG 核心（文档切分 + 向量存储 + 检索）
│   ├── planner.py       # 任务规划器（复杂任务自动拆解步骤）
│   ├── multi_agent.py   # 多 Agent 协作系统（主管-员工模式）
│   └── telemetry.py     # 遥测：token 统计、成本估算、运行日志
├── tools/
│   ├── base.py          # ★ Tool 工具基类（加工具的唯一入口）
│   ├── registry.py      # 工具注册表（注册 / 列举 / 执行）
│   ├── builtin.py       # 内置基础工具（计算/时间/抓取/搜索/文件）
│   ├── executor.py     # 代码执行工具（run_python / shell，含授权器）
│   ├── knowledge.py     # 知识库工具（检索/添加/列出）
│   ├── long_term_memory.py  # 长期记忆工具（remember/recall/forget）
│   ├── workflow.py       # 工作流编排工具（多步骤批量执行）
│   └── multimodal.py    # 多模态工具（图像理解/生成）
├── data/                # 持久化数据（自动创建）
│   ├── knowledge_base.json  # 知识库向量数据
│   ├── chat_history.db  # 网页会话历史
│   └── memory.db        # 长期记忆 SQLite 数据库
├── logs/                # 运行日志（自动创建）
│   ├── agent.log       # 结构化运行日志
│   └── usage_history.json  # 累计用量统计
├── workspace/           # 文件工具沙箱目录
├── examples/use_agent.py  # 库用法示例
└── tests/                 # 测试
    ├── run_tests.py      # 离线测试运行器
    ├── test_server.py   # HTTP、会话持久化、流式与静态托管
    └── test_anthropic.py  # 双接口配置、消息转换与 base64 图片
```

---

## 快速开始（3 步）

### 第 1 步：确认环境

```bash
python3 --version   # 需要 3.9+
```

### 第 2 步：选择 Qwen 或 GLM

复制 `.env.example` 为 `.env`，选择以下一套配置并填写自己的 Key。模板采用 `LLM_PROVIDER=zai`；已有 Qwen 配置可以继续使用。`.env` 被 Git 忽略，已有的环境变量优先于 `.env`。

```bash
cp .env.example .env       # macOS / Linux
# copy .env.example .env   # Windows cmd
```

**GLM / Z.ai：**先安装 SDK。

```bash
python3 -m pip install anthropic
# 或安装仓库声明的 SDK 版本范围：python3 -m pip install -r requirements.txt
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

`max_tokens` 是思考与回答共同使用的输出预算，建议保留 `4096` 或按任务增加。界面与历史只接收 `text`；`thinking` 及其签名只在当前工具调用过程中内部回传模型，不显示或写入会话历史。

**Qwen / 阿里云百炼：**从百炼控制台获取 Key，无需安装 Anthropic SDK。

```env
LLM_PROVIDER=qwen
QWEN_API_KEY=你的百炼-key
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
LLM_MAX_TOKENS=4096
```

Qwen 仍支持 `DASHSCOPE_API_KEY` 作为 Key 的替代变量。两套 Key 可以同时保存在本地 `.env` 中，`LLM_PROVIDER` 决定本次使用哪套；切换后需重启 Python 服务。缺少当前接口的 Key 时会进入离线演示模式。

### 第 3 步：运行

```bash
# ★ 对话模式（推荐）：流式打字输出 + 多轮记忆 + 可调用工具干活
python3 main.py chat

# 单次问答（同样流式输出）
python3 main.py "帮我算 (1200-328)*0.7 是多少"

# 还没有 Key？先用离线模拟看流程
python3 main.py --mock "随便问什么"

# 查看工具清单
python3 main.py --list-tools
```

**对话模式内命令：**

| 命令 | 作用 |
|---|---|
| `/help` | 显示帮助 |
| `/tools` | 列出当前可用工具 |
| `/context` | 查看上下文占用（tokens）与累计裁剪 |
| `/exec` | 查看代码执行授权模式（ask/auto/off） |
| `/clear` | 清空多轮对话记忆 |
| `/quit`（或 `exit` / `退出`） | 退出对话 |

对话是**流式输出**的（逐字打出，不用干等整段回答）；模型每次调用工具时，窗口会显示 `[工具] 名称(参数)` 和 `[结果]` 摘要，你能看到它"边想边干"的完整过程。
每轮回答后还会显示 `[上下文] 占用/上限 tokens`，对话超过 100k 预算时自动裁剪最老的对话，并提示省略了多少条。

---

## 模型与知识库配置

所有配置都能通过环境变量或 `.env` 覆盖：

| 变量 | 含义 | 示例 |
|---|---|---|
| `LLM_PROVIDER` | 模型接口选择 | `qwen` 或 `zai` |
| `ZAI_API_KEY` | Z.ai API Key，仅 `zai` 使用 | 自己的 Key |
| `ZAI_BASE_URL` | Anthropic Messages 接口地址 | `https://api.z.ai/api/anthropic` |
| `ZAI_MODEL` | GLM 模型名 | `glm-5.3-flash` |
| `LLM_MAX_TOKENS` | 单次模型输出预算，两种接口均生效 | `4096`（配置最小值 `1024`） |
| `LLM_TIMEOUT` | 单次请求超时（秒），优先于旧 Qwen 参数 | `90` |
| `LLM_MAX_RETRIES` | 模型请求重试次数，优先于旧 Qwen 参数 | `1` |
| `QWEN_API_KEY` | 阿里云百炼 API Key | `sk-xxxx` |
| `QWEN_BASE_URL` | OpenAI 兼容接口地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | 模型名 | `qwen-plus`（推荐）、`qwen-turbo`（快/便宜）、`qwen-max`（强） |
| `QWEN_TEMPERATURE` | 采样温度 | `0.3` |
| `QWEN_TIMEOUT` | 单次请求超时（秒） | `60` |
| `QWEN_MAX_RETRIES` | 网络错误重试次数 | `3` |
| `QWEN_ENABLE_SEARCH` | 模型自带联网搜索（`enable_search`，官方参数，无需额外 Key） | `true` |
| `EMBEDDING_API_KEY` | 知识库独立的 Embedding 服务 Key | Embedding 服务自己的 Key |
| `EMBEDDING_BASE_URL` | OpenAI 兼容 Embedding 接口地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `EMBEDDING_MODEL` | Embedding 模型 | `text-embedding-v3` |
| `AGENT_MAX_TURNS` | 单次任务最大工具轮数 | `12` |
| `AGENT_CONTEXT_TOKENS` | 对话上下文预算（token），超出自动裁剪最老对话 | `100000` |
| `AGENT_WORK_DIR` | 文件工具沙箱目录 | `workspace` |
| `AGENT_CODE_EXEC` | 代码执行授权策略：`off` 禁用 / `auto` 低风险自动 / `ask` 每次确认 | `ask` |
| `AGENT_TOOL_RETRIES` | 工具网络错误自动重试次数 | `1` |
| `AGENT_LOG_DIR` | 日志与用量统计目录 | `logs` |
| `AGENT_MULTI_AGENT` | 是否启用多 Agent 协作模式（主管-员工） | `false` |

**知识库 RAG：**聊天接口和 Embedding 接口分别配置。Qwen 默认复用其 Key 与接口；使用独立服务时填写 `EMBEDDING_*`。Z.ai Anthropic Messages 接口不提供 Embedding，需另行配置这三项才能启用知识库；程序不会将 Z.ai 聊天 Key 自动发送给百炼。未配置时，知识库页面会说明原因，对话、工具与本地长期记忆仍可用。

**换其他 OpenAI 兼容服务：**沿用 `qwen` 适配器并填写服务自己的地址和模型；服务不支持百炼的联网参数时关闭 `QWEN_ENABLE_SEARCH`。

```env
LLM_PROVIDER=qwen
QWEN_API_KEY=新服务的key
QWEN_BASE_URL=https://api.xxx.com/v1
QWEN_MODEL=xxx-model
QWEN_ENABLE_SEARCH=false
```

### GLM 本地看图

将 JPEG、PNG、WebP 或 GIF 图片放入 `workspace/`，在对话中说“调用 image_understand，分析 demo.png”。工具读取本地文件并发送 Anthropic 的 base64 图片内容块，按扩展名填写 `image/jpeg`、`image/png` 等 MIME 类型，文件大小上限为 10 MB，也可使用用户主目录内的绝对路径。

当前 React 界面通过文本指定本地路径，没有图片上传控件。GLM 模式注册图像理解工具；Qwen 保留原有 Qwen-VL 图像理解与文生图工具，是否可调用取决于账号对应模型的权限。

---

## 核心接口（给要扩展的人）

### 1. 接模型：实现 `LLMClient`

```python
from llm.base import LLMClient, LLMResponse

class MyLLM(LLMClient):
    name = "my-llm"

    def chat(self, messages, tools=None, **kwargs) -> LLMResponse:
        # messages: OpenAI 风格消息列表
        # tools:    工具 JSON Schema 列表（可为 None）
        # 返回: content（文本）和/或 tool_calls（[{id, name, arguments}]）
        ...
```

现成的 `QwenClient` 与 `AnthropicClient` 分别展示两种协议。完成新适配器后在 `factory.py` 中装配即可。

### 2. 加工具：实现 `Tool`

```python
from tools.base import Tool

class WeatherTool(Tool):
    name = "weather"                 # 必须唯一
    description = "查询指定城市的天气"  # 写清楚，模型靠它决定何时调用
    parameters = {                   # JSON Schema（OpenAI 函数调用格式）
        "type": "object",
        "properties": {"city": {"type": "string", "description": "城市名"}},
        "required": ["city"],
    }

    def run(self, city: str) -> str:   # 返回给模型的文本结果
        return f"{city} 今天晴，25℃"

# 注册到默认工具集：在 tools/__init__.py 的 default_registry() 里加一行
#   registry.register(WeatherTool())
```

### 3. 调用 Agent

```python
from config import Config
from factory import create_agent

cfg = Config.from_env()
agent, note = create_agent(cfg)        # 按 LLM_PROVIDER 选择接口；无当前 Key 则 mock
result = agent.run("帮我查一下今天的日期，然后算 100 天后是哪天")
print(result.content)                  # 最终回答
print(result.tool_uses)                # 工具调用记录 [{name, arguments, ok, result}]
```

---

## 把 Agent 变成 HTTP 服务 + 网页前端

```bash
python3 server.py --port 8000
```

浏览器打开 <http://127.0.0.1:8000> 即可使用已构建的 React 工作台。回答流式显示，工具调用可展开查看，历史会自动保存并支持搜索、重命名与删除。未构建时使用 `web/agent-chat.html` 作为备用界面。

| 接口 | 方法 | 说明 |
|---|---|---|
| `/` | GET | 网页前端 |
| `/health` | GET | 健康检查，返回当前接口、模型、输出预算与工具列表 |
| `/v1/tools` | GET | 全部工具 Schema |
| `/v1/chat` | POST | `{"message": "...", "session_id": "可选"}` → `{"reply": "...", "turns": ..., "tool_uses": [...]}` |
| `/v1/chat/stream` | POST（SSE） | 与 `/v1/chat` 同样的 JSON 请求体，事件：`meta / tool / delta / done / error`；保留旧 GET 方式 |
| `/v1/conversations` | GET | 历史会话列表 |
| `/v1/conversations/{id}` | GET / PATCH / DELETE | 读取、重命名（`{"title":"..."}`）或删除历史会话 |
| `/v1/knowledge` / `/v1/memory` / `/v1/stats` | GET | 知识来源、长期记忆与运行统计 |

```bash
curl -X POST http://127.0.0.1:8000/v1/chat \
     -H 'Content-Type: application/json' \
     -d '{"message": "帮我算 12*34"}'
```

首次不传 `session_id` 时，服务生成 ID 并随响应返回。后续传回这个 ID 即可继续会话，服务器重启后也能恢复用户与助手文本；不传则创建新的会话。同一会话生成时收到并发请求会返回 HTTP 409。

---

## 内置工具

| 工具 | 说明 | 安全性 |
|---|---|---|
| `calculator` | 数学计算 | AST 白名单，拒绝 `__import__` 等代码注入 |
| `datetime_now` | 北京时间 | 只读 |
| `http_fetch` | 抓取网页/文本 | 限 200KB 响应、限 3 千字正文 |
| `web_search` | 互联网搜索（标题+链接+摘要） | 主源 Bing（国内可达，免 Key），DuckDuckGo 兜底；`_search_api` 可接自己的搜索 API |
| `file_list` / `file_read` / `file_write` | 文件操作 | 路径白名单允许 `workspace/` 与用户主目录，拒绝越界与禁止目录 |
| `run_python` | 运行 Python 代码（本机解释器） | 受 `AGENT_CODE_EXEC` 授权控制 + 超时 + 输出截断 + 沙箱工作目录 |
| `shell` | 执行系统命令（Windows 用 cmd 语法） | 同上；删除/格式化/关机等高风险命令被黑名单拦截 |

**代码执行授权**：`.env.example` 设置 `AGENT_CODE_EXEC=ask`。按使用场景选择：

- `ask`（默认推荐）：每次执行前在终端弹窗 `[授权] ... (y=允许 / n=拒绝)`，你确认后才跑；
- `auto`：低风险自动执行，命中黑名单（删除、格式化、关机等）自动拒绝；
- `off`：完全禁用代码与命令执行。

网页服务没有终端交互确认时，`ask` 会拒绝执行；可以在命令行中完成授权，或自行明确选择 `auto`。未设置该变量的旧配置使用代码中的 `auto` 默认值，建议在 `.env` 中显式指定。

代码/命令运行在**本机真实环境**（这正是干活的意义），授权是主要防线；辅助防护有执行超时、
输出截断、工作目录固定沙箱。**不要**在 `ask` 模式下放行看不懂的高风险命令。

---

## 测试

```bash
python3 tests/run_tests.py    # 标准库运行器
# 或用 pytest（需自行安装）：pytest tests/
```

覆盖：计算器注入拒绝、文件沙箱路径穿越拦截、Agent 闭环（工具执行→回答）、未知工具容错、
最大轮数截断、多轮记忆、Qwen 响应解析、Anthropic 消息与工具结果转换、thinking 过滤、base64 图片、双接口配置、流式输出组装（文本增量 + 工具调用增量）、
上下文裁剪（token 预算滑动窗口、成对丢弃、超预算保留最新）、
代码执行授权（off/auto/ask 策略、黑名单拦截、真实运行、超时终止），以及 HTTP 会话持久化、重启恢复与并发保护。测试使用离线替身，不需要真实模型 Key 或 Anthropic SDK。

---

## 常见问题

**Q：想让 Agent 帮我写程序并运行？**
A：把 `.env` 的 `AGENT_CODE_EXEC` 设为 `ask`（默认已开启）。对话中直接说
「帮我写个程序算 xxx，保存到 solve.py 并运行」即可。Agent 会先 `file_write` 保存代码，
运行前终端会弹出授权确认，你输入 `y` 放行、`n` 拒绝。命令行里可用 `/exec` 查看当前模式。

**Q：授权运行安全吗？**
A：三层防护：① 授权策略——`ask` 每次人工确认，`auto` 只自动放行低风险操作；
② 风险黑名单——删除文件、格式化磁盘、关机/重启等命令默认拦截；③ 运行约束——超时、
输出截断、工作目录锁定在 `workspace/`。注意代码运行在本机真实环境，请只在确认内容后放行。

**Q：报 401 / 鉴权失败？**
A：确认 `LLM_PROVIDER` 与对应的 `QWEN_API_KEY` / `ZAI_API_KEY` 一致，检查账号权限与接口地址。`.env` 应放在项目根目录；若终端中已有同名变量，会优先使用环境变量。

**Q：GLM 报 429 或只有 thinking 没有回答？**
A：429 可能来自并发限制、额度或余额，需结合服务账号状态判断；稍后重试或检查资源包。只有 thinking 且输出预算耗尽时，增大 `LLM_MAX_TOKENS`，默认建议为 `4096`。

**Q：报 model not found？**
A：检查账号已开通的模型，将 `QWEN_MODEL` 或 `ZAI_MODEL` 改成对应名称。

**Q：`datetime_now` 报 ZoneInfoNotFoundError？**
A：Windows 缺时区库，`pip install tzdata` 即可（工具已有兜底，不装也能用本机时间）。

**Q：web_search 搜不到/失败？**
A：默认主源 Bing（国内可达）已实测可用；若仍失败，检查网络。想更稳定可接入自己的搜索 API：在 `tools/builtin.py` 的 `WebSearchTool._search_api()` 实现返回 `[(标题, 链接, 摘要)]`，并在 `_search()` 里优先调用。

**Q：想要流式输出 / 更多工具？**
A：流式已内置（`chat_stream()`），对话模式默认开启。想加工具，按「加工具」一节扩展，注册一行即可。
