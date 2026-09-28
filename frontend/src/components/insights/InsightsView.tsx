import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Zap,
  Wallet,
  Shield,
  Heart,
  Sparkles,
  Database,
  Lock,
  Layers
} from 'lucide-react'
import type { InsightCategory } from '@/types/habit'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'
import { InsightCard } from './InsightCard'

type FilterType = 'all' | InsightCategory

export const InsightsView: React.FC = () => {
  const { insightsResult, currentUser, setIsAuthModalOpen } = useHabitStore()
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const isGuest = !currentUser || currentUser.isGuest

  if (isGuest) {
    return (
      <div className="space-y-6 stagger-children max-w-3xl mx-auto py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Brain className="size-4.5" />
              </span>
              {t.insights.title}
            </h1>
            <p className="text-xs text-neutral-400">
              {t.insights.subtitle}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium self-start sm:self-auto">
            <Lock className="size-3.5" />
            <span>Требуется аккаунт</span>
          </div>
        </div>

        {/* Locked Feature Hero Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-card border border-white/10 p-8 sm:p-10 text-center relative overflow-hidden space-y-6 shadow-2xl shadow-indigo-950/40"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          {/* Icon */}
          <div className="relative mx-auto size-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-xl shadow-indigo-500/25">
            <div className="size-full bg-neutral-950/90 rounded-[23px] flex items-center justify-center">
              <Lock className="size-9 text-indigo-400" />
            </div>
          </div>

          <div className="space-y-2 relative z-10 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Кросс-модульные инсайты закрыты
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Инсайты автоматически анализируют пересечения между привычками, выполнением задач и финансовыми тратами. Чтобы алгоритм отслеживал взаимосвязи, войдите в аккаунт или зарегистрируйтесь.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left relative z-10">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                <Zap className="size-3.5" />
                <span>Привычки & Задачи</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Как ваши ритуалы влияют на скорость закрытия дел
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                <Wallet className="size-3.5" />
                <span>Финансы & Дни</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Дни пиковых трат и корреляция с продуктивностью
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <Sparkles className="size-3.5" />
                <span>Тренер «Огонёк»</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Персональные проактивные подсказки в реальном времени
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="size-4" />
              <span>Войти или зарегистрироваться</span>
            </button>
          </div>

          <p className="text-xs text-neutral-500 pt-1">
            Базовые функции (трекер привычек, простой список задач и финансы) остаются доступными без аккаунта.
          </p>
        </motion.div>
      </div>
    )
  }

  const { insights, dataCompleteness } = insightsResult
  const { currentDays, requiredDays } = dataCompleteness
  const progressPercent = Math.min(100, Math.round((currentDays / requiredDays) * 100))

  const filterTabs: Array<{ id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'all', label: t.insights.tabs.all, icon: Layers },
    { id: 'productivity', label: t.insights.tabs.productivity, icon: Zap },
    { id: 'spending', label: t.insights.tabs.spending, icon: Wallet },
    { id: 'discipline', label: t.insights.tabs.discipline, icon: Shield },
    { id: 'wellbeing', label: t.insights.tabs.wellbeing, icon: Heart }
  ]

  const filteredInsights = activeFilter === 'all'
    ? insights
    : insights.filter(ins => ins.category === activeFilter)

  return (
    <div className="space-y-6 stagger-children">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Brain className="size-4.5" />
            </span>
            {t.insights.title}
          </h1>
          <p className="text-xs text-neutral-400">
            {t.insights.subtitle}
          </p>
        </div>

        {/* Local Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium self-start sm:self-auto">
          <Lock className="size-3.5" />
          <span>100% Локальный расчёт</span>
        </div>
      </div>

      {/* Telemetry History Progress (if < 14 days) */}
      {currentDays < requiredDays && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl glass-card border border-white/5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                <Database className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {t.insights.needMoreDataTitle} ({t.insights.historyProgress(currentDays, requiredDays)})
                </h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                  {t.insights.needMoreDataDesc(currentDays, requiredDays)}
                </p>
              </div>
            </div>

            <span className="text-sm font-bold text-amber-300 font-mono px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 self-start sm:self-auto">
              {progressPercent}%
            </span>
          </div>

          <div className="relative w-full h-2.5 rounded-full bg-neutral-800/80 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"
              style={{
                boxShadow: '0 0 12px rgba(129, 140, 248, 0.5)'
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeFilter === tab.id
          const count = tab.id === 'all'
            ? insights.length
            : insights.filter(i => i.category === tab.id).length

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600/80 text-white border-indigo-500/50 shadow-lg shadow-indigo-600/20'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border-white/5 hover:border-white/10'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`size-4.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Insights Cards Grid */}
      <AnimatePresence mode="wait">
        {filteredInsights.length > 0 ? (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 rounded-2xl glass-card border border-white/5 text-center space-y-3"
          >
            <div className="size-12 rounded-2xl bg-neutral-800/60 border border-white/5 mx-auto flex items-center justify-center text-neutral-400">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {activeFilter === 'all' ? t.insights.emptyAll : t.insights.emptyCategory}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Система анализирует закономерности между вашими привычками, делами и расходами и выводит только проверенные статистические эффекты.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
