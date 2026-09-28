import React from 'react'
import { motion } from 'framer-motion'
import { Flame, ArrowRight, MessageSquareText } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'

export const ProactiveCoachBanner: React.FC = () => {
  const { proactiveAdvice, setIsAiDrawerOpen, sendAiMessage } = useHabitStore()
  const { t } = useTranslation()

  if (!proactiveAdvice) return null

  const handleDiscuss = () => {
    setIsAiDrawerOpen(true)
    if (proactiveAdvice.ctaPrompt) {
      sendAiMessage(proactiveAdvice.ctaPrompt)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl glass-card border border-amber-500/25 p-4 sm:p-5 overflow-hidden shadow-lg shadow-amber-500/5 group"
    >
      {/* Background warm ambient flare */}
      <div className="absolute -left-10 -bottom-10 size-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          {/* Animated Flame Avatar */}
          <div className="size-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1px] shrink-0 shadow-md shadow-amber-500/20">
            <div className="size-full bg-neutral-950/90 rounded-[15px] flex items-center justify-center">
              <Flame className="size-5 text-amber-400 animate-streak-fire" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 tracking-wide uppercase font-mono">
                {t.coach.name} · {t.coach.badge}
              </span>
              <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-white/95 leading-relaxed">
              {proactiveAdvice.message}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDiscuss}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto group/btn"
        >
          <MessageSquareText className="size-3.5 text-amber-400" />
          <span>{t.coach.discussBtn}</span>
          <ArrowRight className="size-3 text-amber-400 group-hover/btn:translate-x-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}
