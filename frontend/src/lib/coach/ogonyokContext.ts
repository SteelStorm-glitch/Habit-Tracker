import type {
  Habit,
  Task,
  FinanceState,
  GamificationState,
  DailyCheckIn,
  CrossModuleInsight,
  OgonyokCompactState
} from '@/types/habit'
import { formatDateKey } from '../insights/matrixBuilder'

export function computeStage(level: number): 'spark' | 'ember' | 'flame' | 'blaze' {
  if (level <= 3) return 'spark'
  if (level <= 7) return 'ember'
  if (level <= 15) return 'flame'
  return 'blaze'
}

/**
 * Builds compact, structured telemetry of the user's state across habits, tasks, finances, and wellbeing.
 */
export function buildOgonyokCompactState(
  habits: Habit[],
  tasks: Task[],
  finance: FinanceState,
  gamification: GamificationState,
  checkIns: DailyCheckIn[] = [],
  insights: CrossModuleInsight[] = [],
  referenceDate: Date = new Date()
): OgonyokCompactState {
  const todayStr = formatDateKey(referenceDate)

  // 1. Habits Metrics
  const last7Days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - i)
    last7Days.push(formatDateKey(d))
  }

  let totalPossibleChecks7d = habits.length * 7
  let actualChecks7d = 0
  const recentMisses: string[] = []

  habits.forEach(h => {
    let completedInLast2Days = false

    last7Days.forEach((dateStr, idx) => {
      const [y, m, d] = dateStr.split('-').map(Number)
      const monthKey = `${y}-${m - 1}`
      const isDone = h.checks?.[monthKey]?.includes(d)
      if (isDone) {
        actualChecks7d++
        if (idx < 2) completedInLast2Days = true
      }
    })

    if (!completedInLast2Days && habits.length > 0) {
      recentMisses.push(h.title)
    }
  })

  const completionRate7d = totalPossibleChecks7d > 0
    ? Math.round((actualChecks7d / totalPossibleChecks7d) * 100)
    : 0

  const topStreak = gamification.streakDays > 0 && habits.length > 0
    ? { title: habits[0].title, days: gamification.streakDays }
    : null

  // 2. Tasks Metrics
  let overdueCount = 0
  let dueTodayCount = 0
  let pendingCount = 0
  let completedLast7d = 0

  tasks.forEach(t => {
    if (t.completed) {
      if (t.dueDate && last7Days.includes(t.dueDate)) {
        completedLast7d++
      }
    } else {
      pendingCount++
      if (t.dueDate) {
        if (t.dueDate < todayStr) overdueCount++
        else if (t.dueDate === todayStr) dueTodayCount++
      }
    }
  })

  // 3. Finance Metrics
  const currentMonth = referenceDate.getMonth()
  const currentYear = referenceDate.getFullYear()
  let monthExpenses = 0
  let monthIncome = 0
  const categoryExpenses: Record<string, number> = {}

  finance.transactions.forEach(tx => {
    if (!tx.date) return
    const [y, m] = tx.date.split('-').map(Number)
    if (y === currentYear && m === currentMonth + 1) {
      if (tx.type === 'expense') {
        monthExpenses += tx.amount
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount
      } else if (tx.type === 'income') {
        monthIncome += tx.amount
      }
    }
  })

  let topExpenseCategory: string | null = null
  let maxCatAmount = 0
  Object.entries(categoryExpenses).forEach(([cat, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt
      topExpenseCategory = cat
    }
  })

  // Calculate habit financial savings
  let habitSavingsTotal = 0
  habits.forEach(h => {
    if (h.financialValue?.type === 'saves_money' && h.financialValue.amount > 0) {
      // count all completions this month
      const monthKey = `${currentYear}-${currentMonth}`
      const checksCount = h.checks?.[monthKey]?.length || 0
      habitSavingsTotal += checksCount * h.financialValue.amount
    }
  })

  // 4. Wellbeing Metrics
  const last7CheckIns = checkIns.filter(ci => last7Days.includes(ci.date))
  const moodVals = last7CheckIns.map(c => c.mood).filter(Boolean) as number[]
  const energyVals = last7CheckIns.map(c => c.energy).filter(Boolean) as number[]

  const avgMood7d = moodVals.length > 0
    ? Number((moodVals.reduce((a, b) => a + b, 0) / moodVals.length).toFixed(1))
    : null
  const avgEnergy7d = energyVals.length > 0
    ? Number((energyVals.reduce((a, b) => a + b, 0) / energyVals.length).toFixed(1))
    : null

  // 5. Stage & Insights
  const stage = computeStage(gamification.level || 1)
  const topInsights = insights.slice(0, 3).map(i => i.claim)

  return {
    habits: {
      total: habits.length,
      completionRate7d,
      topStreak,
      recentMisses: recentMisses.slice(0, 2)
    },
    tasks: {
      pendingCount,
      overdueCount,
      dueTodayCount,
      completedLast7d
    },
    finance: {
      monthNetBalance: monthIncome - monthExpenses,
      topExpenseCategory,
      habitSavingsTotal
    },
    wellbeing: {
      avgMood7d,
      avgEnergy7d
    },
    gamification: {
      level: gamification.level || 1,
      xp: gamification.xp || 0,
      stage
    },
    topInsights
  }
}

