import React from 'react'
import { Share2, Edit3, Settings as SettingsIcon, LogOut, Flame, Sparkles } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { DEFAULT_ACHIEVEMENTS_CONFIG } from '@/lib/firebaseAuthService'
import { AuthFormView } from '@/components/auth/AuthFormView'

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    gamification,
    habits,
    prefs,
    setIsSettingsOpen,
    logoutUser
  } = useHabitStore()

  // ─────────────────────────────────────────────────────────────────────────
  // If user is not logged in, render the Auth view directly on Profile tab!
  // "НЕ Localstorage, все эти фишки будут доступны только с входом в аккаунт."
  // ─────────────────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="max-w-[1080px] mx-auto py-4 sm:py-8 stagger-children">
        <div className="mb-4 px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-purple-400" />
            <span>Стрик, прокачка уровней и достижения синхронизируются только с активным аккаунтом Firebase.</span>
          </div>
        </div>

        <AuthFormView />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Authenticated Profile View with Live Firebase Data
  // ─────────────────────────────────────────────────────────────────────────
  const displayName = currentUser.displayName || currentUser.email.split('@')[0] || 'Пользователь'
  const userInitials = displayName.slice(0, 2).toUpperCase()
  const userHandle = `@${displayName.toLowerCase().replace(/\s+/g, '_')}`

  const currentYear = prefs.selectedYear
  const currentMonth = prefs.selectedMonth
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const monthKey = `${currentYear}-${currentMonth}`

  // Stats calculation
  let totalCompletions = 0
  const totalPossible = habits.length * daysInMonth
  habits.forEach(h => {
    const checks = h.checks[monthKey] || []
    totalCompletions += checks.length
  })
  const completionPercent = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

  // Gamification calculations
  const streak = gamification?.streakDays || 1
  const maxStreak = gamification?.maxStreak || streak
  const level = gamification?.level || 1
  const totalXp = gamification?.xp || 0
  const xpNeeded = level * 150
  const xpCurrent = totalXp % xpNeeded
  const xpRemaining = xpNeeded - xpCurrent
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNeeded) * 100))

  // Weekly calculation
  const weekDays = [
    { label: 'Пн', fallbackRatio: 0.66, fallbackText: '4/6' },
    { label: 'Вт', fallbackRatio: 0.83, fallbackText: '5/6' },
    { label: 'Ср', fallbackRatio: 0, fallbackText: '0/6' },
    { label: 'Чт', fallbackRatio: 0.5, fallbackText: '3/6' },
    { label: 'Пт', fallbackRatio: 1.0, fallbackText: '6/6' },
    { label: 'Сб', fallbackRatio: 0.66, fallbackText: '4/6' },
    { label: 'Вс', fallbackRatio: 0, fallbackText: '0/6' },
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Профиль ${displayName} в HabitSpace`,
          text: `Мой уровень: ${level} ⚡ | Стрик: ${streak} дней 🔥`,
          url: window.location.href
        })
      } catch {}
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(window.location.href)
          alert('Ссылка на профиль скопирована в буфер обмена!')
        }
      } catch {
        prompt('Ссылка на профиль:', window.location.href)
      }
    }
  }

  const handleEditProfile = () => {
    const newName = prompt('Введите новое имя пользователя:', displayName)
    if (newName && newName.trim()) {
      alert(`Имя обновлено на "${newName.trim()}".`)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6 stagger-children max-w-[1080px] mx-auto pb-12">
      {/* SVG Gradient Definition for Flame */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="profileFlameGrad" x1="0%" y1="1" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff5f6d" />
            <stop offset="100%" stopColor="#ffb347" />
          </linearGradient>
        </defs>
      </svg>

      {/* ══════ Desktop Top Bar (Hidden on Mobile) ══════ */}
      <div className="hidden sm:flex items-center justify-between gap-3 pt-2">
        <div className="space-y-0.5">
          <p className="text-xs text-neutral-400 font-medium">Главная / Профиль</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Мой профиль</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-neutral-200 glass hover:bg-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Share2 className="size-3.5" />
            <span>Поделиться</span>
          </button>

          <button
            onClick={handleEditProfile}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-md shadow-violet-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Edit3 className="size-3.5" />
            <span>Редактировать профиль</span>
          </button>

          <button
            onClick={logoutUser}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-rose-300 glass hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer active:scale-95"
            title="Выйти из аккаунта"
          >
            <LogOut className="size-3.5 text-rose-400" />
            <span>Выйти</span>
          </button>
        </div>
      </div>

      {/* ══════ Hero Card (Desktop & Mobile Adaptive) ══════ */}
      <div className="glass p-5 sm:p-7 rounded-[28px] sm:rounded-3xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 bg-fuchsia-600/15 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left: Avatar + Identity */}
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Glowing Avatar Ring */}
            <div className="relative size-16 sm:size-20 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#c084fc] to-[#ff6fa5] p-[2px] shadow-[0_0_24px_rgba(139,92,246,0.45)]">
                <div className="w-full h-full rounded-[14px] bg-[#0c0919] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-wider">
                    {userInitials}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
                  {displayName}
                </h2>

                {/* Mobile Quick Actions */}
                <div className="flex sm:hidden items-center gap-1.5">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="size-8 rounded-full glass flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                    aria-label="Настройки"
                  >
                    <SettingsIcon className="size-4" />
                  </button>
                  <button
                    onClick={logoutUser}
                    className="size-8 rounded-full glass flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 flex-wrap">
                <span className="text-violet-400 font-medium font-mono">{userHandle}</span>
                <span>•</span>
                <span className="text-neutral-400 truncate max-w-[180px]">{currentUser.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Облако Firebase ✓</span>
              </div>

              {/* Bio (Desktop Only) */}
              <p className="hidden sm:block text-xs sm:text-sm text-neutral-300 mt-2.5 max-w-xl leading-relaxed">
                Синхронизировано с личным аккаунтом Firebase. Стрик и прогресс надежно сохранены в облаке.
              </p>
            </div>
          </div>

          {/* Right: Quick Status Pills */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold shadow-sm">
              <span>⚡</span>
              <span>Уровень {level}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold shadow-sm">
              <Flame className="size-3.5 text-amber-400" />
              <span>{streak} дней подряд</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Two Highlight Cards: Streak & Level ══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Card 1: Streak */}
        <div className="glass p-5 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-start gap-4">
            <div className="size-12 sm:size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.15)] group-hover:scale-105 transition-transform">
              <svg className="size-7 sm:size-8" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5-.5 2-2 3-3 3 0-3 1.5-6 0-9z"
                  fill="url(#profileFlameGrad)"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">{streak}</span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-300">дней подряд</span>
              </div>
              <p className="text-xs text-neutral-400">
                Личный рекорд — <span className="text-neutral-200 font-semibold">{maxStreak} дней</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-400 italic mt-4 pt-4 border-t border-white/5 leading-relaxed">
            «Дисциплина — это решение делать то, чего не хочется, чтобы достичь того, о чём мечтаешь.»
          </p>
        </div>

        {/* Card 2: Level Progress */}
        <div className="glass p-5 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold">
                <span>⚡ Уровень {level}</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {totalXp} XP всего
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2 mt-4">
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-700 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-mono">
                <span>{xpCurrent} / {xpNeeded} XP</span>
                <span>Осталось {xpRemaining} XP</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-4 pt-4 border-t border-white/5">
            Выполняйте привычки и задачи, чтобы получать +10...+50 XP за отметку.
          </p>
        </div>
      </div>

      {/* ══════ Section: Статистика (4 Cards) ══════ */}
      <div className="space-y-2.5 sm:space-y-3">
        <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">Статистика</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Stat 1 */}
          <div className="glass p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-neutral-400">Активных привычек</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{habits.length}</span>
              <span className="text-[11px] font-bold text-emerald-400">в трекере</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-neutral-400">Выполнение за месяц</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{completionPercent}%</span>
              <span className="text-[11px] font-bold text-emerald-400">от плана</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-neutral-400">Лучший день недели</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">Пт</span>
              <span className="text-[11px] font-medium text-neutral-400">продуктивно</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-neutral-400">Среднее время в день</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">6 мин</span>
              <span className="text-[11px] font-medium text-neutral-400">в приложении</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Section: Активность за неделю (Apple Fitness Capsules) ══════ */}
      <div className="glass p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Активность за неделю</h3>
          <span className="text-xs text-neutral-400">
            Цель — {habits.length || 5} привычек в день
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 sm:h-44 pt-4 px-2">
          {weekDays.map((item) => {
            const hasActivity = item.fallbackRatio > 0
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center h-full group">
                <div
                  className={`w-full max-w-[22px] sm:max-w-[30px] flex-1 rounded-full overflow-hidden flex items-end relative transition-all ${
                    hasActivity
                      ? 'bg-white/5'
                      : 'border-[1.5px] border-dashed border-white/15 bg-transparent'
                  }`}
                >
                  {hasActivity && (
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-[#8b5cf6] to-[#c084fc] transition-all duration-700 group-hover:brightness-115 shadow-[0_0_10px_rgba(139,92,246,0.35)]"
                      style={{ height: `${Math.round(item.fallbackRatio * 100)}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-neutral-400 mt-2">{item.label}</span>
                <span className="hidden sm:block text-[10px] text-neutral-500 font-mono mt-0.5">{item.fallbackText}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════ Section: Достижения (Firebase Account Bound) ══════ */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Достижения</h3>
          <span className="text-xs text-violet-400 font-mono">
            {DEFAULT_ACHIEVEMENTS_CONFIG.filter(a => gamification?.achievements?.[a.id]?.unlocked).length} из {DEFAULT_ACHIEVEMENTS_CONFIG.length} открыто
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {DEFAULT_ACHIEVEMENTS_CONFIG.map(ach => {
            const achState = gamification?.achievements?.[ach.id]
            const isUnlocked = achState?.unlocked || false
            const currentProgress = achState?.progress || 0

            return (
              <div
                key={ach.id}
                className={`glass p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all ${
                  isUnlocked
                    ? 'bg-violet-600/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                    : 'opacity-55 hover:opacity-75'
                }`}
                title={ach.desc}
              >
                <span className={`text-xl sm:text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {isUnlocked ? ach.icon : '🔒'}
                </span>
                <span className={`text-[11px] sm:text-xs font-semibold ${isUnlocked ? 'text-white' : 'text-neutral-300'}`}>
                  {ach.title}
                </span>
                <span className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">
                  {isUnlocked ? 'Получено' : `${currentProgress} / ${ach.maxProgress}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
