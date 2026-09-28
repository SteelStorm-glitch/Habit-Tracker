import type {
  Habit,
  DayRecord,
  CrossModuleInsight
} from '@/types/habit'

const DAY_NAMES_RU = [
  'воскресеньям',
  'понедельникам',
  'вторникам',
  'средам',
  'четвергам',
  'пятницам',
  'субботам'
]

/**
 * 1. Habit ➔ Task Productivity Evaluator
 * Checks whether completing a specific habit correlates with higher completed tasks.
 */
export function evaluateHabitTaskProductivity(
  records: DayRecord[],
  habits: Habit[]
): CrossModuleInsight[] {
  const insights: CrossModuleInsight[] = []

  habits.forEach(habit => {
    const doneDays: number[] = []
    const missDays: number[] = []

    records.forEach(r => {
      const isDone = r.completedHabitIds.includes(habit.id)
      if (isDone) {
        doneDays.push(r.tasksCompletedCount)
      } else {
        missDays.push(r.tasksCompletedCount)
      }
    })

    // Requires at least 4 observations in each cohort
    if (doneDays.length < 4 || missDays.length < 4) return

    const avgDone = doneDays.reduce((a, b) => a + b, 0) / doneDays.length
    const avgMiss = missDays.reduce((a, b) => a + b, 0) / missDays.length

    // Need a baseline to compare against
    if (avgMiss <= 0.2 && avgDone < 1.0) return

    const base = Math.max(avgMiss, 0.5)
    const diffPercent = Math.round(((avgDone - avgMiss) / base) * 100)

    // Minimum +20% boost
    if (diffPercent >= 20) {
      const sampleDays = doneDays.length + missDays.length
      const significanceScore = Math.min(1, (diffPercent / 100) * 0.5 + (sampleDays / 60) * 0.5)

      insights.push({
        id: `insight-prod-${habit.id}`,
        category: 'productivity',
        badgeIcon: 'zap',
        title: `Влияние: ${habit.title}`,
        claim: `В дни выполнения «${habit.title}» вы закрываете на ${diffPercent}% больше задач.`,
        metricDetail: `В среднем ${avgDone.toFixed(1)} задач против ${avgMiss.toFixed(1)} в дни без привычки.`,
        periodAnalysed: `Выборка за ${sampleDays} дн.`,
        sampleDays,
        significanceScore: Number(significanceScore.toFixed(2)),
        habitId: habit.id,
        createdAt: Date.now()
      })
    }
  })

  return insights
}

/**
 * 2. Day-of-Week Spending Anomaly Evaluator
 * Detects if a specific day of week consistently drains significantly more money than others.
 */
export function evaluateDayOfWeekSpendingAnomaly(
  records: DayRecord[]
): CrossModuleInsight[] {
  const insights: CrossModuleInsight[] = []
  if (records.length < 7) return insights

  // Group expenses by day of week
  const dowExpenses: number[][] = [[], [], [], [], [], [], []]
  let totalExpSum = 0
  let totalExpDays = 0

  records.forEach(r => {
    dowExpenses[r.dayOfWeek].push(r.totalExpenses)
    if (r.totalExpenses > 0) {
      totalExpSum += r.totalExpenses
      totalExpDays++
    }
  })

  if (totalExpDays < 5 || totalExpSum === 0) return insights

  const overallAvg = totalExpSum / records.length // average expense across all recorded days

  for (let dow = 0; dow < 7; dow++) {
    const expenses = dowExpenses[dow]
    // At least 2-3 occurrences of this day of week
    if (expenses.length < 3) continue

    const dowAvg = expenses.reduce((a, b) => a + b, 0) / expenses.length
    if (overallAvg <= 0) continue

    const diffPercent = Math.round(((dowAvg - overallAvg) / overallAvg) * 100)

    // Spike of >= 40% and at least 300 rubles difference
    if (diffPercent >= 40 && (dowAvg - overallAvg) >= 300) {
      const dayName = DAY_NAMES_RU[dow]
      const significanceScore = Math.min(1, (diffPercent / 100) * 0.6 + 0.4)

      insights.push({
        id: `insight-spend-dow-${dow}`,
        category: 'spending',
        badgeIcon: 'wallet',
        title: `Траты по ${dayName}`,
        claim: `По ${dayName} ваши расходы в среднем на ${diffPercent}% выше обычного.`,
        metricDetail: `Средний чек дня: ₽${Math.round(dowAvg).toLocaleString('ru-RU')} против ₽${Math.round(overallAvg).toLocaleString('ru-RU')} в среднем.`,
        periodAnalysed: `Анализ ${expenses.length} недель`,
        sampleDays: records.length,
        significanceScore: Number(significanceScore.toFixed(2)),
        createdAt: Date.now()
      })
    }
  }

  return insights
}

