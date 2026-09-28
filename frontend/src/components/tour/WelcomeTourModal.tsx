import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Compass, 
  ArrowRight, 
  X, 
  Flame, 
  CheckSquare, 
  Wallet,
  Brain
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const WelcomeTourModal: React.FC = () => {
  const { 
    isTourProposalOpen, 
    setIsTourProposalOpen, 
    setIsTourOpen, 
    setTourStep,
    setActiveTab
  } = useHabitStore()

  if (!isTourProposalOpen) return null

  const handleStartTour = () => {
    setIsTourProposalOpen(false)
    setActiveTab('habits')
    setTourStep(0)
    setIsTourOpen(true)
  }

  const handleDismiss = () => {
    setIsTourProposalOpen(false)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#100e1e]/95 border border-purple-500/30 p-6 sm:p-8 text-neutral-100 shadow-2xl shadow-purple-950/60 overflow-hidden z-10"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 -right-20 size-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>

          <div className="space-y-6 relative z-10">
            {/* Header with Icon */}
            <div className="flex items-center gap-3.5">
              <div className="size-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/25 shrink-0">
                <div className="size-full bg-neutral-950/90 rounded-[15px] flex items-center justify-center">
                  <Compass className="size-6 text-purple-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="size-3 text-purple-400" />
                  <span>Интерактивный тур</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Добро пожаловать в HabitSpace! 🎉
                </h2>
              </div>
            </div>

            {/* Subtitle / Pitch */}
            <p className="text-sm text-neutral-300 leading-relaxed">
              Пройдите короткое обучение за 2 минуты: мы покажем, где находятся привычки, задачи, учет финансов и как умный коуч «Огонёк» помогает достигать целей.
            </p>

            {/* Quick feature previews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Flame className="size-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Привычки и стрик</div>
                  <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">Календарная сетка и серия побед</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckSquare className="size-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Задачи и опыт XP</div>
                  <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">Прокачка уровня персонажа</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Wallet className="size-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Финансы & Подписки</div>
                  <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">Доходы, расходы и аналитика</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Brain className="size-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Коуч «Огонёк» & AI</div>
                  <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">Кросс-модульные инсайты</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStartTour}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Пройти обучение (2 мин)</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDismiss}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-medium text-sm border border-white/10 transition-colors cursor-pointer"
              >
                Пропустить
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
