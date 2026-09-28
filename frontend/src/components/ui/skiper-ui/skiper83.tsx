"use client"

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Search, 
  Video, 
  Flame, 
  CheckSquare, 
  Wallet, 
  X, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// BRAND ICONS & SVGS FOR INTEGRATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  </svg>
)

export const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
)

export const NotionIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.69c-.42-.326-.98-.747-2.054-.653L2.965 2.062c-.42.046-.56.28-.373.466l1.867 1.68zm.84 3.733v12.457c0 .653.373.933 1.073.886l14.288-.84c.7-.046.887-.466.887-1.026V6.915c0-.56-.233-.84-.793-.793l-14.568.84c-.607.047-.887.327-.887.98zm13.355.84c.093.42 0 .84-.42.887l-.7.14v8.399c-.466.28-.98.42-1.493.42-.84 0-1.213-.28-1.913-.98l-4.527-7.14v6.86l1.353.28c.047.467-.28.84-.746.887l-3.22.187c-.093-.42 0-.84.42-.887l.886-.187V9.715l-1.26-.094c-.046-.466.187-.886.747-.933l3.36-.233 4.807 7.373V9.528l-1.213-.14c-.047-.467.233-.84.793-.887l3.22-.187z" />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface IntegrationMention {
  id: string
  trigger: string
  label: string
  category: 'media' | 'search' | 'notes' | 'app'
  description: string
  icon: React.ReactNode
  accentColor: string
  badgeColor: string
  exampleQuery: string
}

