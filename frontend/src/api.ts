export interface Health {
  status: string
  model: string
  tools: string[]
  exec_mode: string
  mode: 'mock' | 'live'
  context_tokens: number
}
export interface Conversation {
  id: string
  title: string
  updated_at: number
  message_count: number
}
export interface ToolSchema {
  type: string
  function: {
    name: string
    description: string
    parameters: {
      properties?: Record<string, { type?: string; description?: string }>
      required?: string[]
    }
  }
}
export interface ToolUse {
  name: string
  arguments: Record<string, unknown>
  ok: boolean
  result: string
}
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  tools?: ToolUse[]
  state?: 'streaming' | 'complete' | 'error' | 'stopped'
  error?: string
}
export interface Usage {
  tokens: number
  max_tokens: number
  messages: number
}
export interface Stats {
  llm_calls: number
  tool_calls: number
  total_tokens: number
  prompt_tokens: number
  completion_tokens: number
  cost_yuan: number
  avg_llm_latency_ms: number
}
export interface Knowledge {
  enabled: boolean
  total_chunks: number
  sources: string[]
}
export interface Memories {
  preferences: Record<string, string>
  facts: { content: string; source: string }[]
}
export interface StreamEvents {
  meta: { session_id: string; model: string }
  delta: { text: string }
  tool: ToolUse
  done: {
    content: string
    turns: number
    usage: Usage
    interrupted: boolean
    dropped: number
  }
  error: { message: string }
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `请求失败 (${response.status})`)
  }
  return response.json() as Promise<T>
}

// POST avoids URL length limits and keeps message text out of access logs.
export async function streamChat(
  message: string,
  sessionId: string,
  signal: AbortSignal,
  onEvent: <K extends keyof StreamEvents>(
    event: K,
    data: StreamEvents[K],
  ) => void,
) {
  const response = await fetch('/v1/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal,
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `请求失败 (${response.status})`)
  }
  if (!response.body) throw new Error('当前浏览器不支持流式响应')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let completed = false
  const dispatch = (block: string) => {
    const lines = block.split('\n')
    const event = lines
      .find((line) => line.startsWith('event:'))
      ?.slice(6)
      .trim() as keyof StreamEvents | undefined
    const data = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')
    if (!event || !data) return
    if (event === 'error')
      throw new Error((JSON.parse(data) as StreamEvents['error']).message)
    if (event === 'done') completed = true
    onEvent(event, JSON.parse(data))
  }
  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer = (buffer + decoder.decode(value, { stream: !done })).replace(
        /\r\n/g,
        '\n',
      )
      let end: number
      while ((end = buffer.indexOf('\n\n')) !== -1) {
        dispatch(buffer.slice(0, end))
        buffer = buffer.slice(end + 2)
      }
      if (done) break
    }
    if (buffer.trim()) dispatch(buffer)
    if (!completed) throw new Error('连接提前结束，回复可能不完整，请稍后重试')
  } finally {
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
