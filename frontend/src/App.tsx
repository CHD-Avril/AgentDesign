import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Command,
  Copy,
  FileText,
  Globe2,
  Layers3,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Square,
  Sun,
  Terminal,
  Trash2,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { request, streamChat } from './api'
import type {
  Conversation,
  Health,
  Knowledge,
  Memories,
  Message,
  Stats,
  StreamEvents,
  ToolSchema,
  Usage,
} from './api'
import './App.css'
import Studio from './Studio'

type View = 'chat' | 'studio' | 'tools' | 'knowledge' | 'memory' | 'stats'
type Dialog = 'search' | 'settings' | 'help' | null
const navigation = [
  { id: 'chat', label: '对话工作台', icon: MessageSquare },
  { id: 'studio', label: '创作工坊', icon: Sparkles },
  { id: 'tools', label: '工具箱', icon: Wrench },
  { id: 'knowledge', label: '知识库', icon: BookOpen },
  { id: 'memory', label: '长期记忆', icon: Brain },
  { id: 'stats', label: '运行洞察', icon: Activity },
] as const
const suggestions = [
  {
    icon: Globe2,
    label: '探索与研究',
    description: '从问题出发，找到有用的答案',
    prompt:
      '帮我搜索 AI Agent 的最新进展，对比 ReAct 与多 Agent 协作的适用场景，并列出信息来源。',
    color: 'green',
  },
  {
    icon: Code2,
    label: '代码与计算',
    description: '把复杂逻辑，变成清晰的结果',
    prompt: '帮我算 (1200-328)*0.7 是多少，并解释计算过程。',
    color: 'purple',
  },
  {
    icon: FileText,
    label: '阅读与写作',
    description: '整理资料，让表达更进一步',
    prompt:
      '帮我写一份 AI Agent 课程项目的汇报大纲，包含背景、架构、工具调用、演示和局限性。',
    color: 'orange',
  },
  {
    icon: Layers3,
    label: '计划与执行',
    description: '拆解目标，一步一步完成任务',
    prompt:
      '帮我制定一个为期一周的 Python 学习计划，每天包含一个目标、练习和验收标准。',
    color: 'blue',
  },
]
const toolLabels: Record<string, string> = {
  calculator: '精确计算',
  datetime_now: '时间查询',
  http_fetch: '网页读取',
  file_list: '文件浏览',
  file_read: '文件读取',
  file_write: '文件写入',
  file_move: '文件移动',
  file_copy: '文件复制',
  file_delete: '文件删除',
  shell: '终端执行',
  get_time: '时间查询',
  web_search: '联网搜索',
  fetch_url: '网页读取',
  read_file: '文件读取',
  write_file: '文件写入',
  list_files: '文件浏览',
  run_python: 'Python 执行',
  run_shell: '终端执行',
  remember: '保存记忆',
  recall: '检索记忆',
  forget: '删除记忆',
  workflow_run: '工作流编排',
  knowledge_search: '知识检索',
  knowledge_add: '添加知识',
  knowledge_list: '知识来源',
  image_understand: '图像理解',
  image_generate: '图像生成',
  app_generate: '生成网页应用',
  audio_transcribe: '音频转写',
  text_to_speech: '文字配音',
  voice_chat: '语音对话',
  podcast_generate: '生成播客',
  video_analyze: '视频分析',
}
const formatNumber = (value = 0) => new Intl.NumberFormat('zh-CN').format(value)
const dateLabel = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
const getError = (error: unknown) =>
  error instanceof Error ? error.message : '发生未知错误，请重试'
const mediaArtifact = (tool: { name: string; result: string }) =>
  ['text_to_speech', 'voice_chat', 'podcast_generate'].includes(tool.name)
    ? tool.result.match(
        /"media_url"\s*:\s*"(\/v1\/media\/[a-f0-9]{32}\.(?:mp3|wav|m4a|ogg|opus|aac|flac))"/,
      )?.[1]
    : undefined
const readPreference = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}
const storePreference = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Private mode may disable storage. */
  }
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <path
          d="M6 25 13 7h6l7 18h-6l-1.5-4.5h-5L12 25zm9-9h2l-1-3z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function OrbitArtwork() {
  return (
    <div className="orbit-art" aria-hidden="true">
      <svg viewBox="0 0 260 250">
        <defs>
          <radialGradient id="orb">
            <stop offset="0" stopColor="#e0faaf" />
            <stop offset="0.65" stopColor="#b6db79" />
            <stop offset="1" stopColor="#819c59" />
          </radialGradient>
          <linearGradient id="ring">
            <stop stopColor="#dde2d3" />
            <stop offset="0.5" stopColor="#8ca267" />
            <stop offset="1" stopColor="#e4e8dd" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#ring)" strokeWidth="0.8">
          <ellipse
            cx="132"
            cy="125"
            rx="116"
            ry="52"
            transform="rotate(-32 132 125)"
          />
          <ellipse
            cx="132"
            cy="125"
            rx="108"
            ry="43"
            transform="rotate(34 132 125)"
          />
          <ellipse
            cx="132"
            cy="125"
            rx="101"
            ry="47"
            transform="rotate(-72 132 125)"
          />
        </g>
        <circle cx="132" cy="125" r="58" fill="url(#orb)" />
        <g fill="none" stroke="#78954d" strokeWidth="0.6" opacity="0.42">
          <ellipse cx="132" cy="125" rx="22" ry="58" />
          <ellipse cx="132" cy="125" rx="43" ry="58" />
          <ellipse cx="132" cy="125" rx="58" ry="22" />
          <ellipse cx="132" cy="125" rx="58" ry="43" />
          <path d="M74 125h116M132 67v116" />
        </g>
        <circle cx="44" cy="176" r="5" fill="#2d3827" />
        <circle cx="211" cy="156" r="4" fill="#c9f36a" />
        <circle cx="149" cy="27" r="3" fill="#90a279" />
        <path
          d="M222 48v14m-7-7h14M31 71v8m-4-4h8"
          stroke="#a4ae97"
          strokeWidth="1.2"
        />
      </svg>
      <span className="orbit-label">THINK. ACT. CREATE.</span>
    </div>
  )
}