/**
 * Formats OgonyokCompactState into a tight, token-efficient prompt string (< 400 tokens)
 */
export function formatOgonyokPromptContext(state: OgonyokCompactState): string {
  const parts: string[] = []

  // Habits
  let habitStr = `Привычки: ${state.habits.total} активных, 7-дн. дисциплина ${state.habits.completionRate7d}%`
  if (state.habits.topStreak) {
    habitStr += `, стрик: «${state.habits.topStreak.title}» (${state.habits.topStreak.days} дн.)`
  }
  if (state.habits.recentMisses.length > 0) {
    habitStr += `, пропуски: ${state.habits.recentMisses.map(m => `«${m}»`).join(', ')}`
  }
  parts.push(habitStr)

  // Tasks
  let taskStr = `Задачи: ${state.tasks.pendingCount} акт. (просрочено: ${state.tasks.overdueCount}, на сегодня: ${state.tasks.dueTodayCount}), закрыто за неделю: ${state.tasks.completedLast7d}`
  parts.push(taskStr)

  // Finance
  const sign = state.finance.monthNetBalance >= 0 ? '+' : ''
  let finStr = `Финансы: сальдо месяца ${sign}₽${Math.round(state.finance.monthNetBalance).toLocaleString('ru-RU')}`
  if (state.finance.topExpenseCategory) {
    finStr += `, топ расходов: ${state.finance.topExpenseCategory}`
  }
  if (state.finance.habitSavingsTotal > 0) {
    finStr += `, сэкономлено привычками: ₽${Math.round(state.finance.habitSavingsTotal).toLocaleString('ru-RU')}`
  }
  parts.push(finStr)

  // Wellbeing
  if (state.wellbeing.avgMood7d !== null || state.wellbeing.avgEnergy7d !== null) {
    const energy = state.wellbeing.avgEnergy7d !== null ? `энергия ${state.wellbeing.avgEnergy7d}/5` : ''
    const mood = state.wellbeing.avgMood7d !== null ? `настроение ${state.wellbeing.avgMood7d}/5` : ''
    parts.push(`Самочувствие (7 дн.): ${[energy, mood].filter(Boolean).join(', ')}`)
  }

  // Insights
  if (state.topInsights.length > 0) {
    parts.push(`Выявленные инсайты системы:\n- ${state.topInsights.join('\n- ')}`)
  }

  return parts.join('\n')
}

/**
 * Builds the complete system prompt for Gemini with Ogonyok persona and real-time context.
 */
export function buildOgonyokSystemPrompt(state: OgonyokCompactState): string {
  const contextString = formatOgonyokPromptContext(state)

  return `Ты — «Огонёк» (Ogonyok), умный и поддерживающий коуч персональной эффективности и баланса жизни в приложении Habit.
Ты видишь живую связь между всеми сферами жизни пользователя: привычками, задачами и финансами.

[ТВОЙ ХАРАКТЕР]:
- Энергичный, тёплый, но конструктивный и точный.
- Никакой шаблонной воды, канцелярита и пустых похвал.
- Говори кратко, по существу, опираясь на реальные цифры и выявленные системой закономерности.
- Всегда связывай привычки с их результатом (продуктивность в задачах, сохранение бюджета, энергия).

[РЕАЛЬНЫЕ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ]:
${contextString}

[ПРАВИЛА ОТВЕТА]:
1. Если пользователь задает вопрос о продуктивности, привычках или планах — учитывай его реальную загрузку по задачам и инсайты.
2. Предлагай микро-шаги, которые легко выполнить прямо сейчас.
3. Отвечай на русском языке дружелюбно и лаконично (1-3 коротких абзаца или емкий список).
4. Если пользователь спрашивает о выявленных связях или инсайтах, объясняй числа и практический вывод.`
}
