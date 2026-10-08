# 能干活的 Agent（远端算力版）

一个**能调用工具干活**的智能体框架：用户的提问由**远端大模型（默认 Qwen API）**负责思考与决策，
本地只负责执行工具（计算、联网、读写文件等）。**零本地算力、零第三方依赖**（仅 Python 3.9+ 标准库）。

> 你的智能来自云端，你的工具跑在本地。

---

## 特性

### 核心能力
- **函数调用式 ReAct 闭环**：思考 → 调工具 → 观察结果 → 继续思考 → 给出最终回答
- **干净的接口**：`LLMClient` 抽象接口、`Tool` 工具基类、`ToolRegistry` 注册表、`Agent.run()`，随时可扩展
- **默认对接 Qwen**（阿里云百炼 OpenAI 兼容接口），改两行配置即可换任意 OpenAI 兼容服务
- **零依赖**：只用 `urllib` / `http.server` / `zoneinfo` 标准库，拿到就能跑
- **流式输出**：回答逐字打出，不用干等；`LLMClient.chat_stream()` 已实现（Qwen SSE 流）
- **上下文管理**：按 token 预算的滑动窗口（默认 100k），超出自动裁剪最老对话，不会撑爆模型上下文

### 智能增强（新增）
- **🧠 长期记忆**：跨会话记住用户偏好和重要事实（SQLite 持久化），每次对话自动注入用户画像
- **📚 知识库 RAG**：本地文档语义检索（向量嵌入 + 余弦相似度），让 Agent 能"读"你的资料
- **📋 任务规划器**：复杂任务自动拆解成步骤计划，按计划执行不跑飞
- **🔄 自我反思与重试**：工具网络错误自动重试，失败结果回传 LLM 自动调整策略
- **📊 遥测与成本统计**：精确 token 计数、费用估算、运行日志，实时掌握用量

### 工具系统
- **内置 15+ 个工具**：计算器（AST 白名单防注入）、时间、网页抓取、网页搜索、文件读写（沙箱隔离）、代码执行（授权模式）
- **🔍 知识库工具**：`knowledge_search` 语义检索、`knowledge_add` 添加文档、`knowledge_list` 列出来源
- **💾 记忆工具**：`remember` 主动记住、`recall` 回忆、`forget` 删除
- **🔀 工作流编排**：`workflow_run` 一次定义多步骤，支持变量引用和条件分支
- **🖼️ 多模态工具**：`image_understand` 看图说话（Qwen-VL）、`image_generate` 文生图
- **🤖 多 Agent 协作**（可选）：主管-员工模式，复杂任务自动拆解分配给专门的 Worker

### 其他
- **双入口 + 网页前端**：命令行对话（`main.py chat`）+ HTTP 服务（`server.py`，自带网页聊天界面）
- **自带测试**：无需 pytest，`python tests/run_tests.py` 一键验证

---

## 项目结构

```
Agent设计/
├── config.py            # 配置加载（.env / 环境变量，全部有默认值）
├── factory.py           # 装配工厂：按配置创建 LLM + Agent + 所有增强模块
├── main.py              # 命令行入口（对话模式 / 单次问答 / --mock 演示）
├── server.py            # HTTP 服务 + 网页托管 + SSE 流式接口（标准库实现）
├── web/agent-chat.html  # 网页前端（深色控制台，浏览器打开即用）
├── .env.example         # 环境变量模板（复制为 .env 后填写）
├── llm/
│   ├── base.py          # ★ LLMClient 抽象接口（接模型的唯一入口）
│   ├── qwen_client.py   # Qwen / 任意 OpenAI 兼容接口实现
│   ├── embedding.py     # Qwen Embedding 客户端（RAG 用）
│   └── mock_client.py   # 离线模拟客户端（无 Key 演示 / 测试用）
├── agent/
│   ├── core.py          # ★ Agent 核心循环（思考→调工具→回答）
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
│   └── memory.db        # 长期记忆 SQLite 数据库
├── logs/                # 运行日志（自动创建）
│   ├── agent.log       # 结构化运行日志
│   └── usage_history.json  # 累计用量统计
├── workspace/           # 文件工具沙箱目录
├── examples/use_agent.py  # 库用法示例
└── tests/                 # 测试
    ├── run_tests.py      # 原有测试
    └── test_integration.py  # 新增模块集成测试
```

