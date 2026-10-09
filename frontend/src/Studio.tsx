import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Code2,
  Mic,
  Play,
  RefreshCw,
  Square,
  Upload,
  Video,
} from 'lucide-react'
import { request } from './api'
import type { Health } from './api'
import './Studio.css'

interface GeneratedApp {
  id: string
  title: string
  requirements?: string
  preview_url: string
  created_at?: number
}
interface UploadResult {
  file: string
  media_url: string
  name: string
  size: number
}
type Mode = 'apps' | 'audio' | 'video'
type AudioTask = 'transcribe' | 'practice' | 'speech' | 'podcast'

export default function Studio({
  health,
  busy,
  onPrompt,
  onSettings,
}: {
  health: Health | null
  busy: boolean
  onPrompt: (prompt: string) => void
  onSettings: () => void
}) {
  const [mode, setMode] = useState<Mode>('apps')
  const [audioTask, setAudioTask] = useState<AudioTask>('transcribe')
  const [text, setText] = useState('')
  const [file, setFile] = useState<UploadResult | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [apps, setApps] = useState<GeneratedApp[]>([])
  const [selected, setSelected] = useState<GeneratedApp | null>(null)
  const [recording, setRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioConfigured = Boolean(health?.audio_configured)
  const refresh = useCallback(async () => {
    try {
      setApps((await request<{ apps: GeneratedApp[] }>('/v1/apps')).apps)
    } catch (e) {
      setError(e instanceof Error ? e.message : '应用列表加载失败')
    }
  }, [])
  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0)
    const timer = window.setInterval(() => void refresh(), 15000)
    return () => {
      clearTimeout(initial)
      clearInterval(timer)
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.onstop = null
        recorderRef.current.stop()
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [refresh])

  async function upload(source: File) {
    setUploading(true)
    setError('')
    try {
      if (source.size > 32 * 1024 * 1024)
        throw new Error('请选择不超过 32 MB 的文件')
      const response = await fetch('/v1/uploads', {
        method: 'POST',
        headers: { 'X-File-Name': encodeURIComponent(source.name) },
        body: source,
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || '上传失败')
      setFile(payload)
    } catch (e) {
      setError(e instanceof Error ? e.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }
  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop()
      setRecording(false)
      return
    }
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === 'undefined'
      )
        throw new Error('当前浏览器不支持录音，请上传音频文件')
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const preferred = ['audio/webm', 'audio/mp4'].find((mime) =>
        MediaRecorder.isTypeSupported(mime),
      )
      const recorder = preferred
        ? new MediaRecorder(stream, { mimeType: preferred })
        : new MediaRecorder(stream)
      recorderRef.current = recorder
      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        const extension = recorder.mimeType.includes('mp4') ? 'm4a' : 'webm'
        void upload(
          new File(chunks, `录音.${extension}`, { type: recorder.mimeType }),
        )
      }
      recorder.start()
      setRecording(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : '无法启用麦克风')
    }
  }
  function run() {
    let prompt = ''
    if (mode === 'apps')
      prompt = `请调用 app_generate，按以下需求生成可交互网页应用并给出预览链接：\n${text}`
    if (mode === 'video')
      prompt = `请调用 video_analyze 分析本地视频 ${file?.file}：${text || '概括主要场景、动作及时间顺序，并说明抽帧分析的局限。'}`
    if (mode === 'audio') {
      if (audioTask === 'transcribe')
        prompt = `请调用 audio_transcribe 转写本地音频 ${file?.file}，保留原语言。`
      if (audioTask === 'practice')
        prompt = `请调用 voice_chat，以英语口语陪练模式处理 ${file?.file}，conversation_id 为 english-practice，返回纠错反馈与可播放回复。`
      if (audioTask === 'speech')
        prompt = `请调用 text_to_speech，为以下文字配音并提供播放链接：\n${text}`
      if (audioTask === 'podcast')
        prompt = `请调用 podcast_generate，制作约90秒中文播客，主题：${text}。提供完整脚本与播放链接。`
    }
    onPrompt(prompt)
  }
  const needsFile =
    mode === 'video' ||
    (mode === 'audio' && ['transcribe', 'practice'].includes(audioTask))
  const ready = needsFile ? Boolean(file) : Boolean(text.trim())
  const unavailable = mode === 'audio' && !audioConfigured

  return (
    <div className="studio">
      <div className="studio-tabs" role="tablist" aria-label="创作类型">
        {(
          [
            { id: 'apps', label: '描述生成应用', icon: Code2 },
            { id: 'audio', label: '声音工作室', icon: Mic },
            { id: 'video', label: '视频分析', icon: Video },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? 'active' : ''}
            onClick={() => {
              setMode(item.id)
              setFile(null)
              setText('')
              setError('')
            }}
            disabled={recording}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </div>
      <section className="studio-input-card">
        <div className="studio-card-heading">
          <span className="eyebrow">CREATE SOMETHING</span>
          <h2>
            {mode === 'apps'
              ? '说出需求，把它变成应用。'
              : mode === 'audio'
                ? '让声音，成为对话。'
                : '读懂视频里的每一幕。'}
          </h2>
        </div>
        {mode === 'audio' && (
          <div className="studio-audio-tasks">
            {(
              [
                { id: 'transcribe', label: '语音转文字' },
                { id: 'practice', label: '英语口语陪练' },
                { id: 'speech', label: '文字配音' },
                { id: 'podcast', label: '生成播客' },
              ] as const
            ).map((task) => (
              <button
                key={task.id}
                onClick={() => setAudioTask(task.id)}
                className={audioTask === task.id ? 'active' : ''}
                disabled={recording}
              >
                {task.label}
              </button>
            ))}
          </div>
        )}
        {unavailable && (
          <div className="studio-notice">
            语音服务尚未连接。配置后即可转写、配音和进行口语对话。
            <button onClick={onSettings}>
              查看配置 <ArrowRight size={13} />
            </button>
          </div>
        )}
        {needsFile && (
          <div className="studio-file-row">
            <label className="studio-upload">
              <Upload size={20} />
              <strong>
                {uploading
                  ? '正在上传…'
                  : file?.name ||
                    (mode === 'video' ? '选择视频文件' : '选择音频文件')}
              </strong>
              <span>文件保存在本地 · 最大 32 MB</span>
              <input
                aria-label={mode === 'video' ? '上传视频' : '上传音频'}
                type="file"
                accept={
                  mode === 'video'
                    ? '.mp4,.webm,.mov'
                    : '.mp3,.wav,.m4a,.ogg,.flac,.webm'
                }
                disabled={uploading || recording}
                onChange={(event) => {
                  const source = event.target.files?.[0]
                  if (source) void upload(source)
                  event.target.value = ''
                }}
              />
            </label>
            {mode === 'audio' && (
              <button
                className={`studio-record ${recording ? 'recording' : ''}`}
                onClick={() => void toggleRecording()}
                disabled={uploading}
              >
                {recording ? <Square size={18} /> : <Mic size={18} />}
                <span>{recording ? '结束录音' : '录一段声音'}</span>
              </button>
            )}
          </div>
        )}
        {file &&
          (mode === 'video' ? (
            <video
              className="studio-media"
              controls
              preload="metadata"
              src={file.media_url}
            />
          ) : (
            <audio className="studio-media" controls src={file.media_url} />
          ))}
        {(!needsFile || mode === 'video') && (
          <label className="studio-description">
            {mode === 'apps'
              ? '应用需求'
              : mode === 'video'
                ? '想了解什么？（可选）'
                : audioTask === 'podcast'
                  ? '播客主题'
                  : '配音文字'}
            <textarea
              aria-label={
                mode === 'apps'
                  ? '应用需求'
                  : mode === 'video'
                    ? '视频分析问题'
                    : '声音内容'
              }
              value={text}
              maxLength={6000}
              rows={4}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === 'apps'
                  ? '例如：做一个番茄钟，能设置专注时长、开始暂停，并统计今天完成了几次。'
                  : mode === 'video'
                    ? '例如：总结视频中的操作步骤。'
                    : '写下你想表达的内容…'
              }
            />
          </label>
        )}
        {mode === 'apps' && (
          <div className="studio-examples">
            {['番茄钟与专注统计', '可筛选的待办清单', '英语单词练习卡片'].map(
              (example) => (
                <button
                  key={example}
                  onClick={() =>
                    setText(
                      `生成一个${example}网页应用，中文界面，交互完整，简洁美观。`,
                    )
                  }
                >
                  {example}
                </button>
              ),
            )}
          </div>
        )}
        {error && (
          <p className="studio-error" role="alert">
            {error}
          </p>
        )}
        <div className="studio-bottom">
          <span>
            {mode === 'apps'
              ? '生成单页应用，可在下方预览和交互'
              : mode === 'video'
                ? '按时间抽帧分析；无声轨转写时只解释视觉信息'
                : '任务会在对话中执行，结果可回看'}
          </span>
          <button
            className="studio-run"
            onClick={run}
            disabled={
              !ready ||
              busy ||
              uploading ||
              recording ||
              unavailable ||
              !health ||
              health.mode === 'mock'
            }
          >
            {busy ? '对话正在执行…' : '开始创作'}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
      {mode === 'apps' && (
        <section className="studio-apps">
          <div className="section-toolbar">
            <h2>
              我的应用 <span>{apps.length}</span>
            </h2>
            <button className="studio-refresh" onClick={() => void refresh()}>
              <RefreshCw size={14} />
              刷新
            </button>
          </div>
          {!apps.length ? (
            <div className="studio-empty">
              <Code2 size={28} />
              <strong>你的第一个应用，从一句话开始。</strong>
              <p>生成完成后，应用会保存在这里。</p>
            </div>
          ) : (
            <div className="studio-app-grid">
              {apps.map((app) => (
                <button
                  key={app.id}
                  className={`studio-app-card ${selected?.id === app.id ? 'selected' : ''}`}
                  onClick={() => setSelected(app)}
                >
                  <span className="studio-app-icon">
                    <Code2 size={23} />
                  </span>
                  <strong>{app.title}</strong>
                  <p>{app.requirements || 'AI 生成的交互网页'}</p>
                  <span>
                    打开预览 <Play size={13} />
                  </span>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="studio-preview">
              <div>
                <strong>{selected.title}</strong>
                <button onClick={() => setSelected(null)}>关闭预览</button>
              </div>
              <iframe
                key={selected.id}
                title={`应用预览：${selected.title}`}
                src={selected.preview_url}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </section>
      )}
    </div>
  )
}