/**
 * 3. Task Overload ➔ Habit Streak Fracture Evaluator
 * Identifies if habit misses happen predominantly on days with heavy task load (4+ tasks).
 */
export function evaluateTaskOverloadStreakFracture(
  records: DayRecord[],
  habits: Habit[]
): CrossModuleInsight[] {
  const insights: CrossModuleInsight[] = []
  if (records.length < 7) return insights

  habits.forEach(habit => {
    let streakBreaksCount = 0
    let breaksOnHeavyDaysCount = 0

    for (let i = 1; i < records.length; i++) {
      const prevDay = records[i - 1]
      const currentDay = records[i]

      const wasDonePrev = prevDay.completedHabitIds.includes(habit.id)
      const isMissedCurrent = !currentDay.completedHabitIds.includes(habit.id)

      if (wasDonePrev && isMissedCurrent) {
        streakBreaksCount++
        const totalDayTasks = currentDay.tasksCompletedCount + currentDay.tasksPendingCount
        if (totalDayTasks >= 4) {
          breaksOnHeavyDaysCount++
        }
      }
    }

    if (streakBreaksCount >= 3) {
      const heavyRatio = breaksOnHeavyDaysCount / streakBreaksCount
      if (heavyRatio >= 0.5) {
        const pct = Math.round(heavyRatio * 100)
        const significanceScore = Math.min(1, heavyRatio * 0.8 + 0.2)

        insights.push({
          id: `insight-overload-${habit.id}`,
          category: 'discipline',
          badgeIcon: 'shield',
          title: `Перегрузка: ${habit.title}`,
          claim: `Серия «${habit.title}» чаще всего прерывается в дни с высокой загрузкой (4+ задач).`,
          metricDetail: `${pct}% пропусков (${breaksOnHeavyDaysCount} из ${streakBreaksCount}) произошли в перегруженные дни.`,
          periodAnalysed: `Анализ ${records.length} дн. истории`,
          sampleDays: records.length,
          significanceScore: Number(significanceScore.toFixed(2)),
          habitId: habit.id,
          createdAt: Date.now()
        })
      }
    }
  })

  return insights
}

/**
 * 4. Wellbeing & Discipline Correlation Evaluator
 * Checks whether high habit completion correlates with higher subjective energy or mood.
 */
export function evaluateWellbeingDiscipline(
  records: DayRecord[],
  habits: Habit[]
): CrossModuleInsight[] {
  const insights: CrossModuleInsight[] = []
  if (habits.length === 0) return insights

  const recordsWithEnergy = records.filter(r => typeof r.energy === 'number')
  if (recordsWithEnergy.length < 6) return insights

  const highDisciplineEnergy: number[] = []
  const lowDisciplineEnergy: number[] = []

  recordsWithEnergy.forEach(r => {
    const completionRate = r.completedHabitIds.length / habits.length
    if (completionRate >= 0.6) {
      highDisciplineEnergy.push(r.energy!)
    } else {
      lowDisciplineEnergy.push(r.energy!)
    }
  })

  if (highDisciplineEnergy.length >= 3 && lowDisciplineEnergy.length >= 3) {
    const avgHigh = highDisciplineEnergy.reduce((a, b) => a + b, 0) / highDisciplineEnergy.length
    const avgLow = lowDisciplineEnergy.reduce((a, b) => a + b, 0) / lowDisciplineEnergy.length
    const diff = avgHigh - avgLow

    if (diff >= 0.5) {
      const significanceScore = Math.min(1, (diff / 2) * 0.7 + 0.3)

      insights.push({
        id: 'insight-wellbeing-energy',
        category: 'wellbeing',
        badgeIcon: 'heart',
        title: 'Энергия и дисциплина',
        claim: `В дни с выполненными привычками ваш уровень энергии на ${diff.toFixed(1)} балла выше.`,
        metricDetail: `Средняя энергия: ${avgHigh.toFixed(1)}/5 против ${avgLow.toFixed(1)}/5 в дни с пропусками.`,
        periodAnalysed: `На основе ${recordsWithEnergy.length} чекинов`,
        sampleDays: recordsWithEnergy.length,
        significanceScore: Number(significanceScore.toFixed(2)),
        createdAt: Date.now()
      })
    }
  }

  return insights
}