---

## 快速开始（3 步）

### 第 1 步：确认环境

```bash
python --version   # 需要 3.9+，本机无需安装任何包
```

### 第 2 步：配置 Qwen API

1. 注册并登录阿里云百炼：<https://bailian.console.aliyun.com>
2. 创建 API-KEY：控制台右上角头像 → **API-KEY 管理** → **创建我的 API-KEY**
3. 复制 `.env.example` 为 `.env`，填入 Key：

```bash
copy .env.example .env    # Windows
# cp .env.example .env    # Mac / Linux
```

```env
QWEN_API_KEY=sk-你的key
QWEN_MODEL=qwen-plus
```

> 新用户一般有免费额度，可到百炼控制台「模型广场」领取。

### 第 3 步：运行

```bash
# ★ 对话模式（推荐）：流式打字输出 + 多轮记忆 + 可调用工具干活
python main.py chat

# 单次问答（同样流式输出）
python main.py "帮我算 (1200-328)*0.7 是多少"

# 还没有 Key？先用离线模拟看流程
python main.py --mock "随便问什么"

# 查看工具清单
python main.py --list-tools
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

## 接入 Qwen API 的完整配置

所有配置都能通过环境变量或 `.env` 覆盖：

| 变量 | 含义 | 示例 |
|---|---|---|
| `QWEN_API_KEY` | 阿里云百炼 API Key | `sk-xxxx` |
| `QWEN_BASE_URL` | OpenAI 兼容接口地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | 模型名 | `qwen-plus`（推荐）、`qwen-turbo`（快/便宜）、`qwen-max`（强） |
| `QWEN_TEMPERATURE` | 采样温度 | `0.3` |
| `QWEN_TIMEOUT` | 单次请求超时（秒） | `60` |
| `QWEN_MAX_RETRIES` | 网络错误重试次数 | `3` |
| `QWEN_ENABLE_SEARCH` | 模型自带联网搜索（`enable_search`，官方参数，无需额外 Key） | `true` |
| `AGENT_MAX_TURNS` | 单次任务最大工具轮数 | `12` |
| `AGENT_CONTEXT_TOKENS` | 对话上下文预算（token），超出自动裁剪最老对话 | `100000` |
| `AGENT_WORK_DIR` | 文件工具沙箱目录 | `workspace` |
| `AGENT_CODE_EXEC` | 代码执行授权策略：`off` 禁用 / `auto` 低风险自动 / `ask` 每次确认 | `ask` |
| `AGENT_TOOL_RETRIES` | 工具网络错误自动重试次数 | `1` |
| `AGENT_LOG_DIR` | 日志与用量统计目录 | `logs` |
| `AGENT_MULTI_AGENT` | 是否启用多 Agent 协作模式（主管-员工） | `false` |

**换其他模型**：只要服务商提供 OpenAI 兼容接口，改三处即可：

```env
QWEN_API_KEY=新服务的key
QWEN_BASE_URL=https://api.xxx.com/v1
QWEN_MODEL=xxx-model
```

（也支持 DeepSeek、GLM、Kimi、海外 OpenAI 兼容服务等。本地部署的 Ollama 也可用同样方式接入，但那就用本地算力了。）

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

现成的 `QwenClient` 就是最好的范例。完成后在 `factory.py` 里换掉构造即可。

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
agent, note = create_agent(cfg)        # 有 Key 自动连 Qwen，无 Key 自动 mock
result = agent.run("帮我查一下今天的日期，然后算 100 天后是哪天")
print(result.content)                  # 最终回答
print(result.tool_uses)                # 工具调用记录 [{name, arguments, ok, result}]
```

---

## 把 Agent 变成 HTTP 服务 + 网页前端

```bash
python server.py --port 8000
```

**网页前端**：浏览器打开 <http://127.0.0.1:8000> 即可开始对话——深色控制台界面，
流式逐字输出、工具调用过程可视（展开/收起）、上下文占用实时显示、可发起新对话。
（前端文件在 `web/agent-chat.html`，也可单独双击打开，页面会自动连接本机 8000 端口。）

