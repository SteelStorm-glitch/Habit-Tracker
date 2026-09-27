import React from 'react'
import { Check, Calendar, CheckSquare, PieChart, Settings, ChevronDown, Sparkles, Terminal, HelpCircle } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSettingsOpen, 
    prefs, 
    isDevModeUnlocked, 
    setIsAuthModalOpen, 
    currentUser,
    setIsAiDrawerOpen,
    setIsTourOpen,
    setTourStep
  } = useHabitStore()

  const currentMonthName = MONTHS_RU[prefs.selectedMonth] || 'Сентябрь'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2d3139]/80 bg-[#16171a]/90 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
      {/* Left: Brand + Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-6 min-w-0">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('habits')}
          className="flex items-center gap-1.5 sm:gap-2 select-none cursor-pointer group shrink-0"
          title="Habit Workspace"
        >
          <div className="size-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Check className="size-4 stroke-[3]" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white hidden xs:inline sm:inline">Habit</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-[#1c1e22] p-1 rounded-xl border border-[#2d3139] shrink-0">
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'habits'
                ? 'bg-[#272a31] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Привычки"
          >
            <Calendar className="size-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Привычки</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-[#272a31] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Задачи"
          >
            <CheckSquare className="size-3.5 text-blue-400" />
            <span className="hidden sm:inline">Задачи</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'finance'
                ? 'bg-[#272a31] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Финансы"
          >
            <PieChart className="size-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Финансы</span>
          </button>

          {isDevModeUnlocked && (
            <button
              id="navTabDeveloper"
              onClick={() => setActiveTab('developer')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'developer'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/40'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
              title="Разработчик"
            >
              <Terminal className="size-3.5 text-amber-400" />
              <span className="hidden sm:inline">Разработчик</span>
            </button>
          )}
        </nav>
      </div>

      {/* Right: Actions + User Pill + Settings Cog */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Month Selector Button */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1e22]/90 border border-[#2d3139] text-xs font-medium text-neutral-300 select-none cursor-pointer hover:border-neutral-500/50 transition-colors">
          <span>{currentMonthName} {prefs.selectedYear}</span>
          <ChevronDown className="size-3 text-neutral-400" />
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 active:scale-95 transition-all cursor-pointer"
          title="AI Ассистент"
          aria-label="AI Ассистент"
        >
          <Sparkles className="size-3.5 text-indigo-400 animate-pulse" />
          <span className="hidden sm:inline">AI</span>
        </button>

        {/* Tour Helper */}
        <button
          onClick={() => {
            setTourStep(0)
            setIsTourOpen(true)
          }}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer hover:bg-white/5 transition-colors hidden sm:flex"
          title="Интерактивный тур"
          aria-label="Интерактивный тур"
        >
          <HelpCircle className="size-4" />
        </button>

        {/* User Pill / Auth Trigger */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-[#1c1e22]/90 border border-[#2d3139] text-xs font-mono text-neutral-300 hover:border-neutral-500 transition-colors cursor-pointer shrink-0"
          title="Аккаунт и облачная синхронизация"
        >
          <div className={`size-1.5 rounded-full ${currentUser?.email ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-neutral-300 text-xs font-mono tracking-tight max-w-[60px] sm:max-w-[100px] truncate">
            {currentUser?.displayName || currentUser?.email?.split('@')[0] || prefs.userName}
          </span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-1.5 text-neutral-400 hover:text-white active:scale-90 transition-all rounded-md cursor-pointer hover:bg-white/5"
          title="Настройки"
          aria-label="Настройки"
        >
          <Settings className="size-4.5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  )
}