function App() {
  const [view, setView] = useState<View>('chat')
  const [health, setHealth] = useState<Health | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [tools, setTools] = useState<ToolSchema[]>([])
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [memories, setMemories] = useState<Memories | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID())
  const [messages, setMessages] = useState<Message[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [query, setQuery] = useState('')
  const [toolQuery, setToolQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() =>
    readPreference('agentdesign-theme', 'light'),
  )
  const [enterSends, setEnterSends] = useState(
    () => readPreference('agentdesign-enter', 'true') === 'true',
  )
  const [toast, setToast] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [editConversation, setEditConversation] = useState<Conversation | null>(
    null,
  )
  const [editTitle, setEditTitle] = useState('')
  const [deleteConversation, setDeleteConversation] =
    useState<Conversation | null>(null)
  const [selectedTool, setSelectedTool] = useState<ToolSchema | null>(null)
  const [atBottom, setAtBottom] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeConversation = conversations.find((c) => c.id === sessionId)
  const activeLabel = navigation.find((n) => n.id === view)?.label
  const notify = useCallback((text: string) => setToast(text), [])

  const refresh = useCallback(async () => {
    const responses = await Promise.allSettled([
      request<Health>('/health'),
      request<{ conversations: Conversation[] }>('/v1/conversations'),
      request<{ tools: ToolSchema[] }>('/v1/tools'),
      request<Knowledge>('/v1/knowledge'),
      request<Memories>('/v1/memory'),
      request<Stats>('/v1/stats'),
    ])
    const [h, c, t, k, m, s] = responses
    setConnected(h.status === 'fulfilled')
    if (h.status === 'fulfilled') setHealth(h.value)
    if (c.status === 'fulfilled') setConversations(c.value.conversations)
    if (t.status === 'fulfilled') setTools(t.value.tools)
    if (k.status === 'fulfilled') setKnowledge(k.value)
    if (m.status === 'fulfilled') setMemories(m.value)
    if (s.status === 'fulfilled') setStats(s.value)
    setLoading(false)
  }, [])
  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0)
    const timer = window.setInterval(() => void refresh(), 30000)
    return () => {
      clearTimeout(initial)
      clearInterval(timer)
      abortRef.current?.abort()
    }
  }, [refresh])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    storePreference('agentdesign-theme', theme)
  }, [theme])
  useEffect(() => {
    storePreference('agentdesign-enter', String(enterSends))
  }, [enterSends])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setDialog((d) => (d === 'search' ? null : 'search'))
      }
      if (event.key === 'Escape') {
        setDialog(null)
        setSidebarOpen(false)
        setMenuId(null)
        setSelectedTool(null)
        setEditConversation(null)
        setDeleteConversation(null)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])
  useEffect(() => {
    if (atBottom && scrollRef.current)
      scrollRef.current.scrollTop = messages.length
        ? scrollRef.current.scrollHeight
        : 0
  }, [messages, atBottom])
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }, [draft, view])

  function navigate(next: View) {
    setView(next)
    setSidebarOpen(false)
    setMenuId(null)
  }
  function newConversation() {
    if (busy || historyLoading) return
    setSessionId(crypto.randomUUID())
    setMessages([])
    setUsage(null)
    setDraft('')
    setAtBottom(true)
    navigate('chat')
    window.setTimeout(() => textareaRef.current?.focus(), 0)
  }
  async function openConversation(id: string) {
    if (busy || historyLoading) return
    setHistoryLoading(true)
    setDialog(null)
    setSidebarOpen(false)
    try {
      const data = await request<{
        messages: {
          role: Message['role']
          content: string
          timestamp: number
        }[]
      }>(`/v1/conversations/${id}`)
      setSessionId(id)
      setMessages(
        data.messages.map((m) => ({
          ...m,
          id: crypto.randomUUID(),
          state: 'complete',
        })),
      )
      setUsage(null)
      setDraft('')
      setAtBottom(true)
      setView('chat')
    } catch (error) {
      notify(getError(error))
    } finally {
      setHistoryLoading(false)
    }
  }
  function fillSuggestion(prompt: string) {
    navigate('chat')
    setDraft(prompt)
    window.setTimeout(() => textareaRef.current?.focus(), 0)
  }
  async function send(event?: FormEvent, replacement?: string) {
    event?.preventDefault()
    const text = (replacement ?? draft).trim()
    if (!text || busy || historyLoading || !connected) return
    const assistantId = crypto.randomUUID()
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: Date.now() / 1000,
      },
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now() / 1000,
        tools: [],
        state: 'streaming',
      },
    ])
    setDraft('')
    setBusy(true)
    setAtBottom(true)
    const controller = new AbortController()
    abortRef.current = controller
    const update = (change: (message: Message) => Message) =>
      setMessages((previous) =>
        previous.map((m) => (m.id === assistantId ? change(m) : m)),
      )
    try {
      await streamChat(text, sessionId, controller.signal, (event, data) => {
        if (event === 'delta')
          update((m) => ({
            ...m,
            content: m.content + (data as StreamEvents['delta']).text,
          }))
        if (event === 'tool')
          update((m) => ({
            ...m,
            tools: [...(m.tools || []), data as StreamEvents['tool']],
          }))
        if (event === 'done') {
          const done = data as StreamEvents['done']
          setUsage(done.usage)
          update((m) => ({ ...m, content: done.content, state: 'complete' }))
          if (done.interrupted)
            notify('已达到工具调用轮数上限，可继续补充任务要求')
          if (done.dropped)
            notify('较早的上下文已自动裁剪，完整对话仍保留在历史中')
        }
      })
    } catch (error) {
      const stopped = controller.signal.aborted
      update((m) => ({
        ...m,
        state: stopped ? 'stopped' : 'error',
        error: stopped
          ? '已停止接收回复；已发出的模型或工具调用可能仍会完成。'
          : getError(error),
      }))
    } finally {
      setBusy(false)
      abortRef.current = null
      void refresh()
      textareaRef.current?.focus()
    }
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      notify('已复制到剪贴板')
    } catch {
      notify('复制失败，请选中文本后手动复制')
    }
  }
  function exportConversation() {
    if (!messages.length) return
    const content =
      `# ${activeConversation?.title || 'AgentDesign 对话'}\n\n` +
      messages
        .map(
          (m) =>
            `## ${m.role === 'user' ? '你' : 'AgentDesign'}\n\n${m.content}${m.error ? `\n\n> ${m.error}` : ''}`,
        )
        .join('\n\n---\n\n')
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/markdown;charset=utf-8' }),
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `AgentDesign-${new Date().toISOString().slice(0, 10)}.md`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    notify('对话已导出为 Markdown')
  }
  async function rename(event: FormEvent) {
    event.preventDefault()
    if (!editConversation || !editTitle.trim()) return
    try {
      await request(`/v1/conversations/${editConversation.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editTitle.trim() }),
      })
      setEditConversation(null)
      void refresh()
      notify('对话名称已更新')
    } catch (error) {
      notify(getError(error))
    }
  }
  async function removeConversation() {
    if (!deleteConversation) return
    try {
      await request(`/v1/conversations/${deleteConversation.id}`, {
        method: 'DELETE',
      })
      if (sessionId === deleteConversation.id) newConversation()
      setDeleteConversation(null)
      void refresh()
      notify('对话已删除')
    } catch (error) {
      notify(getError(error))
    }
  }
  const searchedConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredTools = tools.filter((t) =>
    `${t.function.name} ${t.function.description} ${toolLabels[t.function.name] || ''}`
      .toLowerCase()
      .includes(toolQuery.toLowerCase()),
  )
  const contextPercent = usage
    ? Math.min(100, (usage.tokens / usage.max_tokens) * 100)
    : 0

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="关闭导航"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('chat')
          }}
        >
          <BrandMark />
          <span>
            Agent<span className="brand-light">Design</span>
            <small>你的智能行动空间</small>
          </span>
        </a>
        <button
          className="new-chat"
          onClick={newConversation}
          disabled={busy || historyLoading}
        >
          <Plus size={18} />
          开启新对话
        </button>
        <button
          className="sidebar-search"
          onClick={() => {
            setDialog('search')
            setQuery('')
          }}
        >
          <Search size={16} />
          <span>搜索对话</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="nav-heading">
          工作空间 <span>WORKSPACE</span>
        </div>
        <nav aria-label="主导航">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {view === item.id && <span className="nav-dot" />}
              {item.id === 'tools' && view !== item.id && (
                <span className="nav-count">{tools.length || '–'}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="history-heading">
          <span>最近对话</span>
          <button
            className="icon-button"
            aria-label="查看全部对话"
            onClick={() => {
              setQuery('')
              setDialog('search')
            }}
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
        <div className="history-list">
          {loading ? (
            <div className="sidebar-empty">正在加载工作空间…</div>
          ) : conversations.length === 0 ? (
            <div className="sidebar-empty">
              <MessageSquare size={19} />
              <p>故事，从第一次对话开始</p>
              <small>你的对话会自动保存在这里</small>
            </div>
          ) : (
            conversations.slice(0, 12).map((c) => (
              <div
                className={`history-item ${sessionId === c.id ? 'selected' : ''}`}
                key={c.id}
              >
                <button
                  className="history-open"
                  onClick={() => void openConversation(c.id)}
                  disabled={busy || historyLoading}
                >
                  <MessageSquare size={14} />
                  <span>{c.title}</span>
                </button>
                <button
                  className="history-more icon-button"
                  aria-label={`管理对话：${c.title}`}
                  onClick={() => setMenuId(menuId === c.id ? null : c.id)}
                  disabled={busy || historyLoading}
                >
                  <MoreHorizontal size={15} />
                </button>
                {menuId === c.id && (
                  <div className="history-menu">
                    <button
                      onClick={() => {
                        setEditConversation(c)
                        setEditTitle(c.title)
                        setMenuId(null)
                      }}
                    >
                      <Pencil size={14} />
                      重命名
                    </button>
                    <button
                      className="danger-text"
                      onClick={() => {
                        setDeleteConversation(c)
                        setMenuId(null)
                      }}
                    >
                      <Trash2 size={14} />
                      删除对话
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="sidebar-bottom">
          <div className="local-card">
            <span className="local-icon">
              <ShieldCheck size={18} />
            </span>
            <div>
              <strong>本地工作空间</strong>
              <small>工具在本地，灵感无边界</small>
            </div>
            <span className={`status-dot ${connected ? '' : 'offline'}`} />
          </div>
          <div className="sidebar-footer">
            <span className="avatar">AD</span>
            <div>
              <strong>我的工作台</strong>
              <small>Personal workspace</small>
            </div>
            <button
              className="icon-button"
              aria-label="打开设置"
              onClick={() => setDialog('settings')}
            >
              <Settings2 size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="打开导航"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb-root">工作空间</span>
            <ChevronRight size={14} />
            <strong>{activeLabel}</strong>
          </div>
          <div className="topbar-actions">
            <span
              className={`connection-pill ${connected ? '' : 'disconnected'}`}
            >
              <span className="status-dot" />
              {loading
                ? '连接中'
                : connected
                  ? health?.mode === 'mock'
                    ? '离线演示'
                    : '服务已连接'
                  : '服务未连接'}
            </span>
            <button
              className="icon-button theme-button"
              aria-label={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <span className="header-divider" />
            <button
              className="export-button"
              onClick={exportConversation}
              disabled={!messages.length || busy}
            >
              <ArrowDownToLine size={16} />
              <span>导出对话</span>
            </button>
          </div>
        </header>
        {!loading && !connected && (
          <div className="connection-banner" role="alert">
            无法连接 Agent 服务，请启动后端后重试。
            <button onClick={() => void refresh()}>
              重新连接 <ArrowRight size={14} />
            </button>
          </div>
        )}
        <div className="workspace-body">
          <main className={`main-panel ${view === 'chat' ? 'chat-panel' : ''}`}>
            {view === 'chat' ? (
              <>
                <div className="chat-topline">
                  <div>
                    <span className="eyebrow">AGENT WORKSPACE</span>
                    <h2>
                      {activeConversation?.title || '一切，从一个想法开始'}
                    </h2>
                  </div>
                  <button
                    className="model-chip"
                    onClick={() => setDialog('settings')}
                  >
                    <Sparkles size={14} />
                    {health?.mode === 'mock'
                      ? 'Mock · 演示模型'
                      : health?.model || '等待连接'}
                    <ChevronDown size={13} />
                  </button>
                </div>
                <div
                  className="chat-scroll"
                  ref={scrollRef}
                  onScroll={() => {
                    const el = scrollRef.current
                    if (el)
                      setAtBottom(
                        el.scrollHeight - el.scrollTop - el.clientHeight < 100,
                      )
                  }}
                >
                  {historyLoading ? (
                    <div className="loading-state">
                      <span className="spinner" />
                      正在恢复对话…
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="welcome">
                      <section className="hero">
                        <div className="hero-copy">
                          <div className="hero-badge">
                            <span className="tiny-star">✳</span> YOUR IDEAS, IN
                            MOTION
                          </div>
                          <h1>
                            让想法，
                            <br />
                            开始
                            <span className="highlight">
                              行动
                              <span className="highlight-line" />
                            </span>
                            。
                          </h1>
                          <p>
                            不止于回答。探索信息、调用工具、完成任务，
                            <br className="desktop-break" />
                            和你的 AI 搭档一起，把下一步变成现实。
                          </p>
                        </div>
                        <OrbitArtwork />
                      </section>
                      <div className="suggestions-heading">
                        <span>今天，我们做点什么？</span>
                        <span>
                          从一个小任务开始 <ArrowDown size={13} />
                        </span>
                      </div>
                      <div className="suggestions">
                        {suggestions.map((s, index) => (
                          <button
                            className="suggestion-card"
                            key={s.label}
                            onClick={() => fillSuggestion(s.prompt)}
                          >
                            <div className="suggestion-top">
                              <span className={`suggestion-icon ${s.color}`}>
                                <s.icon size={21} />
                              </span>
                              <span className="suggestion-number">
                                0{index + 1}
                              </span>
                            </div>
                            <strong>{s.label}</strong>
                            <p>{s.description}</p>
                            <ArrowUpRight
                              className="suggestion-arrow"
                              size={18}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="welcome-note">
                        <ShieldCheck size={14} />
                        <span>
                          对话自动保存 · 工具执行过程可见 · 你的节奏，你来掌控
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="message-list">
                      {messages.map((m) => (
                        <article key={m.id} className={`message ${m.role}`}>
                          <div className="message-avatar">
                            {m.role === 'assistant' ? (
                              <BrandMark small />
                            ) : (
                              <span>你</span>
                            )}
                          </div>
                          <div className="message-content">
                            <div className="message-heading">
                              <strong>
                                {m.role === 'assistant' ? 'AgentDesign' : '你'}
                              </strong>
                              <span>
                                {m.role === 'assistant'
                                  ? '行动搭档'
                                  : new Date(
                                      m.timestamp * 1000,
                                    ).toLocaleTimeString('zh-CN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                              </span>
                              {m.state === 'streaming' && (
                                <span className="generating">
                                  <span className="status-dot" />
                                  处理中
                                </span>
                              )}
                            </div>
                            {m.tools?.map((tool, index) => (
                              <details
                                className={`tool-trace ${tool.ok ? '' : 'failed'}`}
                                key={index}
                              >
                                <summary>
                                  {tool.ok ? (
                                    <Check size={15} />
                                  ) : (
                                    <X size={15} />
                                  )}
                                  <span>
                                    {toolLabels[tool.name] || tool.name}
                                  </span>
                                  <code>{tool.name}</code>
                                  <ChevronDown size={13} />
                                </summary>
                                <div>
                                  <small>调用参数</small>
                                  <pre>
                                    {JSON.stringify(tool.arguments, null, 2)}
                                  </pre>
                                  <small>执行结果</small>
                                  <pre>{tool.result}</pre>
                                </div>
                              </details>
                            ))}
                            {m.tools?.map((tool, index) => {
                              const audio = mediaArtifact(tool)
                              return audio ? (
                                <div
                                  className="voice-artifact"
                                  key={`voice-${index}`}
                                >
                                  <span>AI 生成语音</span>
                                  <audio
                                    controls
                                    preload="metadata"
                                    src={audio}
                                  />
                                  <a href={audio} download>
                                    下载音频
                                  </a>
                                </div>
                              ) : tool.name === 'app_generate' &&
                                tool.ok &&
                                tool.result.includes('preview_url') ? (
                                <button
                                  className="app-artifact-link"
                                  key={`app-${index}`}
                                  onClick={() => navigate('studio')}
                                >
                                  <Code2 size={15} />
                                  应用已生成，前往创作工坊预览
                                  <ArrowRight size={14} />
                                </button>
                              ) : null
                            })}
                            <div className="markdown">
                              {m.role === 'assistant' ? (
                                <Markdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    a: ({ children, ...props }) => (
                                      <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {children}
                                      </a>
                                    ),
                                    pre: ({ children }) => (
                                      <div className="code-block">
                                        <div className="code-label">
                                          <Terminal size={13} />
                                          代码
                                        </div>
                                        <pre>{children}</pre>
                                      </div>
                                    ),
                                  }}
                                >
                                  {m.content}
                                </Markdown>
                              ) : (
                                <p className="user-text">{m.content}</p>
                              )}
                            </div>
                            {m.state === 'streaming' && !m.content && (
                              <div className="thinking">
                                <span />
                                <span />
                                <span />
                              </div>
                            )}
                            {m.error && (
                              <div className="message-error" role="alert">
                                {m.error}
                              </div>
                            )}
                            {m.role === 'assistant' &&
                              m.state !== 'streaming' && (
                                <div className="message-actions">
                                  {m.content && (
                                    <button
                                      onClick={() => void copy(m.content)}
                                    >
                                      <Copy size={13} />
                                      复制回答
                                    </button>
                                  )}
                                  {m.state === 'error' && (
                                    <button
                                      onClick={() =>
                                        void send(
                                          undefined,
                                          messages[messages.indexOf(m) - 1]
                                            ?.content,
                                        )
                                      }
                                      disabled={busy}
                                    >
                                      重试 <ArrowRight size={13} />
                                    </button>
                                  )}
                                  {m.state === 'complete' && (
                                    <span>
                                      <Check size={12} />
                                      已完成
                                    </span>
                                  )}
                                  {m.state === 'stopped' && (
                                    <span>接收已停止</span>
                                  )}
                                </div>
                              )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
                <div className="composer-area">
                  {!atBottom && messages.length > 0 && (
                    <button
                      className="scroll-bottom"
                      onClick={() => setAtBottom(true)}
                      aria-label="滚动到最新消息"
                    >
                      <ArrowDown size={16} />
                    </button>
                  )}
                  <form
                    className={`composer ${busy ? 'is-busy' : ''}`}
                    onSubmit={(event) => void send(event)}
                  >
                    <label className="sr-only" htmlFor="message-input">
                      输入你的任务
                    </label>
                    <textarea
                      ref={textareaRef}
                      id="message-input"
                      placeholder="告诉我你的想法，或者交给我一个任务…"
                      value={draft}
                      rows={2}
                      maxLength={50000}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          enterSends &&
                          e.key === 'Enter' &&
                          !e.shiftKey &&
                          !e.nativeEvent.isComposing
                        ) {
                          e.preventDefault()
                          void send()
                        }
                      }}
                      disabled={historyLoading}
                    />
                    <div className="composer-toolbar">
                      <button
                        className="composer-tools"
                        type="button"
                        onClick={() => navigate('tools')}
                      >
                        <Wrench size={15} />
                        <span>{health?.tools.length || 0} 个工具可用</span>
                        <ChevronDown size={12} />
                      </button>
                      <div className="composer-right">
                        <span>
                          {enterSends
                            ? 'Enter 发送 · Shift + Enter 换行'
                            : '点击箭头发送'}
                        </span>
                        {busy ? (
                          <button
                            className="send-button stop"
                            type="button"
                            aria-label="停止接收回复"
                            onClick={() => abortRef.current?.abort()}
                          >
                            <Square size={16} fill="currentColor" />
                          </button>
                        ) : (
                          <button
                            className="send-button"
                            type="submit"
                            aria-label="发送消息"
                            disabled={
                              !draft.trim() || !connected || historyLoading
                            }
                          >
                            <ArrowUp size={21} />
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                  <div className="composer-footnote">
                    <span>
                      {health?.mode === 'mock'
                        ? '当前为离线演示，配置模型 API Key 后即可使用真实模型。'
                        : 'AI 也可能出错，请核实重要信息。'}
                    </span>
                    <span>
                      Powered by AgentDesign{' '}
                      <span className="tiny-star">✳</span>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="page-content">
                <div className="page-intro">
                  <span className="eyebrow">
                    {view === 'studio'
                      ? 'CREATIVE STUDIO'
                      : view === 'tools'
                        ? 'CAPABILITIES'
                        : view === 'knowledge'
                          ? 'KNOWLEDGE BASE'
                          : view === 'memory'
                            ? 'LONG-TERM MEMORY'
                            : 'OBSERVABILITY'}
                  </span>
                  <h1>
                    {activeLabel}
                    <span className="title-dot">.</span>
                  </h1>
                  <p>
                    {view === 'studio'
                      ? '把需求变成应用，让文字拥有声音，读懂视频里的故事。'
                      : view === 'tools'
                        ? '让 AI 有所作为。每一个工具，都是从想法到行动的一座桥。'
                        : view === 'knowledge'
                          ? '让你的资料，成为 AI 的知识。连接上下文，找到更贴近你的答案。'
                          : view === 'memory'
                            ? '记住有意义的事，让每一次对话都更了解你。'
                            : '每一次调用，都有迹可循。了解用量，让工作更有把握。'}
                  </p>
                </div>
                {view === 'studio' && (
                  <Studio
                    health={health}
                    busy={busy}
                    onSettings={() => setDialog('settings')}
                    onPrompt={(prompt) => {
                      navigate('chat')
                      void send(undefined, prompt)
                    }}
                  />
                )}
                {view === 'tools' && (
                  <>
                    <div className="section-toolbar">
                      <span>
                        <strong>{tools.length}</strong> 个已注册工具
                      </span>
                      <div className="filter-input">
                        <Search size={16} />
                        <input
                          aria-label="搜索工具"
                          placeholder="搜索工具或能力…"
                          value={toolQuery}
                          onChange={(e) => setToolQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tool-grid">
                      {filteredTools.map((t) => (
                        <button
                          className="tool-card"
                          key={t.function.name}
                          onClick={() => setSelectedTool(t)}
                        >
                          <span className="tool-card-icon">
                            <Wrench size={20} />
                          </span>
                          <ArrowUpRight size={17} className="tool-card-arrow" />
                          <strong>
                            {toolLabels[t.function.name] || t.function.name}
                          </strong>
                          <code>{t.function.name}</code>
                          <p>{t.function.description}</p>
                          <span className="tool-card-footer">
                            <span className="status-dot" />
                            已注册{' '}
                            <span>
                              {
                                Object.keys(
                                  t.function.parameters.properties || {},
                                ).length
                              }{' '}
                              个参数
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    {!filteredTools.length && (
                      <EmptyState
                        icon={Search}
                        title={
                          connected ? '没有找到相关工具' : '等待连接工具服务'
                        }
                        description={
                          connected
                            ? '试试其他关键词。'
                            : '连接后，已注册的工具将显示在这里。'
                        }
                      />
                    )}
                  </>
                )}
                {view === 'knowledge' && (
                  <>
                    <div className="metrics two">
                      <Metric
                        label="知识来源"
                        value={String(knowledge?.sources.length || 0)}
                        icon={FileText}
                      />
                      <Metric
                        label="文档片段"
                        value={formatNumber(knowledge?.total_chunks)}
                        icon={Layers3}
                      />
                    </div>
                    {knowledge?.sources.length ? (
                      <div className="content-card">
                        <div className="card-heading">
                          <h3>已收录的来源</h3>
                          <span>本地知识库</span>
                        </div>
                        {knowledge.sources.map((source) => (
                          <div className="source-row" key={source}>
                            <FileText size={18} />
                            <span>{source}</span>
                            <span className="subtle-tag">已索引</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={BookOpen}
                        title={
                          knowledge?.enabled
                            ? '为知识库添加第一份资料'
                            : '你的专属知识，从这里开始'
                        }
                        description={
                          knowledge?.enabled
                            ? '在对话中提供文本，让 Agent 使用 knowledge_add 保存，之后即可检索。'
                            : '配置独立的 Embedding 服务并重启，启用文档嵌入与语义检索。'
                        }
                        action={
                          knowledge?.enabled ? '去添加知识' : '查看连接说明'
                        }
                        onAction={() =>
                          knowledge?.enabled
                            ? fillSuggestion(
                                '请用 knowledge_add 将以下资料加入知识库，来源命名为「我的资料」：\n',
                              )
                            : setDialog('settings')
                        }
                      />
                    )}
                  </>
                )}
                {view === 'memory' && (
                  <>
                    <div className="metrics two">
                      <Metric
                        label="用户偏好"
                        value={String(
                          Object.keys(memories?.preferences || {}).length,
                        )}
                        icon={Settings2}
                      />
                      <Metric
                        label="最近的事实"
                        value={String(memories?.facts.length || 0)}
                        icon={Brain}
                      />
                    </div>
                    {Object.keys(memories?.preferences || {}).length > 0 && (
                      <div className="content-card">
                        <div className="card-heading">
                          <h3>你的偏好</h3>
                          <span>跨会话保留</span>
                        </div>
                        {Object.entries(memories?.preferences || {}).map(
                          ([key, value]) => (
                            <div className="preference-row" key={key}>
                              <span>{key}</span>
                              <strong>{value}</strong>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    {memories?.facts.length ? (
                      <div className="content-card">
                        <div className="card-heading">
                          <h3>值得记住的事</h3>
                          <span>最近 20 条</span>
                        </div>
                        {memories.facts.map((fact, index) => (
                          <div className="fact-row" key={index}>
                            <span className="fact-bullet" />
                            <p>{fact.content}</p>
                            <small>{fact.source || '对话记忆'}</small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Brain}
                        title="从认识你开始"
                        description="告诉 Agent 你的偏好或重要信息，它可以通过 remember 保存，并在以后的对话中使用。"
                        action="告诉 Agent 一件事"
                        onAction={() =>
                          fillSuggestion(
                            '请记住：我希望你用中文回答，先给结论，再解释过程。',
                          )
                        }
                      />
                    )}
                  </>
                )}
                {view === 'stats' && (
                  <>
                    <div className="metrics">
                      <Metric
                        label="模型调用"
                        value={formatNumber(stats?.llm_calls)}
                        icon={Sparkles}
                      />
                      <Metric
                        label="工具调用"
                        value={formatNumber(stats?.tool_calls)}
                        icon={Wrench}
                      />
                      <Metric
                        label="累计 Token"
                        value={formatNumber(stats?.total_tokens)}
                        icon={Zap}
                      />
                      <Metric
                        label="估算费用"
                        value={
                          stats?.cost_available === false
                            ? '暂无单价'
                            : `¥ ${stats?.cost_yuan?.toFixed(4) || '0.0000'}`
                        }
                        icon={Activity}
                      />
                    </div>
                    <div className="content-card token-card">
                      <div className="card-heading">
                        <h3>Token 使用分布</h3>
                        <span>累计用量</span>
                      </div>
                      <div className="token-total">
                        {formatNumber(stats?.total_tokens)}{' '}
                        <small>tokens</small>
                      </div>
                      <div className="token-bar">
                        <span
                          style={{
                            width: `${stats?.total_tokens ? (stats.prompt_tokens / stats.total_tokens) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="token-legend">
                        <span>
                          <i />
                          输入{' '}
                          <strong>{formatNumber(stats?.prompt_tokens)}</strong>
                        </span>
                        <span>
                          <i />
                          输出{' '}
                          <strong>
                            {formatNumber(stats?.completion_tokens)}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className="content-card">
                      <div className="preference-row">
                        <span>平均模型响应耗时</span>
                        <strong>
                          {formatNumber(stats?.avg_llm_latency_ms)} ms
                        </strong>
                      </div>
                      <div className="preference-row">
                        <span>当前运行模型</span>
                        <strong>{health?.model || '未连接'}</strong>
                      </div>
                      <p className="stats-note">
                        Token
                        用量以服务返回的数据为准；费用按项目内置单价估算。离线演示不产生
                        API 费用。
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
          <aside className="inspector">
            <div className="inspector-heading">
              <span>工作空间概览</span>
              <button
                className="icon-button"
                aria-label="刷新工作空间数据"
                onClick={() => void refresh()}
              >
                <MoreHorizontal size={17} />
              </button>
            </div>
            <div className="agent-card">
              <div className="agent-card-top">
                <BrandMark />
                <span className="ready-badge">
                  <span
                    className={`status-dot ${!connected ? 'offline' : ''}`}
                  />
                  {busy ? '正在工作' : connected ? '准备就绪' : '等待连接'}
                </span>
              </div>
              <h3>你的行动搭档</h3>
              <p>
                思考、调用、观察、回答。
                <br />
                把每一步，都落到实处。
              </p>
              <div className="agent-model">
                <span>当前模型</span>
                <strong>
                  {health?.mode === 'mock'
                    ? 'Mock / 离线演示'
                    : health?.model || '未连接'}{' '}
                  <Sparkles size={12} />
                </strong>
              </div>
            </div>
            <div className="inspector-section">
              <div className="section-label">
                当前会话 <span>SESSION</span>
              </div>
              <div className="session-row">
                <span>对话消息</span>
                <strong>
                  {messages.length}
                  <small> 条</small>
                </strong>
              </div>
              <div className="session-row">
                <span>上下文占用</span>
                <strong>
                  {usage ? formatNumber(usage.tokens) : '–'}
                  <small> tokens</small>
                </strong>
              </div>
              <div className="context-meter">
                <span style={{ width: `${contextPercent}%` }} />
              </div>
              <div className="context-caption">
                <span>
                  {usage
                    ? `${contextPercent.toFixed(1)}% 已使用`
                    : '新消息后更新'}
                </span>
                <span>
                  {formatNumber(usage?.max_tokens || health?.context_tokens)}{' '}
                  上限
                </span>
              </div>
            </div>
            <div className="inspector-section">
              <div className="section-label">
                已连接能力 <span>CAPABILITIES</span>
              </div>
              <button
                className="capability-row"
                onClick={() => navigate('tools')}
              >
                <span className="capability-icon">
                  <Wrench size={17} />
                </span>
                <div>
                  <strong>工具箱</strong>
                  <small>{tools.length} 个工具已注册</small>
                </div>
                <ChevronRight size={14} />
              </button>
              <button
                className="capability-row"
                onClick={() => navigate('knowledge')}
              >
                <span className="capability-icon">
                  <BookOpen size={17} />
                </span>
                <div>
                  <strong>知识库</strong>
                  <small>
                    {knowledge?.enabled
                      ? `${knowledge.sources.length} 个知识来源`
                      : '等待配置 Embedding'}
                  </small>
                </div>
                <ChevronRight size={14} />
              </button>
              <button
                className="capability-row"
                onClick={() => navigate('memory')}
              >
                <span className="capability-icon">
                  <Brain size={17} />
                </span>
                <div>
                  <strong>长期记忆</strong>
                  <small>
                    {memories
                      ? `${memories.facts.length} 条最近记忆`
                      : '等待连接'}
                  </small>
                </div>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="tip-card">
              <span>
                <Sparkles size={15} />
                一点小灵感
              </span>
              <p>
                清晰的目标 + 必要的背景，
                <br />
                会让你的 Agent 更懂你。
              </p>
              <button onClick={() => setDialog('help')}>
                了解如何开始 <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="inspector-bottom">
              <span className="tiny-star">✳</span> SMALL IDEAS. REAL
              POSSIBILITIES.
            </div>
          </aside>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
      {dialog === 'search' && (
        <DialogBox title="搜索对话" onClose={() => setDialog(null)} wide>
          <div className="search-dialog-input">
            <Search size={20} />
            <input
              autoFocus
              placeholder="输入标题关键词…"
              aria-label="搜索对话标题"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>ESC</kbd>
          </div>
          <div className="search-results">
            {searchedConversations.length ? (
              searchedConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => void openConversation(c.id)}
                  disabled={busy || historyLoading}
                >
                  <MessageSquare size={17} />
                  <span>
                    <strong>{c.title}</strong>
                    <small>
                      {c.message_count} 条消息 · {dateLabel(c.updated_at)}
                    </small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))
            ) : (
              <div className="search-empty">
                {query
                  ? '没有找到匹配的对话'
                  : '还没有历史对话，开启一个新任务吧'}
              </div>
            )}
          </div>
          <div className="dialog-footer">
            <Command size={13} />
            <span>⌘ / Ctrl + K 随时搜索</span>
          </div>
        </DialogBox>
      )}
      {dialog === 'settings' && (
        <DialogBox title="工作台设置" onClose={() => setDialog(null)}>
          <p className="dialog-description">让工作台更适合你的习惯。</p>
          <div className="settings-row">
            <div>
              <strong>外观主题</strong>
              <small>在浅色与深色之间切换</small>
            </div>
            <div className="segmented">
              <button
                className={theme === 'light' ? 'selected' : ''}
                onClick={() => setTheme('light')}
                aria-label="浅色主题"
              >
                <Sun size={16} />
              </button>
              <button
                className={theme === 'dark' ? 'selected' : ''}
                onClick={() => setTheme('dark')}
                aria-label="深色主题"
              >
                <Moon size={16} />
              </button>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>Enter 发送消息</strong>
              <small>关闭后使用发送按钮</small>
            </div>
            <button
              className={`toggle ${enterSends ? 'on' : ''}`}
              role="switch"
              aria-checked={enterSends}
              aria-label="Enter 发送消息"
              onClick={() => setEnterSends(!enterSends)}
            >
              <span />
            </button>
          </div>
          <div className="connection-instructions">
            <span>
              <Terminal size={16} />
              模型连接
            </span>
            <p>
              在项目根目录的 <code>.env</code> 中选择服务：
              <br />
              GLM：<code>LLM_PROVIDER=zai</code>，配置 <code>ZAI_API_KEY</code>{' '}
              与 <code>ZAI_MODEL</code>。<br />
              Qwen：<code>LLM_PROVIDER=qwen</code>，配置{' '}
              <code>QWEN_API_KEY</code> 与 <code>QWEN_MODEL</code>。<br />
              修改后重启 Python 服务。<code>--mock</code> 会强制保持演示模式。
              <br />
              语音服务：<code>MEDIA_PROVIDER=auto</code> 时使用 Qwen Key
              接入百炼转写与配音；也可选择 <code>openai</code> 并单独配置{' '}
              <code>MEDIA_API_KEY</code>、<code>MEDIA_BASE_URL</code>
              。视频分析需要安装 FFmpeg。
            </p>
            <div className="connection-detail">
              <span>当前服务</span>
              <strong>
                {health?.provider === 'zai'
                  ? 'Z.ai / Anthropic'
                  : health?.provider === 'qwen'
                    ? 'Qwen / OpenAI 兼容'
                    : '未连接'}
              </strong>
            </div>
            <div className="connection-detail">
              <span>当前模型</span>
              <strong>{health?.model || '未连接'}</strong>
            </div>
            <div className="connection-detail">
              <span>代码执行策略</span>
              <strong>{health?.exec_mode || '未连接'}</strong>
            </div>
          </div>
        </DialogBox>
      )}
      {dialog === 'help' && (
        <DialogBox
          title="把你的想法，交给 Agent"
          onClose={() => setDialog(null)}
        >
          <p className="dialog-description">一个好任务，通常包含这三件事。</p>
          <div className="help-step">
            <span>01</span>
            <div>
              <strong>说清目标</strong>
              <p>“对比三个 Agent 框架，帮我选择课程项目的技术路线。”</p>
            </div>
          </div>
          <div className="help-step">
            <span>02</span>
            <div>
              <strong>补充背景</strong>
              <p>“我熟悉 Python，项目需要支持工具调用与多轮对话。”</p>
            </div>
          </div>
          <div className="help-step">
            <span>03</span>
            <div>
              <strong>指定交付形式</strong>
              <p>“整理成一张表格，列出差异和选择理由，并附信息来源。”</p>
            </div>
          </div>
          <button
            className="primary-button full-width"
            onClick={() => {
              setDialog(null)
              fillSuggestion(suggestions[0].prompt)
            }}
          >
            试试一个研究任务 <ArrowRight size={16} />
          </button>
        </DialogBox>
      )}
      {selectedTool && (
        <DialogBox
          title={
            toolLabels[selectedTool.function.name] || selectedTool.function.name
          }
          onClose={() => setSelectedTool(null)}
        >
          <code className="tool-detail-name">{selectedTool.function.name}</code>
          <p className="dialog-description">
            {selectedTool.function.description}
          </p>
          <h3 className="detail-subtitle">调用参数</h3>
          {Object.entries(
            selectedTool.function.parameters.properties || {},
          ).map(([name, param]) => (
            <div className="parameter" key={name}>
              <div>
                <code>{name}</code>
                <span>{param.type || 'any'}</span>
                {selectedTool.function.parameters.required?.includes(name) && (
                  <small>必填</small>
                )}
              </div>
              <p>{param.description || '无额外说明'}</p>
            </div>
          ))}
          {!Object.keys(selectedTool.function.parameters.properties || {})
            .length && <p className="muted">无需参数。</p>}
          <p className="detail-note">
            Agent 会根据任务自动选择工具。代码执行工具遵循服务端授权策略。
          </p>
        </DialogBox>
      )}
      {editConversation && (
        <DialogBox title="重命名对话" onClose={() => setEditConversation(null)}>
          <form onSubmit={(event) => void rename(event)}>
            <label className="field-label" htmlFor="conversation-title">
              对话名称
            </label>
            <input
              className="text-field"
              id="conversation-title"
              autoFocus
              value={editTitle}
              maxLength={100}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <button
              className="primary-button full-width"
              disabled={!editTitle.trim()}
              type="submit"
            >
              保存名称 <Check size={16} />
            </button>
          </form>
        </DialogBox>
      )}
      {deleteConversation && (
        <DialogBox
          title="删除这段对话？"
          onClose={() => setDeleteConversation(null)}
        >
          <p className="dialog-description">
            “{deleteConversation.title}”及其消息将从本地历史记录中删除。
          </p>
          <div className="dialog-button-row">
            <button
              className="secondary-button"
              onClick={() => setDeleteConversation(null)}
            >
              保留对话
            </button>
            <button
              className="danger-button"
              onClick={() => void removeConversation()}
            >
              删除对话
            </button>
          </div>
        </DialogBox>
      )}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: typeof BookOpen
  title: string
  description: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={29} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="primary-button" onClick={onAction}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  )
}
function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Activity
}) {
  return (
    <div className="metric">
      <div>
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
    </div>
  )
}
function DialogBox({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const element = dialogRef.current
    element?.showModal()
    element?.querySelector<HTMLInputElement>('input')?.focus()
    return () => {
      element?.close()
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      className={`dialog ${wide ? 'wide' : ''}`}
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const bounds = e.currentTarget.getBoundingClientRect()
          if (
            e.clientX < bounds.left ||
            e.clientX > bounds.right ||
            e.clientY < bounds.top ||
            e.clientY > bounds.bottom
          )
            onClose()
        }
      }}
      aria-label={title}
    >
      <div className="dialog-header">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="关闭弹窗" onClick={onClose}>
          <X size={19} />
        </button>
      </div>
      {children}
    </dialog>
  )
}

export default App
