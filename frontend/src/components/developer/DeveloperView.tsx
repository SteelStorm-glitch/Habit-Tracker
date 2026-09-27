import React, { useState } from 'react'
import {
  Wrench,
  Sparkles,
  Trash2,
  Bell,
  Clock,
  Code,
  Copy,
  Upload,
  Lock,
  Check
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const DeveloperView: React.FC = () => {
  const {
    habits,
    tasks,
    finances,
    prefs,
    lockDevMode,
    virtualDateOffsetDays,
    shiftVirtualDays,
    resetVirtualTime,
    setVirtualDateString,
    getSimulatedNow,
    generateDemoData,
    wipeAllDevData,
    importStateJson
  } = useHabitStore()

  const [importJsonText, setImportJsonText] = useState('')
  const [showImportArea, setShowImportArea] = useState(false)
  const [targetDateInput, setTargetDateInput] = useState('2026-09-22')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const simulatedDate = getSimulatedNow()
  const simulatedDateStr = simulatedDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const fullState = {
    prefs,
    habits,
    tasks,
    finances,
    exportedAt: new Date().toISOString()
  }

  const handleCopyState = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(fullState, null, 2))
      }
      setActionNotice('Состояние скопировано в буфер обмена!')
    } catch {
      setActionNotice('Буфер обмена недоступен в текущей среде.')
    }
    setTimeout(() => setActionNotice(null), 2500)
  }

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Ваш браузер не поддерживает Web Notifications')
      return
    }
    let perm = Notification.permission
    if (perm !== 'granted') {
      perm = await Notification.requestPermission()
    }
    if (perm === 'granted') {
      new Notification('🎯 Habit: Тестовое уведомление', {
        body: 'Система напоминаний и push-уведомлений работает исправно!',
        icon: '/favicon.svg'
      })
      setActionNotice('Уведомление отправлено! 🔔')
      setTimeout(() => setActionNotice(null), 2500)
    } else {
      alert('Разрешение на отправку уведомлений отклонено в браузере.')
    }
  }

  const handleApplyImport = () => {
    if (!importJsonText.trim()) return
    const success = importStateJson(importJsonText.trim())
    if (success) {
      setShowImportArea(false)
      setImportJsonText('')
      setActionNotice('Состояние успешно импортировано!')
      setTimeout(() => setActionNotice(null), 2500)
    } else {
      alert('Ошибка формата JSON. Убедитесь в валидности структуры.')
    }
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl glass-card border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Wrench className="size-5 text-amber-400" />
              <span>Панель разработчика</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
              DEV MODE
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Прямой доступ к генераторам данных, симулятору времени и инспекции Live JSON.
          </p>
        </div>

        <button
          onClick={lockDevMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-800/40 text-xs font-medium transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Lock className="size-3.5" />
          <span>Отключить режим разработчика</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="size-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Dev Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Panel 1: QA Data Generator */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="size-4 text-emerald-400" />
              <span>Генератор демо-данных и тестирование QA</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={generateDemoData}
                className="h-10 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="size-3.5" />
                <span>Сгенерировать Demo Data</span>
              </button>

              <button
                onClick={wipeAllDevData}
                className="h-10 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Сбросить всё (0-State)</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleCopyState}
                className="h-8 rounded-lg bg-[#272a31] hover:bg-[#323640] border border-[#373c47] text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy className="size-3 text-neutral-400" />
                <span>Copy State</span>
              </button>

              <button
                onClick={() => setShowImportArea(prev => !prev)}
                className="h-8 rounded-lg bg-[#272a31] hover:bg-[#323640] border border-[#373c47] text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="size-3 text-neutral-400" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={handleTestNotification}
                className="h-8 rounded-lg bg-[#272a31] hover:bg-[#323640] border border-[#373c47] text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Bell className="size-3 text-amber-400" />
                <span>Test Notif</span>
              </button>
            </div>

            {showImportArea && (
              <div className="p-3 rounded-xl bg-[#16171a] border border-[#2d3139] space-y-2 mt-2">
                <label className="text-[11px] text-neutral-400 font-mono">Вставьте JSON состояния (habits, tasks, finances):</label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  rows={4}
                  placeholder='{"habits": [...], "tasks": [...], "finances": {...}}'
                  className="w-full p-2 rounded-lg bg-[#1c1e22] border border-[#2d3139] text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowImportArea(false)}
                    className="px-2.5 py-1 rounded-md text-xs text-neutral-400 hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleApplyImport}
                    className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Time Travel Simulator */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Clock className="size-4 text-amber-400" />
                <span>Машина времени (Time-Travel)</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                virtualDateOffsetDays === 0 ? 'bg-white/5 text-neutral-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {virtualDateOffsetDays === 0 ? '🕒 Реальное время' : `🕒 Сдвиг: ${virtualDateOffsetDays > 0 ? `+${virtualDateOffsetDays}` : virtualDateOffsetDays} дн.`}
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              Текущая виртуальная дата приложения: <strong className="text-white">{simulatedDateStr}</strong>.
            </p>

            {/* Quick Shift Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              <button
                onClick={() => shiftVirtualDays(-30)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                -1 мес
              </button>
              <button
                onClick={() => shiftVirtualDays(-7)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                -7 дн
              </button>
              <button
                onClick={() => shiftVirtualDays(-1)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                -1 дн
              </button>
              <button
                onClick={resetVirtualTime}
                className="py-1.5 px-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-mono text-indigo-300 cursor-pointer font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => shiftVirtualDays(1)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                +1 дн
              </button>
              <button
                onClick={() => shiftVirtualDays(7)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                +7 дн
              </button>
              <button
                onClick={() => shiftVirtualDays(30)}
                className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 cursor-pointer"
              >
                +1 мес
              </button>
            </div>

            {/* Direct date picker */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="date"
                value={targetDateInput}
                onChange={(e) => setTargetDateInput(e.target.value)}
                className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden"
              />
              <button
                onClick={() => setVirtualDateString(targetDateInput)}
                className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Установить дату
              </button>
            </div>
          </div>

          {/* Panel 3: Live JSON Inspector */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Code className="size-4 text-indigo-400" />
                <span>Инспектор состояния (Live JSON)</span>
              </div>
              <button
                onClick={handleCopyState}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 cursor-pointer"
              >
                <Copy className="size-3" />
                <span>Скопировать</span>
              </button>
            </div>

            <pre className="max-h-48 overflow-y-auto p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-400/90 leading-tight">
              {JSON.stringify(fullState, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
