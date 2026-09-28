import React from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Wallet,
  Shield,
  Heart,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react'
import type { CrossModuleInsight, InsightCategory } from '@/types/habit'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'

interface InsightCardProps {
  insight: CrossModuleInsight
}

const CATEGORY_CONFIG: Record<
  InsightCategory,
  {
    labelRu: string
    labelEn: string
    color: string
    bgLight: string
    border: string
    glow: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  productivity: {
    labelRu: 'Продуктивность',
    labelEn: 'Productivity',
    color: '#818cf8',
    bgLight: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    glow: 'rgba(99, 102, 241, 0.15)',
    icon: Zap
  },
  spending: {
    labelRu: 'Траты и бюджет',
    labelEn: 'Spending',
    color: '#f59e0b',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.15)',
    icon: Wallet
  },
  discipline: {
    labelRu: 'Дисциплина',
    labelEn: 'Discipline',
    color: '#10b981',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.15)',
    icon: Shield
  },
  wellbeing: {
    labelRu: 'Самочувствие',
    labelEn: 'Wellbeing',
    color: '#ec4899',
    bgLight: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'rgba(236, 72, 153, 0.15)',
    icon: Heart
  }
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const { discussInsightInChat, prefs } = useHabitStore()
  const { t } = useTranslation()
  const lang = prefs.lang || 'ru'

  const cfg = CATEGORY_CONFIG[insight.category] || CATEGORY_CONFIG.productivity
  const IconComponent = cfg.icon

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl glass-card border ${cfg.border} p-5 flex flex-col justify-between overflow-hidden group shadow-lg transition-all`}
      style={{
        boxShadow: `0 10px 30px -10px ${cfg.glow}`
      }}
    >
      {/* Background soft ambient gradient */}
      <div
        className="absolute -right-12 -top-12 size-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: cfg.color }}
      />

      <div className="space-y-3 relative z-10">
        {/* Header row: category tag + significance pill */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bgLight} border ${cfg.border}`}
            style={{ color: cfg.color }}
          >
            <IconComponent className="size-3.5" />
            <span>{lang === 'ru' ? cfg.labelRu : cfg.labelEn}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
            <Clock className="size-3 text-neutral-500" />
            <span>{insight.periodAnalysed}</span>
          </div>
        </div>

        {/* Claim heading */}
        <div>
          <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-indigo-200 transition-colors">
            {insight.claim}
          </h3>
          <p className="text-xs text-neutral-300/80 mt-1.5 leading-relaxed">
            {insight.metricDetail}
          </p>
        </div>
      </div>

      {/* Footer row: Discuss with Ogonyok button */}
      <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <Sparkles className="size-3 text-amber-400" />
          <span>{lang === 'ru' ? 'Достоверность:' : 'Confidence:'} {Math.round(insight.significanceScore * 100)}%</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => discussInsightInChat(insight)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-medium cursor-pointer transition-all shadow-sm shadow-amber-500/10"
        >
          <Flame className="size-3.5 text-amber-400 animate-pulse" />
          <span>{t.insights.discussWithOgonyok}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