export const INTEGRATION_MENTIONS: IntegrationMention[] = [
  {
    id: 'yt',
    trigger: '@yt',
    label: 'YouTube',
    category: 'media',
    description: 'Поиск видео, воркаутов и обучающих гайдов',
    icon: <YouTubeIcon className="size-4 text-red-500" />,
    accentColor: '#ef4444',
    badgeColor: 'bg-red-500/15 border-red-500/30 text-red-300',
    exampleQuery: '@yt утренняя растяжка 10 минут',
  },
  {
    id: 'google',
    trigger: '@google',
    label: 'Google Search',
    category: 'search',
    description: 'Научные факты, статьи и аналитика привычек',
    icon: <GoogleGIcon className="size-4" />,
    accentColor: '#3b82f6',
    badgeColor: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    exampleQuery: '@google сколько формируется дофаминовая петля',
  },
  {
    id: 'notion',
    trigger: '@notion',
    label: 'Notion Workspace',
    category: 'notes',
    description: 'Шаблоны планирования и экспорт в Notion',
    icon: <NotionIcon className="size-4 text-neutral-200" />,
    accentColor: '#a1a1aa',
    badgeColor: 'bg-neutral-200/10 border-neutral-200/25 text-neutral-200',
    exampleQuery: '@notion составь шаблон спринта на 7 дней',
  },
  {
    id: 'habits',
    trigger: '@habits',
    label: 'Привычки',
    category: 'app',
    description: 'Контекст активных привычек, стрика и отметок',
    icon: <Flame className="size-4 text-amber-400" />,
    accentColor: '#f59e0b',
    badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    exampleQuery: '@habits проанализируй мои пропуски за неделю',
  },
  {
    id: 'tasks',
    trigger: '@tasks',
    label: 'Задачи',
    category: 'app',
    description: 'Контекст текущих задач, дедлайнов и приоритетов',
    icon: <CheckSquare className="size-4 text-purple-400" />,
    accentColor: '#a855f7',
    badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    exampleQuery: '@tasks помоги расставить приоритеты на сегодня',
  },
  {
    id: 'finance',
    trigger: '@finance',
    label: 'Финансы',
    category: 'app',
    description: 'Контекст баланса, подписок и расходов месяца',
    icon: <Wallet className="size-4 text-emerald-400" />,
    accentColor: '#10b981',
    badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    exampleQuery: '@finance как сэкономить на регулярных подписках',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-FIDELITY WEB AUDIO SOUND SYNTHESIZER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Synthesizes a crisp, modern message-sent swoosh/pop sound.
 * Zero external audio files required: works offline, in Android APK, and across browsers.
 */
export function playMessageSentSound(muted: boolean = false) {
  if (muted || typeof window === 'undefined') return

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const t = ctx.currentTime

    // Oscillator 1: High crisp pop
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, t) // D5
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.07) // A5

    gain1.gain.setValueAtTime(0.18, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    // Oscillator 2: Shimmer overtone
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(880, t + 0.03) // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, t + 0.12) // D6

    gain2.gain.setValueAtTime(0.12, t + 0.03)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc1.start(t)
    osc2.start(t + 0.03)
    osc1.stop(t + 0.18)
    osc2.stop(t + 0.22)
  } catch {
    // Autoplay restrictions or audio disabled
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE MENTION CARDS (Rendered in Chat Messages)
// ─────────────────────────────────────────────────────────────────────────────

export interface MentionCardProps {
  type: string
  query?: string
}

export const InteractiveMentionCard: React.FC<MentionCardProps> = ({ type, query }) => {
  const [copied, setCopied] = useState(false)

  if (type === 'yt') {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query || 'привычки продуктивность')}`
    return (
      <div className="my-2 p-3 rounded-2xl bg-[#180a0d] border border-red-500/25 shadow-lg shadow-red-500/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <YouTubeIcon className="size-3.5" />
            </div>
            <span className="text-xs font-semibold text-red-200">YouTube Video Hub</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 font-mono">
            @yt
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug">
          По запросу <span className="font-semibold text-white">«{query || 'видео-гайды'}»</span> подготовлена подборка обучающих роликов.
        </p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shadow-sm shadow-red-600/30"
        >
          <Video className="size-3" />
          <span>Смотреть ролики</span>
          <ExternalLink className="size-2.5 opacity-70" />
        </a>
      </div>
    )
  }

  if (type === 'google') {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query || 'психология привычек')}`
    return (
      <div className="my-2 p-3 rounded-2xl bg-[#09101f] border border-blue-500/25 shadow-lg shadow-blue-500/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <GoogleGIcon className="size-3.5" />
            </div>
            <span className="text-xs font-semibold text-blue-200">Google Knowledge</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-mono">
            @google
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug">
          Поиск по научным исследованиям: <span className="font-semibold text-white">«{query || 'привычки'}»</span>.
        </p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shadow-sm shadow-blue-600/30"
        >
          <Search className="size-3" />
          <span>Открыть в Google</span>
          <ExternalLink className="size-2.5 opacity-70" />
        </a>
      </div>
    )
  }

  if (type === 'notion') {
    const handleCopyTemplate = () => {
      const markdown = `# 📋 Трекер привычек (Notion Template)\n- [ ] Утренняя вода (1 стакан)\n- [ ] Зарядка / Спорт (15 мин)\n- [ ] Чтение книги (10 стр)\n- [ ] Фокус по работе (Помодоро)\n- [ ] Итоги дня и сон в 23:00`
      navigator.clipboard?.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="my-2 p-3 rounded-2xl bg-[#141416] border border-white/20 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <NotionIcon className="size-3.5" />
            </div>
            <span className="text-xs font-semibold text-white">Notion Template</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
            @notion
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug">
          Сгенерирован структурированный Markdown-шаблон для вставки в рабочую страницу Notion.
        </p>
        <button
          type="button"
          onClick={handleCopyTemplate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          <span>{copied ? 'Скопировано в буфер!' : 'Копировать Markdown'}</span>
        </button>
      </div>
    )
  }

  if (type === 'habits') {
    return (
      <div className="my-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">Habit Tracker Context</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
            @habits
          </span>
        </div>
        <p className="text-[11px] text-zinc-300">
          Данные о вашем текущем стрике, привычках и дневном прогрессе учтены в ответе AI.
        </p>
      </div>
    )
  }

  if (type === 'tasks') {
    return (
      <div className="my-2 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="size-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">Tasks Context</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
            @tasks
          </span>
        </div>
        <p className="text-[11px] text-zinc-300">
          Синхронизированы задачи с дедлайнами и приоритетами для фокуса.
        </p>
      </div>
    )
  }

  if (type === 'finance') {
    return (
      <div className="my-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Finance Hub Context</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
            @finance
          </span>
        </div>
        <p className="text-[11px] text-zinc-300">
          Баланс за месяц и активные подписки подключены к финансовому советнику.
        </p>
      </div>
    )
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSER HELPER: Extracts mentions and returns rich fragments
// ─────────────────────────────────────────────────────────────────────────────

export function parseMessageWithMentions(text: string) {
  const mentionTriggers = ['@yt', '@google', '@notion', '@habits', '@tasks', '@finance']
  const detected = mentionTriggers.filter(tr => text.includes(tr))

  return {
    rawText: text,
    detectedMentions: detected.map(tr => tr.replace('@', '')),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SKIPER83 CHAT COMPOSER WITH SMART @MENTIONS & SOUND EFFECT
// ─────────────────────────────────────────────────────────────────────────────

interface Skiper83ComposerProps {
  onSendMessage: (text: string, activeMentions: string[]) => void
  placeholder?: string
  className?: string
}

export const Skiper83ChatComposer: React.FC<Skiper83ComposerProps> = ({
  onSendMessage,
  placeholder = 'Напишите @ для интеграций (@yt, @google, @notion)...',
  className = '',
}) => {
  const [text, setText] = useState('')
  const [showMentionMenu, setShowMentionMenu] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [attachedMentions, setAttachedMentions] = useState<IntegrationMention[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Filter integrations based on @query
  const filteredMentions = React.useMemo(() => {
    if (!mentionQuery) return INTEGRATION_MENTIONS
    const q = mentionQuery.toLowerCase()
    return INTEGRATION_MENTIONS.filter(
      m => m.trigger.toLowerCase().includes(q) || m.label.toLowerCase().includes(q)
    )
  }, [mentionQuery])

  // Handle typing & detecting "@"
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setText(val)

    const atIndex = val.lastIndexOf('@')
    if (atIndex !== -1 && atIndex >= val.length - 15) {
      const query = val.slice(atIndex)
      setMentionQuery(query)
      setShowMentionMenu(true)
      setSelectedIndex(0)
    } else {
      setShowMentionMenu(false)
      setMentionQuery('')
    }
  }

  // Insert mention into input
  const insertMention = useCallback((mention: IntegrationMention) => {
    const atIndex = text.lastIndexOf('@')
    let nextText = ''
    if (atIndex !== -1) {
      nextText = text.slice(0, atIndex) + mention.trigger + ' '
    } else {
      nextText = (text ? text + ' ' : '') + mention.trigger + ' '
    }

    setText(nextText)
    setShowMentionMenu(false)
    setMentionQuery('')

    // Add to attached mentions if not already attached
    setAttachedMentions(prev => {
      if (prev.find(m => m.id === mention.id)) return prev
      return [...prev, mention]
    })

    inputRef.current?.focus()
  }, [text])

  const removeAttachedMention = (id: string) => {
    setAttachedMentions(prev => prev.filter(m => m.id !== id))
  }

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentionMenu && filteredMentions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredMentions.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredMentions.length) % filteredMentions.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        insertMention(filteredMentions[selectedIndex])
        return
      }
      if (e.key === 'Escape') {
        setShowMentionMenu(false)
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!text.trim() && attachedMentions.length === 0) return

    // Play crisp synthesized sound effect!
    playMessageSentSound(!soundEnabled)

    const mentionIds = attachedMentions.map(m => m.id)
    onSendMessage(text.trim(), mentionIds)

    setText('')
    setAttachedMentions([])
    setShowMentionMenu(false)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Attached Mention Chips (Above Composer) */}
      <AnimatePresence>
        {attachedMentions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 mb-1.5 rounded-xl bg-white/[0.03] border border-white/10"
          >
            <span className="text-[10px] text-zinc-400 font-mono mr-1">Интеграции:</span>
            {attachedMentions.map(m => (
              <span
                key={m.id}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${m.badgeColor}`}
              >
                {m.icon}
                <span>{m.label}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedMention(m.id)}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SMART @MENTION FLOATING POPOVER */}
      <AnimatePresence>
        {showMentionMenu && filteredMentions.length > 0 && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute bottom-full mb-2.5 left-0 w-full max-w-sm rounded-2xl bg-[#0c0919] border border-purple-500/30 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 backdrop-blur-xl"
          >
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-purple-400 flex items-center justify-between border-b border-white/5 mb-1">
              <span>Интеграции @mention</span>
              <span className="text-zinc-500">Enter для выбора</span>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
              {filteredMentions.map((m, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => insertMention(m)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/25 border border-purple-500/40 text-white shadow-xs'
                        : 'text-zinc-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {m.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{m.label}</span>
                          <span className="font-mono text-[10px] text-purple-300 opacity-80">
                            {m.trigger}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-[210px]">
                          {m.description}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Box */}
      <div className="relative flex items-center rounded-2xl bg-[#110d22] border border-purple-500/25 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 shadow-lg p-1.5 transition-all">
        {/* Trigger Helper Quick Button */}
        <button
          type="button"
          onClick={() => {
            setText(prev => (prev ? prev + ' @' : '@'))
            setShowMentionMenu(true)
            inputRef.current?.focus()
          }}
          className="size-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer shrink-0 border border-purple-500/20"
          title="Вставить интеграцию (@yt, @google, @notion)"
        >
          @
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 h-9 px-3 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
        />

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`size-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 mr-1 ${
            soundEnabled
              ? 'text-purple-300 hover:bg-purple-500/15'
              : 'text-zinc-500 hover:bg-white/5 line-through'
          }`}
          title={soundEnabled ? 'Звук отправки включён' : 'Звук выключен'}
        >
          {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
        </button>

        {/* Submit Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && attachedMentions.length === 0}
          className="size-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-purple-600/30 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0"
          title="Отправить сообщение"
        >
          <Send className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
