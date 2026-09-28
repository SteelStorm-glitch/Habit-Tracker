import React from 'react'
import {
  Flame,
  CheckSquare,
  Sparkles,
  Settings,
  HelpCircle,
  User,
  Wallet,
  Brain,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useHabitStore } from '@/context/HabitContext'
import { VerticalMenuItem, VerticalTooltip } from '@/components/ui/skiper-ui/skiper98'
import { useTranslation } from '@/locales'

type NavTabType = 'habits' | 'tasks' | 'finance' | 'insights' | 'developer' | 'profile'

interface NavItem {
  id: NavTabType
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  badge?: string | number
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
    setIsAiDrawerOpen,
    setIsTourOpen,
    setTourStep,
    currentUser,
    gamification,
    setIsAuthModalOpen
  } = useHabitStore()

  const { t } = useTranslation()
  const isGuest = !currentUser || currentUser.isGuest

  // Base navigation items
  const navItems: NavItem[] = [
    {
      id: 'habits',
      label: t.nav.habits,
      icon: Flame,
      color: '#6366f1' // indigo
    },
    {
      id: 'tasks',
      label: t.nav.tasks,
      icon: CheckSquare,
      color: '#10b981' // emerald
    },
    {
      id: 'finance',
      label: t.nav.finance,
      icon: Wallet,
      color: '#f59e0b' // amber
    },
    {
      id: 'insights',
      label: isGuest ? `${t.nav.insights} (Аккаунт)` : t.nav.insights,
      icon: Brain,
      color: '#a855f7', // purple
      badge: isGuest ? '🔒' : undefined
    }
  ]

  const visibleItems = navItems

  return (
    <>
      {/* ══════ Desktop Left Sidebar (Skiper98 Vertical Tooltip Menu) ══════ */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 glass-sidebar flex-col items-center py-5 z-40 border-r border-white/5 gap-3 select-none">
        {/* Brand logo */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="size-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-2 cursor-pointer border border-white/10"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5-.5 2-2 3-3 3 0-3 1.5-6 0-9z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        {/* Streak fire (Account bound) */}
        {currentUser && gamification && gamification.streakDays > 0 ? (
          <VerticalTooltip
            label={t.nav.streakTooltip(gamification.streakDays)}
            color="#fbbf24"
            badge={t.nav.streakActive}
          >
            <motion.button
              onClick={() => setActiveTab('profile')}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 mb-1 cursor-pointer"
            >
              <div className="animate-streak-fire">
                <Flame className="size-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              </div>
              <span className="text-[10px] font-bold text-amber-300 font-mono">{gamification.streakDays}</span>
            </motion.button>
          </VerticalTooltip>
        ) : (
          <VerticalTooltip
            label={t.nav.streakGuestTooltip}
            color="#9ca3af"
          >
            <motion.button
              onClick={() => setIsAuthModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 mb-1 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
            >
              <Flame className="size-4 text-zinc-500" />
              <span className="text-[9px] text-zinc-500 font-mono">—</span>
            </motion.button>
          </VerticalTooltip>
        )}

        {/* Divider */}
        <div className="w-6 h-px bg-white/10 rounded-full" />

        {/* Navigation tabs (Skiper98 Component) */}
        <nav className="flex flex-col items-center gap-2">
          {visibleItems.map(item => (
            <VerticalMenuItem
              key={item.id}
              id={`navTab-${item.id}`}
              label={item.label}
              icon={item.icon}
              isActive={activeTab === item.id}
              color={item.color}
              badge={item.badge}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="w-6 h-px bg-white/10 rounded-full" />

        {/* AI Button */}
        <VerticalTooltip
          label={isGuest ? `${t.nav.aiAssistant} (🔒 Только в аккаунте)` : t.nav.aiAssistant}
          color="#818cf8"
          badge={isGuest ? '🔒' : undefined}
        >
          <motion.button
            id="btnSidebarAi"
            onClick={() => setIsAiDrawerOpen(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="size-10 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 transition-colors cursor-pointer group relative"
            aria-label={t.nav.aiAssistant}
          >
            <Sparkles className="size-[18px] text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            {isGuest && (
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-neutral-900 border border-amber-500/40 flex items-center justify-center shadow-sm">
                <Lock className="size-2 text-amber-400" />
              </span>
            )}
          </motion.button>
        </VerticalTooltip>

        {/* Tour */}
        <VerticalTooltip label={t.nav.tour} color="#a3a3a3">
          <motion.button
            id="btnSidebarTour"
            onClick={() => { setTourStep(0); setIsTourOpen(true) }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={t.nav.tour}
          >
            <HelpCircle className="size-[18px] text-neutral-500 hover:text-neutral-300 transition-colors" />
          </motion.button>
        </VerticalTooltip>

        {/* Bottom spacer */}
        <div className="flex-1" />

        {/* User Avatar / Profile Button */}
        <VerticalTooltip
          label={currentUser ? t.nav.profileTooltip(currentUser.displayName || currentUser.email) : t.nav.login}
          color="#c084fc"
        >
          <motion.button
            id="btnSidebarUser"
            onClick={() => setActiveTab('profile')}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            className={`size-10 rounded-2xl flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer shadow-md group relative ${
              activeTab === 'profile'
                ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_18px_rgba(139,92,246,0.6)] border border-violet-400'
                : 'bg-white/10 hover:bg-white/15 border border-white/10'
            }`}
            aria-label={t.nav.profile}
          >
            {currentUser ? (
              currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'US'
            ) : (
              <User className="size-4 text-zinc-400 group-hover:text-white" />
            )}
            {activeTab === 'profile' && (
              <motion.div
                layoutId="verticalMenuPip"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-violet-400"
              />
            )}
          </motion.button>
        </VerticalTooltip>

        {/* Settings */}
        <VerticalTooltip label={t.nav.settings} color="#d4d4d8">
          <motion.button
            id="btnSidebarSettings"
            onClick={() => setIsSettingsOpen(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={t.nav.settings}
          >
            <Settings className="size-[18px] text-neutral-500 hover:text-neutral-300 transition-colors" />
          </motion.button>
        </VerticalTooltip>
      </aside>

      {/* ══════ Mobile Bottom Bar (Tactile Spring Physics) ══════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-sidebar border-t border-white/5 px-2 py-1.5 flex items-center justify-around safe-area-pb animate-slide-up">
        {/* Streak */}
        {gamification && gamification.streakDays > 0 && (
          <motion.div
            whileTap={{ scale: 0.88 }}
            className="flex flex-col items-center gap-0.5"
          >
            <Flame className="size-4 text-amber-400" />
            <span className="text-[9px] font-bold text-amber-300">{gamification.streakDays}</span>
          </motion.div>
        )}

        {visibleItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isItemLocked = item.id === 'insights' && isGuest
          return (
            <motion.button
              key={item.id}
              id={`navTabMobile-${item.id}`}
              data-tab={item.id}
              onClick={() => setActiveTab(item.id)}
              whileTap={{ scale: 0.88 }}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-white/10 border border-white/10 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                />
              )}
              <div className="relative">
                <Icon
                  className="size-5 transition-colors relative z-10"
                  style={{ color: isActive ? item.color : '#6b7280' }}
                />
                {isItemLocked && (
                  <span className="absolute -top-1 -right-1.5 size-3 rounded-full bg-neutral-900 border border-amber-500/40 flex items-center justify-center">
                    <Lock className="size-1.5 text-amber-400" />
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-medium transition-colors relative z-10"
                style={{ color: isActive ? item.color : '#6b7280' }}
              >
                {item.id === 'insights' ? t.nav.insights : item.label}
              </span>
            </motion.button>
          )
        })}

        {/* AI on mobile */}
        <motion.button
          id="btnMobileAi"
          onClick={() => setIsAiDrawerOpen(true)}
          whileTap={{ scale: 0.88 }}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="size-5 text-indigo-400" />
            {isGuest && (
              <span className="absolute -top-1 -right-1.5 size-3 rounded-full bg-neutral-900 border border-amber-500/40 flex items-center justify-center">
                <Lock className="size-1.5 text-amber-400" />
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium text-indigo-400">AI</span>
        </motion.button>

        {/* Profile on mobile */}
        <motion.button
          id="navTabMobile-profile"
          data-tab="profile"
          onClick={() => setActiveTab('profile')}
          whileTap={{ scale: 0.88 }}
          className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer"
        >
          {activeTab === 'profile' && (
            <motion.div
              layoutId="mobileActiveTab"
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="absolute inset-0 rounded-xl bg-white/10 border border-white/10 shadow-[0_0_12px_rgba(192,132,252,0.3)]"
            />
          )}
          <User
            className="size-5 transition-colors relative z-10"
            style={{ color: activeTab === 'profile' ? '#c084fc' : '#6b7280' }}
          />
          <span
            className="text-[9px] font-medium transition-colors relative z-10"
            style={{ color: activeTab === 'profile' ? '#c084fc' : '#6b7280' }}
          >
            {t.nav.profile}
          </span>
        </motion.button>

        {/* Settings on mobile */}
        <motion.button
          id="btnMobileSettings"
          onClick={() => setIsSettingsOpen(true)}
          whileTap={{ scale: 0.88 }}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl cursor-pointer"
        >
          <Settings className="size-5 text-neutral-500" />
          <span className="text-[9px] font-medium text-neutral-500">{t.nav.settings}</span>
        </motion.button>
      </nav>
    </>
  )
}
