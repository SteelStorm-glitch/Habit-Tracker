import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Brain } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'
import { InsightCard } from './InsightCard'

export const InsightsDashboardWidget: React.FC = () => {
  const { insightsResult, setActiveTab } = useHabitStore()
  const { t } = useTranslation()

  const { insights, dataCompleteness } = insightsResult
  const { currentDays, requiredDays } = dataCompleteness
  const progressPercent = Math.min(100, Math.round((currentDays / requiredDays) * 100))

  return (
    <div className="space-y-3">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Brain className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              {t.insights.widgetTitle}
              {insights.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {insights.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-400">
              {t.insights.widgetSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('insights')}
          className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group"
        >
          <span>{t.insights.viewAll}</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Widget Content: Insights Cards or Progress Gauge */}
      {insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.slice(0, 3).map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      ) : currentDays < requiredDays ? (
        <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.insights.needMoreDataTitle} ({t.insights.historyProgress(currentDays, requiredDays)})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {t.insights.needMoreDataDesc(currentDays, requiredDays)}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-300 font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 self-start sm:self-auto">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar with glow */}
          <div className="relative w-full h-2 rounded-full bg-neutral-800/80 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"
              style={{
                boxShadow: '0 0 10px rgba(129, 140, 248, 0.5)'
              }}
            />
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl glass-card border border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
              <Brain className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                История собрана ({currentDays} дн.)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Локальный алгоритм анализирует активность. Новые инсайты появятся автоматически при фиксации выраженных взаимосвязей (от 20% эффекта).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
