import { describe, it, expect, beforeEach } from 'vitest'
import type { Habit, Task, FinanceState, GamificationState, CrossModuleInsight } from '@/types/habit'
import {
  buildOgonyokCompactState,
  formatOgonyokPromptContext,
  buildOgonyokSystemPrompt
} from '../ogonyokContext'
import {
  generateLocalProactiveAdvice,
  getOrGenerateProactiveDailyMessage
} from '../proactiveMessage'

describe('Coach Ogonyok Context & Advice', () => {
  const mockHabits: Habit[] = [
    {
      id: 'h-1',
      title: 'Утренняя зарядка',
      category: 'Спорт',
      color: '#10b981',
      checks: {
        '2026-8': [20, 21, 22] // Sept 20, 21, 22
      },
      financialValue: {
        type: 'saves_money',
        amount: 300
      }
    }
  ]

  const mockTasks: Task[] = [
    {
      id: 't-1',
      title: 'Сдать отчет',
      category: 'Работа',
      priority: 'Urgent',
      dueDate: '2026-09-20',
      completed: false
    }
  ]

  const mockFinance: FinanceState = {
    transactions: [
      {
        id: 'tx-1',
        type: 'expense',
        amount: 1500,
        category: 'Кафе',
        date: '2026-09-21'
      },
      {
        id: 'tx-2',
        type: 'income',
        amount: 25000,
        category: 'Зарплата',
        date: '2026-09-05'
      }
    ],
    subscriptions: []
  }

  const mockGamification: GamificationState = {
    xp: 450,
    level: 5,
    streakDays: 8,
    maxStreak: 12,
    lastActiveDate: '2026-09-22',
    xpHistory: [],
    achievements: {}
  }

  const mockInsight: CrossModuleInsight = {
    id: 'ins-1',
    category: 'productivity',
    badgeIcon: 'zap',
    title: 'Зарядка и продуктивность',
    claim: 'В дни зарядки вы закрываете на 35% больше задач.',
    metricDetail: 'Среднее 3.5 против 2.2',
    periodAnalysed: '14 дней',
    sampleDays: 14,
    significanceScore: 0.85,
    createdAt: Date.now()
  }

  it('buildOgonyokCompactState constructs metrics correctly', () => {
    const refDate = new Date(2026, 8, 22) // 2026-09-22
    const state = buildOgonyokCompactState(
      mockHabits,
      mockTasks,
      mockFinance,
      mockGamification,
      [],
      [mockInsight],
      refDate
    )

    expect(state.habits.total).toBe(1)
    expect(state.habits.topStreak?.title).toBe('Утренняя зарядка')
    expect(state.habits.topStreak?.days).toBe(8)
    expect(state.tasks.pendingCount).toBe(1)
    expect(state.tasks.overdueCount).toBe(1) // Sept 20 is before Sept 22
    expect(state.finance.monthNetBalance).toBe(23500)
    expect(state.finance.topExpenseCategory).toBe('Кафе')
    expect(state.finance.habitSavingsTotal).toBe(900) // 3 checks * 300
    expect(state.gamification.level).toBe(5)
    expect(state.gamification.stage).toBe('ember')
    expect(state.topInsights).toContain(mockInsight.claim)
  })

  it('formatOgonyokPromptContext creates token-efficient summary', () => {
    const refDate = new Date(2026, 8, 22)
    const state = buildOgonyokCompactState(
      mockHabits,
      mockTasks,
      mockFinance,
      mockGamification,
      [],
      [mockInsight],
      refDate
    )

    const promptContext = formatOgonyokPromptContext(state)
    expect(promptContext).toContain('Привычки:')
    expect(promptContext).toContain('Утренняя зарядка')
    expect(promptContext).toContain('Задачи:')
    expect(promptContext).toContain('просрочено: 1')
    expect(promptContext).toContain('Финансы:')
    expect(promptContext).toContain('топ расходов: Кафе')
    expect(promptContext).toContain('Выявленные инсайты системы:')
    expect(promptContext.length).toBeLessThan(1000) // Compact token budget
  })

  it('buildOgonyokSystemPrompt embeds persona and real-time state', () => {
    const refDate = new Date(2026, 8, 22)
    const state = buildOgonyokCompactState(
      mockHabits,
      mockTasks,
      mockFinance,
      mockGamification,
      [],
      [mockInsight],
      refDate
    )

    const sysPrompt = buildOgonyokSystemPrompt(state)
    expect(sysPrompt).toContain('Ты — «Огонёк» (Ogonyok)')
    expect(sysPrompt).toContain('[РЕАЛЬНЫЕ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ]:')
    expect(sysPrompt).toContain('Утренняя зарядка')
  })

  it('generateLocalProactiveAdvice prioritizes discovered insights', () => {
    const refDate = new Date(2026, 8, 22)
    const state = buildOgonyokCompactState(
      mockHabits,
      mockTasks,
      mockFinance,
      mockGamification,
      [],
      [mockInsight],
      refDate
    )

    const advice = generateLocalProactiveAdvice(state, [mockInsight], refDate)
    expect(advice.type).toBe('insight')
    expect(advice.message).toContain(mockInsight.claim)
    expect(advice.ctaPrompt).toContain(mockInsight.claim)
  })
})
