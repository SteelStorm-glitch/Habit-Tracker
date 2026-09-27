import React, { useState, useRef, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sliders, 
  Key, 
  Cpu, 
  Check,
  ChevronUp
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const AiDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    aiMessages, 
    sendAiMessage, 
    generateAiTask, 
    aiSettings, 
    updateAiSettings 
  } = useHabitStore()

  const [inputText, setInputText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(aiSettings.apiKey || '')
  const [modelInput, setModelInput] = useState(aiSettings.model || 'local-default')
  const [providerInput, setProviderInput] = useState(aiSettings.provider || 'local')
  const [settingsSaved, setSettingsSaved] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendAiMessage(inputText)
    setInputText('')
  }

  const handleQuickPrompt = (prompt: string) => {
    sendAiMessage(prompt)
  }

  const handleSaveSettings = () => {
    updateAiSettings({
      provider: providerInput,
      apiKey: apiKeyInput.trim(),
      model: modelInput.trim()
    })
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2000)
  }

  return (
    <Sheet open={isAiDrawerOpen} onOpenChange={setIsAiDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0e0f14]/90 backdrop-blur-2xl border-l border-white/10 text-neutral-100 p-0 flex flex-col h-full overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>AI Советник</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono border border-indigo-500/20">
                  {aiSettings.provider === 'local' ? 'Локальный' : aiSettings.provider.toUpperCase()}
                </span>
              </SheetTitle>
              <div className="text-[11px] text-neutral-400">Персональный анализ и генерация задач</div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`mr-8 p-2 rounded-xl transition-all cursor-pointer ${
              showSettings ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Настройки AI модели"
          >
            <Sliders className="size-4" />
          </button>
        </SheetHeader>

        {/* Collapsible AI Model Settings */}
        {showSettings && (
          <div className="p-4 bg-white/[0.04] border-b border-white/10 space-y-3 animate-slide-down">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <div className="flex items-center gap-1.5">
                <Cpu className="size-3.5 text-indigo-400" />
                <span>Настройка AI модели</span>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
              >
                <span>Свернуть</span>
                <ChevronUp className="size-3" />
              </button>
            </div>

            {/* Provider Selector */}
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Провайдер интеллекта</label>
              <select
                value={providerInput}
                onChange={(e) => {
                  const val = e.target.value as any
                  setProviderInput(val)
                  if (val === 'local') setModelInput('local-default')
                  if (val === 'openai') setModelInput('gpt-4o-mini')
                  if (val === 'gemini') setModelInput('gemini-1.5-flash')
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              >
                <option value="local">🤖 Встроенная модель (бесплатно, оффлайн)</option>
                <option value="openai">⚡ OpenAI API (GPT-4o / GPT-4o-mini)</option>
                <option value="gemini">🧠 Google Gemini API (Flash / Pro)</option>
                <option value="custom">🛠️ Пользовательский API (OpenAI-compatible)</option>
              </select>
            </div>

            {/* API Key (if not local) */}
            {providerInput !== 'local' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Key className="size-3 text-amber-400" />
                  <span>API Ключ</span>
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-... или AIzaSy..."
                  className="w-full h-8 px-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            )}

            {/* Model Name */}
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Модель</label>
              <input
                type="text"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="local-default / gpt-4o / gemini-1.5-flash"
                className="w-full h-8 px-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                {settingsSaved ? (
                  <>
                    <Check className="size-3.5 text-emerald-300" />
                    <span>Сохранено!</span>
                  </>
                ) : (
                  <span>Сохранить настройки</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x">
          <button
            onClick={() => generateAiTask()}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] font-medium text-purple-300 cursor-pointer transition-all active:scale-95"
            title="AI придумает задачу и даст +30 XP"
          >
            <Sparkles className="size-3 text-purple-400" />
            <span>Сгенерировать задачу (+30 XP)</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('Как улучшить мою дисциплину и привычки?')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="size-3 text-indigo-400" />
            <span>Дисциплина</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('Проанализируй мои дедлайны и задачи')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 cursor-pointer transition-colors"
          >
            <AlertTriangle className="size-3 text-amber-400" />
            <span>Дедлайны</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('Дай совет по оптимизации расходов')}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 cursor-pointer transition-colors"
          >
            <TrendingUp className="size-3 text-emerald-400" />
            <span>Финансы</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {aiMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 animate-slide-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="size-7 rounded-xl bg-indigo-600/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed backdrop-blur-md shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600/90 text-white rounded-br-xs border border-indigo-500/40'
                    : 'bg-white/8 border border-white/10 text-neutral-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
                <div className="text-[9px] text-neutral-400 text-right mt-1 font-mono">
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="size-7 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Спросите совет или напишите «придумай задачу»..."
            className="flex-1 h-9 px-3 rounded-xl glass-input text-xs text-white placeholder:text-neutral-500"
          />
          <button
            type="submit"
            className="size-9 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95 border border-indigo-500/30"
          >
            <Send className="size-4" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
