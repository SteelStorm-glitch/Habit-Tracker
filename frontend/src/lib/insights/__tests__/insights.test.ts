import { describe, it, expect } from 'vitest'
import type { Habit, Task, Transaction, DailyCheckIn } from '@/types/habit'
import { buildDayMatrix } from '../matrixBuilder'
import { computeCrossModuleInsights } from '../insightsEngine'
import {
  evaluateHabitTaskProductivity,
  evaluateDayOfWeekSpendingAnomaly,
  evaluateTaskOverloadStreakFracture,
  evaluateWellbeingDiscipline
} from '../evaluators'

describe('Insights Matrix & Engine', () => {
  it('buildDayMatrix correctly aggregates cross-module records by date', () => {
    const habits: Habit[] = [
      {
        id: 'h-run',
        title: 'Утренняя пробежка',
        category: 'Спорт',
        color: '#10b981',
        checks: {
          '2026-8': [10, 11] // Sept 10, 11 2026
        }
      }
    ]

    const tasks: Task[] = [
      {
        id: 't-1',
        title: 'Запустить проект',
        category: 'Работа',
        priority: 'High',
        dueDate: '2026-09-10',
        completed: true
      },
      {
        id: 't-2',
        title: 'Написать тесты',
        category: 'Работа',
        priority: 'Medium',
        dueDate: '2026-09-10',
        completed: false
      }
    ]

    const transactions: Transaction[] = [
      {
        id: 'tx-1',
        type: 'expense',
        amount: 450,
        category: 'Еда',
        date: '2026-09-10'
      }
    ]

    const checkIns: DailyCheckIn[] = [
      {
        date: '2026-09-10',
        mood: 4,
        energy: 5,
        updatedAt: Date.now()
      }
    ]

    const matrix = buildDayMatrix(habits, tasks, transactions, checkIns)
    expect(matrix.length).toBe(2) // Sept 10 and Sept 11

    const day10 = matrix.find(r => r.date === '2026-09-10')
    expect(day10).toBeDefined()
    expect(day10?.completedHabitIds).toContain('h-run')
    expect(day10?.tasksCompletedCount).toBe(1)
    expect(day10?.tasksPendingCount).toBe(1)
    expect(day10?.totalExpenses).toBe(450)
    expect(day10?.expensesByCategory['Еда']).toBe(450)
    expect(day10?.mood).toBe(4)
    expect(day10?.energy).toBe(5)
  })

  it('enforces 14-day threshold rule and returns empty insights if < 14 days', () => {
    // Only 5 days of data
    const habits: Habit[] = [
      {
        id: 'h-1',
        title: 'Вода',
        category: 'Здоровье',
        color: '#06b6d4',
        checks: {
          '2026-8': [1, 2, 3, 4, 5]
        }
      }
    ]

    const result = computeCrossModuleInsights(habits, [], [], [])
    expect(result.dataCompleteness.currentDays).toBe(5)
    expect(result.dataCompleteness.requiredDays).toBe(14)
    expect(result.insights).toHaveLength(0)
  })

  it('detects Habit -> Task Productivity correlation on 20-day dataset', () => {
    const habits: Habit[] = [
      {
        id: 'h-run',
        title: 'Пробежка',
        category: 'Спорт',
        color: '#10b981',
        checks: {
          // Completed on even days: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
          '2026-8': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
        }
      }
    ]

    const tasks: Task[] = []

    // Even days (run completed) -> 4 completed tasks
    // Odd days (run missed) -> 1 completed task
    for (let day = 1; day <= 20; day++) {
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`
      const isRunDay = day % 2 === 0
      const count = isRunDay ? 4 : 1

      for (let t = 0; t < count; t++) {
        tasks.push({
          id: `t-${day}-${t}`,
          title: `Task ${day}-${t}`,
          category: 'Work',
          priority: 'Medium',
          dueDate: dateStr,
          completed: true
        })
      }
    }

    const matrix = buildDayMatrix(habits, tasks, [], [])
    const insights = evaluateHabitTaskProductivity(matrix, habits)

    expect(insights.length).toBeGreaterThan(0)
    const runInsight = insights.find(i => i.habitId === 'h-run')
    expect(runInsight).toBeDefined()
    expect(runInsight?.category).toBe('productivity')
    expect(runInsight?.badgeIcon).toBe('zap')
    expect(runInsight?.claim).toContain('Пробежка')
    expect(runInsight?.claim).toContain('% больше задач')
  })

  it('detects Friday/weekend spending anomaly', () => {
    // Generate 4 weeks of data (28 days)
    // Friday (dow = 5) has 3500 expense, other days 300
    const transactions: Transaction[] = []
    const habits: Habit[] = [
      {
        id: 'h-dummy',
        title: 'Check',
        category: 'General',
        color: '#fff',
        checks: { '2026-8': Array.from({ length: 28 }, (_, i) => i + 1) }
      }
    ]

    for (let day = 1; day <= 28; day++) {
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`
      const date = new Date(2026, 8, day) // 2026-09-01 is Tuesday (dow 2)
      const dow = date.getDay()
      const amount = dow === 5 ? 4000 : 400

      transactions.push({
        id: `tx-${day}`,
        type: 'expense',
        amount,
        category: 'Развлечения',
        date: dateStr
      })
    }

    const matrix = buildDayMatrix(habits, [], transactions, [])
    const insights = evaluateDayOfWeekSpendingAnomaly(matrix)

    expect(insights.length).toBeGreaterThan(0)
    const fridayInsight = insights.find(i => i.id === 'insight-spend-dow-5')
    expect(fridayInsight).toBeDefined()
    expect(fridayInsight?.category).toBe('spending')
    expect(fridayInsight?.badgeIcon).toBe('wallet')
    expect(fridayInsight?.claim).toContain('пятницам')
  })

  it('detects Task Overload streak fracture', () => {
    // 20 days: habit done on days 1..3, breaks on day 4 (5 tasks)
    // done on days 5..7, breaks on day 8 (6 tasks)
    // done on days 9..11, breaks on day 12 (5 tasks)
    const habitChecks: number[] = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15]
    const habits: Habit[] = [
      {
        id: 'h-read',
        title: 'Чтение',
        category: 'Саморазвитие',
        color: '#f59e0b',
        checks: { '2026-8': habitChecks }
      }
    ]

    const tasks: Task[] = []
    const heavyDays = [4, 8, 12]

    for (let day = 1; day <= 16; day++) {
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`
      const count = heavyDays.includes(day) ? 5 : 1
      for (let t = 0; t < count; t++) {
        tasks.push({
          id: `t-${day}-${t}`,
          title: `Task ${day}`,
          category: 'Work',
          priority: 'High',
          dueDate: dateStr,
          completed: false
        })
      }
    }

    const matrix = buildDayMatrix(habits, tasks, [], [])
    const insights = evaluateTaskOverloadStreakFracture(matrix, habits)

    expect(insights.length).toBeGreaterThan(0)
    const readInsight = insights.find(i => i.habitId === 'h-read')
    expect(readInsight).toBeDefined()
    expect(readInsight?.category).toBe('discipline')
    expect(readInsight?.badgeIcon).toBe('shield')
    expect(readInsight?.claim).toContain('высокой загрузкой')
  })

  it('detects Wellbeing & Discipline correlation with check-ins', () => {
    const habits: Habit[] = [
      {
        id: 'h-1',
        title: 'H1',
        category: 'C1',
        color: '#fff',
        checks: { '2026-8': [1, 2, 3, 4, 5, 6, 7] }
      },
      {
        id: 'h-2',
        title: 'H2',
        category: 'C2',
        color: '#fff',
        checks: { '2026-8': [1, 2, 3, 4, 5, 6, 7] }
      }
    ]

    const checkIns: DailyCheckIn[] = []

    // Days 1..7: high discipline -> energy = 5
    for (let day = 1; day <= 7; day++) {
      checkIns.push({
        date: `2026-09-${String(day).padStart(2, '0')}`,
        mood: 5,
        energy: 5,
        updatedAt: Date.now()
      })
    }

    // Days 8..14: 0 habits done -> energy = 2
    for (let day = 8; day <= 14; day++) {
      checkIns.push({
        date: `2026-09-${String(day).padStart(2, '0')}`,
        mood: 2,
        energy: 2,
        updatedAt: Date.now()
      })
    }

    const matrix = buildDayMatrix(habits, [], [], checkIns)
    const insights = evaluateWellbeingDiscipline(matrix, habits)

    expect(insights.length).toBeGreaterThan(0)
    const wb = insights.find(i => i.id === 'insight-wellbeing-energy')
    expect(wb).toBeDefined()
    expect(wb?.category).toBe('wellbeing')
    expect(wb?.badgeIcon).toBe('heart')
    expect(wb?.claim).toContain('уровень энергии')
  })
})
