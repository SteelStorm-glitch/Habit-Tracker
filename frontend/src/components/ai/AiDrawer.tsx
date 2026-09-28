import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  TrendingUp,
  ChevronDown,
  Check,
  Zap,
  Crown,
  ShieldCheck,
  Flame
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { AVAILABLE_MODELS } from '@/lib/gemini'
import { 
  Skiper83ChatComposer, 
  InteractiveMentionCard, 
  parseMessageWithMentions,
  YouTubeIcon,
  GoogleGIcon,
  NotionIcon
} from '@/components/ui/skiper-ui/skiper83'

export const AiDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    aiMessages, 
    sendAiMessage, 
    generateAiTask, 
    isAiThinking,
    aiSettings,
    updateAiSettings
  } = useHabitStore()

  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentModelOption = AVAILABLE_MODELS.find(m => m.id === aiSettings.model) || AVAILABLE_MODELS[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, isAiThinking])

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false)
      }
    }
    if (isModelMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModelMenuOpen])

  const handleQuickPrompt = (prompt: string) => {
    sendAiMessage(prompt)
  }

  const handleSelectModel = (modelId: string) => {
    updateAiSettings({ model: modelId })
    setIsModelMenuOpen(false)
  }

  return (
    <Sheet open={isAiDrawerOpen} onOpenChange={setIsAiDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0e0f14]/90 backdrop-blur-2xl border-l border-white/10 text-neutral-100 p-0 flex flex-col h-full overflow-hidden shadow-2xl"
      >
        {/* Header with Interactive Model Selector */}
        <SheetHeader className="px-5 py-3.5 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02] relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] shrink-0">
              <Flame className="size-4 animate-streak-fire" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base font-bold text-white tracking-tight">
                  Коуч «Огонёк»
                </SheetTitle>

                {/* Model Selector Pill / Dropdown Trigger */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsModelMenuOpen(prev => !prev)}
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono border border-indigo-500/30 transition-all cursor-pointer active:scale-95 shadow-sm"
                    title="Выбрать модель Gemini (или авто-резерв при ошибках Google)"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">{currentModelOption.name}</span>
                    <ChevronDown className={`size-3 text-indigo-400 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isModelMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#131126]/95 border border-purple-500/30 shadow-2xl shadow-purple-950/60 backdrop-blur-2xl p-2 z-50 divide-y divide-white/5"
                      >
                        <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Выбор модели Gemini</span>
                          <span className="text-[9px] text-emerald-400 lowercase font-mono">каскадный резерв</span>
                        </div>

                        <div className="py-1 space-y-1">
                          {AVAILABLE_MODELS.map((m) => {
                            const isSelected = m.id === currentModelOption.id
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => handleSelectModel(m.id)}
                                className={`w-full text-left p-2 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                                  isSelected
                                    ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                                    : 'hover:bg-white/5 text-neutral-300 border border-transparent'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                    {m.isFlagship && <Crown className="size-3 text-amber-400 shrink-0" />}
                                    {m.id === 'gemma-4-26b-a4b-it' && <ShieldCheck className="size-3 text-emerald-400 shrink-0" />}
                                    {!m.isFlagship && m.id !== 'gemma-4-26b-a4b-it' && <Zap className="size-3 text-indigo-400 shrink-0" />}
                                    <span>{m.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-neutral-300 font-normal">
                                      {m.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-neutral-400 leading-tight">
                                    {m.description}
                                  </p>
                                </div>
                                {isSelected && (
                                  <div className="size-4 rounded-full bg-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="size-2.5 text-white stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        <div className="px-2.5 pt-2 pb-1 text-[10px] text-neutral-400 leading-snug">
                          💡 <span className="text-neutral-300">Авто-резерв:</span> если выбранная модель столкнётся с 503/429 на серверах Google, система мгновенно ответит через резервную модель.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400">Персональный анализ привычек и дисциплины</div>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Suggestion Chips with @mention shortcuts */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x">
          <button
            type="button"
            onClick={() => generateAiTask()}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] font-medium text-purple-300 cursor-pointer transition-all active:scale-95"
            title="AI придумает задачу и даст +30 XP"
          >
            <Sparkles className="size-3 text-purple-400" />
            <span>Сгенерировать задачу (+30 XP)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPrompt('@yt подбери видео для утренней пробежки и разминки')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[11px] font-medium text-red-300 cursor-pointer transition-all active:scale-95"
          >
            <YouTubeIcon className="size-3" />
            <span>@yt Видео</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPrompt('@google научные исследования о пользе питьевого режима')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] font-medium text-blue-300 cursor-pointer transition-all active:scale-95"
          >
            <GoogleGIcon className="size-3" />
            <span>@google Поиск</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPrompt('@notion создай шаблон трекера привычек на спринт')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[11px] font-medium text-white cursor-pointer transition-all active:scale-95"
          >
            <NotionIcon className="size-3" />
            <span>@notion Шаблон</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPrompt('@habits как распределить привычки по времени дня?')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-[11px] text-amber-300 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="size-3 text-amber-400" />
            <span>@habits Дисциплина</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPrompt('@finance как оптимизировать мои ежемесячные расходы?')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] text-emerald-300 cursor-pointer transition-colors"
          >
            <TrendingUp className="size-3 text-emerald-400" />
            <span>@finance Бюджет</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {aiMessages.map(msg => {
            const { detectedMentions } = parseMessageWithMentions(msg.text)

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-slide-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="size-7 rounded-xl bg-purple-600/25 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-sm mt-0.5">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed backdrop-blur-md shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs border border-purple-500/40 shadow-[0_4px_15px_rgba(147,51,234,0.25)]'
                      : 'bg-[#120e22] border border-white/10 text-neutral-200 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Interactive Integration Mention Cards */}
                  {detectedMentions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {detectedMentions.map(mentionId => (
                        <InteractiveMentionCard
                          key={mentionId}
                          type={mentionId}
                          query={msg.text.replace(/@\w+/g, '').trim()}
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-neutral-400 text-right mt-1.5 font-mono opacity-80">
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="size-7 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            )
          })}

          {/* AI Thinking / Typing Indicator */}
          <AnimatePresence>
            {isAiThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.92, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="flex gap-2.5 items-end justify-start animate-fade-in"
              >
                <div className="size-7 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.3)] relative mb-0.5">
                  <Bot className="size-4 animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>

                <div className="rounded-2xl rounded-bl-xs px-4 py-2.5 bg-[#120e22]/95 border border-purple-500/30 backdrop-blur-xl shadow-lg shadow-purple-950/30 flex items-center gap-3">
                  {/* Three Bouncing / Pulsating Dots */}
                  <div className="flex items-center gap-1.5 py-0.5">
                    <motion.span
                      className="size-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]"
                      animate={{
                        y: [-2.5, 2.5, -2.5],
                        opacity: [0.35, 1, 0.35],
                        scale: [0.85, 1.25, 0.85]
                      }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0
                      }}
                    />
                    <motion.span
                      className="size-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]"
                      animate={{
                        y: [-2.5, 2.5, -2.5],
                        opacity: [0.35, 1, 0.35],
                        scale: [0.85, 1.25, 0.85]
                      }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                    />
                    <motion.span
                      className="size-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.9)]"
                      animate={{
                        y: [-2.5, 2.5, -2.5],
                        opacity: [0.35, 1, 0.35],
                        scale: [0.85, 1.25, 0.85]
                      }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                    />
                  </div>

                  <span className="text-[11px] font-medium text-purple-200/90 tracking-wide select-none flex items-center gap-1">
                    <span>Огонёк думает</span>
                    <span className="inline-flex">
                      <span className="animate-pulse delay-0">.</span>
                      <span className="animate-pulse delay-150">.</span>
                      <span className="animate-pulse delay-300">.</span>
                    </span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Skiper83 Chat Composer with Smart @Mention Functionality & Sound Effect */}
        <div className="p-3 border-t border-white/10 bg-[#090614]/90 backdrop-blur-md">
          <Skiper83ChatComposer
            onSendMessage={(text) => {
              sendAiMessage(text)
            }}
            placeholder="Спросите совет или введите @ для интеграций (@yt, @google, @notion)..."
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
