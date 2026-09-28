import React from 'react'
import { Plus, Check, Trash2, Flame, TrendingUp, Zap } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { ProactiveCoachBanner } from '@/components/coach/ProactiveCoachBanner'
import { InsightsDashboardWidget } from '@/components/insights/InsightsDashboardWidget'

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitDay, deleteHabit, setIsAddHabitOpen, prefs, getSimulatedNow, gamification } = useHabitStore()

  const currentYear = prefs.selectedYear
  const currentMonth = prefs.selectedMonth
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const todayDay = getSimulatedNow().getDate()
  const monthKey = `${currentYear}-${currentMonth}`

  // Stats calculation
  let totalCompletions = 0
  const totalPossible = habits.length * daysInMonth
  let todayDone = 0

  habits.forEach(h => {
    const checks = h.checks[monthKey] || []
    totalCompletions += checks.length
    if (checks.includes(todayDay)) todayDone++
  })

  const completionPercent = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0
  const todayPercent = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0
  const remainingToday = habits.length - todayDone

  const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

  return (
    <div className="space-y-6 stagger-children">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Трекер привычек
            {gamification && gamification.streakDays > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                <Flame className="size-3.5 animate-streak-fire" />
                {gamification.streakDays} дн.
              </span>
            )}
          </h1>
          <p className="text-xs text-neutral-400">
            {MONTHS_RU[currentMonth]} {currentYear} — отмечайте выполнение одним кликом.
          </p>
        </div>

        <button
          id="tour-btn-add-habit"
          onClick={() => setIsAddHabitOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500/80 text-white text-xs font-medium shadow-lg shadow-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Новая привычка</span>
        </button>
      </div>

      {/* Proactive Ogonyok Daily Advice Banner */}
      <ProactiveCoachBanner />

      {/* Overview Grid: Today Card + Month Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Today Completion Card */}
        <div className="lg:col-span-8 p-5 rounded-2xl glass-card flex flex-col md:flex-row items-center gap-6">
          {/* Circular SVG Progress Bar with glow */}
          <div className="relative size-24 shrink-0 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-white/5" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                className="transition-all duration-700"
                stroke={todayPercent === 100 ? '#34d399' : '#818cf8'}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * todayPercent) / 100}
                strokeLinecap="round"
                fill="none"
                style={{ filter: todayPercent === 100 ? 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' : 'drop-shadow(0 0 6px rgba(129,140,248,0.4))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white leading-tight">{todayPercent}%</span>
              <span className="text-[10px] text-neutral-400">{todayDone} из {habits.length}</span>
            </div>
          </div>

          {/* Today Meta & Quick Chips */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Сегодня
                {todayPercent === 100 && <span className="text-emerald-400 text-sm">✨ Готово!</span>}
              </h2>
              <p className="text-xs text-neutral-400">
                {remainingToday > 0 ? `Осталось отметить ${remainingToday}.` : 'Все привычки на сегодня выполнены! 🎉'}
              </p>
            </div>

            {/* Quick Chips Row */}
            <div className="flex flex-wrap gap-2 pt-1">
              {habits.map(habit => {
                const isChecked = (habit.checks[monthKey] || []).includes(todayDay)
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitDay(habit.id, todayDay)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-sm transition-all active:scale-95 cursor-pointer ${
                      isChecked
                        ? 'bg-white/8 border-white/15 text-white'
                        : 'bg-white/3 border-white/8 text-neutral-400 hover:text-neutral-200 hover:border-white/15'
                    }`}
                    style={isChecked ? { borderColor: `${habit.color}40`, backgroundColor: `${habit.color}15` } : {}}
                  >
                    <div
                      className={`size-4 rounded-md flex items-center justify-center text-[10px] shrink-0 font-bold transition-all ${
                        isChecked ? 'text-white animate-check-spring' : 'text-neutral-400'
                      }`}
                      style={isChecked ? { backgroundColor: habit.color } : { backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                      {isChecked ? (
                        <Check className="size-2.5 stroke-[3] text-white" />
                      ) : (
                        <span>{habit.emoji || '⚡'}</span>
                      )}
                    </div>
                    <span className={isChecked ? 'text-white font-medium' : 'text-neutral-300'}>{habit.title}</span>
                    {isChecked && (
                      <span className="text-[9px] text-indigo-300/70 font-mono">+10 xp</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Month Stats Widget */}
        <div className="lg:col-span-4 p-5 rounded-2xl glass-card flex flex-col justify-between space-y-3">
          {/* Stat 1: Выполнение за месяц */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <TrendingUp className="size-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400">Выполнение за месяц</div>
                <div className="text-[11px] text-neutral-500">{totalCompletions} из {totalPossible} отметок</div>
              </div>
            </div>
            <div className="text-xl font-bold text-white font-mono">{completionPercent}%</div>
          </div>

          {/* Stat 2: Стрик */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Flame className="size-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400">Текущий стрик</div>
                <div className="text-[11px] text-neutral-500">Подряд без пропусков</div>
              </div>
            </div>
            <div className="text-base font-bold text-white font-mono">{gamification?.streakDays || 0} дн.</div>
          </div>

          {/* Stat 3: Уровень */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Zap className="size-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400">Уровень</div>
                <div className="text-[11px] text-neutral-500">{gamification?.xp || 0} XP всего</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${gamification ? (() => {
                      const lvl = gamification.level
                      const xpNeeded = lvl * 150
                      const xpSpent = 150 * (lvl * (lvl - 1)) / 2
                      const xpCurrent = Math.max(0, gamification.xp - xpSpent)
                      return Math.min(100, Math.round((xpCurrent / xpNeeded) * 100))
                    })() : 0}%`
                  }}
                />
              </div>
              <span className="text-sm font-bold text-indigo-300 font-mono">{gamification?.level || 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Module Insights Widget */}
      <InsightsDashboardWidget />

      {/* Habit Matrix Table Card */}
      <div id="tour-habits-matrix" className="rounded-2xl glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            {/* Header: Weeks */}
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase bg-white/[0.02]">
                <th className="py-2.5 px-4 w-44">Привычка</th>
                <th colSpan={7} className="py-2.5 px-1 text-center border-l border-white/5">Неделя 1</th>
                <th colSpan={7} className="py-2.5 px-1 text-center border-l border-white/5">Неделя 2</th>
                <th colSpan={7} className="py-2.5 px-1 text-center border-l border-white/5">Неделя 3</th>
                <th colSpan={7} className="py-2.5 px-1 text-center border-l border-white/5">Неделя 4</th>
                <th colSpan={daysInMonth - 28} className="py-2.5 px-1 text-center border-l border-white/5">Остаток</th>
                <th className="py-2.5 px-4 text-right border-l border-white/5 w-24">Прогресс</th>
              </tr>

              {/* Sub-Header: Day Numbers + Activity Capsules */}
              <tr className="border-b border-white/5 text-[10px] font-mono text-neutral-400 bg-white/[0.01]">
                <th className="py-2 px-4 font-sans font-normal text-neutral-500 text-xs">Активность по дням</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const isToday = d === todayDay
                  const dayCount = habits.filter(h => (h.checks[monthKey] || []).includes(d)).length

                  return (
                    <th
                      key={d}
                      className={`py-1.5 px-0.5 text-center font-normal ${
                        isToday ? 'bg-indigo-500/10 text-indigo-300 font-bold border-x border-indigo-500/20' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] ${isToday ? 'text-indigo-300 font-bold' : 'text-neutral-500'}`}>
                          {d}
                        </span>
                        <div className="h-3.5 flex items-center justify-center">
                          {dayCount >= 3 ? (
                            <div className={`w-1.5 h-3 rounded-full ${isToday ? 'bg-indigo-400' : 'bg-indigo-500/70'}`} />
                          ) : dayCount === 2 ? (
                            <div className="w-1.5 h-2 rounded-full bg-indigo-500/50" />
                          ) : dayCount === 1 ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/40" />
                          ) : (
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                          )}
                        </div>
                      </div>
                    </th>
                  )
                })}
                <th className="py-2 px-4 text-right"></th>
              </tr>
            </thead>

            {/* Habit Rows */}
            <tbody className="divide-y divide-white/5">
              {habits.map(habit => {
                const checks = habit.checks[monthKey] || []
                const habitPct = Math.round((checks.length / daysInMonth) * 100)

                return (
                  <tr key={habit.id} className="hover:bg-white/[0.03] transition-colors group">
                    {/* Habit Info Cell */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="size-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-medium backdrop-blur-sm"
                            style={{ backgroundColor: `${habit.color}15`, color: habit.color, border: `1px solid ${habit.color}25` }}
                          >
                            {habit.emoji || '⚡'}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-semibold text-white truncate">{habit.title}</div>
                            {habit.subtitle && (
                              <div className="text-[10px] text-neutral-500 truncate">{habit.subtitle}</div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                          title="Удалить привычку"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Day Checkboxes */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                      const isChecked = checks.includes(d)
                      const isToday = d === todayDay

                      return (
                        <td
                          key={d}
                          className={`p-0.5 text-center ${
                            isToday ? 'bg-indigo-500/5 border-x border-indigo-500/10' : ''
                          }`}
                        >
                          <button
                            onClick={() => toggleHabitDay(habit.id, d)}
                            className={`size-5.5 rounded-md flex items-center justify-center mx-auto transition-all active:scale-90 cursor-pointer ${
                              isChecked
                                ? 'text-white shadow-sm'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06]'
                            }`}
                            style={isChecked ? { backgroundColor: habit.color, boxShadow: `0 0 8px ${habit.color}30` } : {}}
                            title={`День ${d}`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </button>
                        </td>
                      )
                    })}

                    {/* Progress Bar & Percent Cell */}
                    <td className="py-2.5 px-4 text-right border-l border-white/5">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${habitPct}%`, backgroundColor: habit.color, boxShadow: `0 0 6px ${habit.color}40` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-medium text-neutral-400 w-8 text-right">
                          {habitPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