| 接口 | 方法 | 说明 |
|---|---|---|
| `/` | GET | 网页前端 |
| `/health` | GET | 健康检查，返回模型、工具列表与代码执行模式 |
| `/v1/tools` | GET | 全部工具 Schema |
| `/v1/chat` | POST | `{"message": "...", "session_id": "可选"}` → `{"reply": "...", "turns": ..., "tool_uses": [...]}` |
| `/v1/chat/stream` | GET（SSE） | `?message=...&session_id=...` 流式聊天，事件：`meta / tool / delta / done / error` |

```bash
curl -X POST http://127.0.0.1:8000/v1/chat ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"帮我算 12*34\"}"
```

传 `session_id` 可保留多轮记忆；不传则每次独立。

---

## 内置工具

| 工具 | 说明 | 安全性 |
|---|---|---|
| `calculator` | 数学计算 | AST 白名单，拒绝 `__import__` 等代码注入 |
| `datetime_now` | 北京时间 | 只读 |
| `http_fetch` | 抓取网页/文本 | 限 200KB 响应、限 3 千字正文 |
| `web_search` | 互联网搜索（标题+链接+摘要） | 主源 Bing（国内可达，免 Key），DuckDuckGo 兜底；`_search_api` 可接自己的搜索 API |
| `file_list` / `file_read` / `file_write` | 沙箱内文件操作 | 路径越界直接拒绝，只能访问 `workspace/` |
| `run_python` | 运行 Python 代码（本机解释器） | 受 `AGENT_CODE_EXEC` 授权控制 + 超时 + 输出截断 + 沙箱工作目录 |
| `shell` | 执行系统命令（Windows 用 cmd 语法） | 同上；删除/格式化/关机等高风险命令被黑名单拦截 |

**安全说明（代码执行）**：Agent 默认**不能**运行代码——这是刻意设计。
想让它"写程序并在授权下运行"，把 `.env` 里的 `AGENT_CODE_EXEC` 设为：
- `ask`（默认推荐）：每次执行前在终端弹窗 `[授权] ... (y=允许 / n=拒绝)`，你确认后才跑；
- `auto`：低风险自动执行，命中黑名单（删除、格式化、关机等）自动拒绝；
- `off`：完全禁用（保持原来"不提供 shell"的行为）。

代码/命令运行在**本机真实环境**（这正是干活的意义），授权是主要防线；辅助防护有执行超时、
输出截断、工作目录固定沙箱。**不要**在 `ask` 模式下放行看不懂的高风险命令。

---

## 测试

```bash
python tests/run_tests.py     # 零依赖运行器
# 或用 pytest（需自行安装）：pytest tests/
```

覆盖：计算器注入拒绝、文件沙箱路径穿越拦截、Agent 闭环（工具执行→回答）、未知工具容错、
最大轮数截断、多轮记忆、Qwen 响应解析、流式输出组装（文本增量 + 工具调用增量）、
上下文裁剪（token 预算滑动窗口、成对丢弃、超预算保留最新）、
代码执行授权（off/auto/ask 策略、黑名单拦截、真实运行、超时终止）。

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
A：`QWEN_API_KEY` 没填对。到百炼控制台「API-KEY 管理」重新创建，确认 `.env` 在项目根目录且变量名正确。

**Q：报 model not found？**
A：模型名填错或没开通。到百炼控制台「模型广场」看可用模型，把 `QWEN_MODEL` 改成对应名字。

**Q：`datetime_now` 报 ZoneInfoNotFoundError？**
A：Windows 缺时区库，`pip install tzdata` 即可（工具已有兜底，不装也能用本机时间）。

**Q：web_search 搜不到/失败？**
A：默认主源 Bing（国内可达）已实测可用；若仍失败，检查网络。想更稳定可接入自己的搜索 API：在 `tools/builtin.py` 的 `WebSearchTool._search_api()` 实现返回 `[(标题, 链接, 摘要)]`，并在 `_search()` 里优先调用。

**Q：想要流式输出 / 更多工具？**
A：流式已内置（`chat_stream()`），对话模式默认开启。想加工具，按「加工具」一节扩展，注册一行即可。
