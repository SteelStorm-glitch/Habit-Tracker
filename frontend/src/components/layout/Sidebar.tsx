import React from 'react'
import { Calendar, CheckSquare, PieChart, Terminal, Flame, Sparkles, Settings, HelpCircle, Star, User } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

type TabId = 'habits' | 'tasks' | 'finance' | 'developer' | 'profile'

interface NavItem {
  id: TabId
  icon: React.ElementType
  label: string
  color: string
  devOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'habits', icon: Calendar, label: 'Привычки', color: '#818cf8' },
  { id: 'tasks', icon: CheckSquare, label: 'Задачи', color: '#60a5fa' },
  { id: 'finance', icon: PieChart, label: 'Финансы', color: '#34d399' },
  { id: 'developer', icon: Terminal, label: 'Dev', color: '#fbbf24', devOnly: true },
]

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
    setIsAiDrawerOpen,
    setIsTourOpen,
    setTourStep,
    isDevModeUnlocked,
    gamification,
    currentUser,
    setIsAuthModalOpen
  } = useHabitStore()

  const visibleItems = NAV_ITEMS.filter(item => !item.devOnly || isDevModeUnlocked)

  return (
    <>
      {/* ══════ Desktop Sidebar ══════ */}
      <aside className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3 py-5 px-2 rounded-[2rem] glass-sidebar animate-slide-right">
        {/* Brand logo */}
        <button
          onClick={() => setActiveTab('habits')}
          className="size-10 rounded-xl bg-indigo-600/80 backdrop-blur-sm flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer mb-1"
          title="Habit Tracker"
        >
          <Star className="size-5 stroke-[2.5]" />
        </button>

        {/* Streak fire (Account bound) */}
        {currentUser && gamification && gamification.streakDays > 0 ? (
          <button
            onClick={() => setActiveTab('profile')}
            className="flex flex-col items-center gap-0.5 mb-1 cursor-pointer hover:scale-110 transition-transform"
            title={`Стрик: ${gamification.streakDays} дн. (Аккаунт: ${currentUser.displayName || currentUser.email})`}
          >
            <div className="animate-streak-fire">
              <Flame className="size-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 font-mono">{gamification.streakDays}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex flex-col items-center gap-0.5 mb-1 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
            title="Войдите в аккаунт, чтобы включить стрик"
          >
            <Flame className="size-4 text-zinc-500" />
            <span className="text-[9px] text-zinc-500 font-mono">—</span>
          </button>
        )}

        {/* Divider */}
        <div className="w-6 h-px bg-white/10 rounded-full" />

        {/* Navigation tabs */}
        <nav className="flex flex-col items-center gap-1.5">
          {visibleItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                id={`navTab-${item.id}`}
                data-tab={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative size-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'bg-white/10 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
                style={isActive ? { boxShadow: `0 0 20px ${item.color}25, inset 0 1px 0 rgba(255,255,255,0.1)` } : {}}
                title={item.label}
              >
                <Icon
                  className="size-[18px] transition-colors duration-200"
                  style={{ color: isActive ? item.color : '#9ca3af' }}
                />
                {isActive && (
                  <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-neutral-900/95 border border-white/10 text-[11px] font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 backdrop-blur-sm shadow-xl">
                  {item.label}
                </div>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="w-6 h-px bg-white/10 rounded-full" />

        {/* AI Button */}
        <button
          id="btnSidebarAi"
          onClick={() => setIsAiDrawerOpen(true)}
          className="size-10 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 transition-all cursor-pointer group relative"
          title="AI Ассистент"
          aria-label="AI Ассистент"
        >
          <Sparkles className="size-[18px] text-indigo-400 group-hover:text-indigo-300" />
        </button>

        {/* Tour */}
        <button
          id="btnSidebarTour"
          onClick={() => { setTourStep(0); setIsTourOpen(true) }}
          className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer"
          title="Интерактивный тур"
          aria-label="Интерактивный тур"
        >
          <HelpCircle className="size-[18px] text-neutral-500 hover:text-neutral-300" />
        </button>

        {/* Bottom spacer */}
        <div className="flex-1" />

        {/* User Avatar / Profile Button */}
        <button
          id="btnSidebarUser"
          onClick={() => setActiveTab('profile')}
          className={`size-10 rounded-2xl flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer shadow-md active:scale-95 group relative ${
            activeTab === 'profile'
              ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_18px_rgba(139,92,246,0.6)] border border-violet-400'
              : 'bg-white/10 hover:bg-white/15 border border-white/10'
          }`}
          title={currentUser ? `Профиль: ${currentUser.displayName || currentUser.email}` : 'Войти в аккаунт'}
          aria-label="Профиль"
        >
          {currentUser ? (
            currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'US'
          ) : (
            <User className="size-4 text-zinc-400 group-hover:text-white" />
          )}
          {activeTab === 'profile' && (
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-violet-400" />
          )}
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-neutral-900/95 border border-white/10 text-[11px] font-medium text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 backdrop-blur-sm shadow-xl z-50">
            {currentUser ? 'Профиль' : 'Войти в аккаунт'}
          </div>
        </button>

        {/* Settings */}
        <button
          id="btnSidebarSettings"
          onClick={() => setIsSettingsOpen(true)}
          className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer"
          title="Настройки"
          aria-label="Настройки"
        >
          <Settings className="size-[18px] text-neutral-500 hover:text-neutral-300 transition-colors" />
        </button>
      </aside>

      {/* ══════ Mobile Bottom Bar ══════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-sidebar border-t border-white/5 px-2 py-1.5 flex items-center justify-around safe-area-pb animate-slide-up">
        {/* Streak */}
        {gamification && gamification.streakDays > 0 && (
          <div className="flex flex-col items-center gap-0.5">
            <Flame className="size-4 text-amber-400" />
            <span className="text-[9px] font-bold text-amber-300">{gamification.streakDays}</span>
          </div>
        )}

        {visibleItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              id={`navTabMobile-${item.id}`}
              data-tab={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'bg-white/8' : ''
              }`}
            >
              <Icon
                className="size-5 transition-colors"
                style={{ color: isActive ? item.color : '#6b7280' }}
              />
              <span
                className="text-[9px] font-medium transition-colors"
                style={{ color: isActive ? item.color : '#6b7280' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}

        {/* AI on mobile */}
        <button
          id="btnMobileAi"
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl cursor-pointer"
        >
          <Sparkles className="size-5 text-indigo-400" />
          <span className="text-[9px] font-medium text-indigo-400">AI</span>
        </button>

        {/* Profile on mobile */}
        <button
          id="navTabMobile-profile"
          data-tab="profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'bg-white/8' : ''
          }`}
        >
          <User
            className="size-5 transition-colors"
            style={{ color: activeTab === 'profile' ? '#c084fc' : '#6b7280' }}
          />
          <span
            className="text-[9px] font-medium transition-colors"
            style={{ color: activeTab === 'profile' ? '#c084fc' : '#6b7280' }}
          >
            Профиль
          </span>
        </button>

        {/* Settings on mobile */}
        <button
          id="btnMobileSettings"
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl cursor-pointer"
        >
          <Settings className="size-5 text-neutral-500" />
          <span className="text-[9px] font-medium text-neutral-500">Ещё</span>
        </button>
      </nav>
    </>
  )
}
