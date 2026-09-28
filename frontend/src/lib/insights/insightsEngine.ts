import type {
  Habit,
  Task,
  Transaction,
  DailyCheckIn,
  InsightsResult,
  CrossModuleInsight
} from '@/types/habit'
import { buildDayMatrix } from './matrixBuilder'
import {
  evaluateHabitTaskProductivity,
  evaluateDayOfWeekSpendingAnomaly,
  evaluateTaskOverloadStreakFracture,
  evaluateWellbeingDiscipline
} from './evaluators'

const MIN_REQUIRED_DAYS = 14

/**
 * Computes deterministic cross-module insights from habits, tasks, finances, and check-ins.
 * Requires at least 14 days of history to avoid spurious conclusions.
 */
export function computeCrossModuleInsights(
  habits: Habit[],
  tasks: Task[],
  transactions: Transaction[],
  checkIns: DailyCheckIn[] = []
): InsightsResult {
  const records = buildDayMatrix(habits, tasks, transactions, checkIns)

  // Count active days: days with any habit completions, task activity, expense, or check-in
  const activeDays = records.filter(r =>
    r.completedHabitIds.length > 0 ||
    r.tasksCompletedCount > 0 ||
    r.tasksPendingCount > 0 ||
    r.totalExpenses > 0 ||
    typeof r.mood === 'number' ||
    typeof r.energy === 'number'
  )

  const currentDays = activeDays.length

  if (currentDays < MIN_REQUIRED_DAYS) {
    return {
      insights: [],
      dataCompleteness: {
        currentDays,
        requiredDays: MIN_REQUIRED_DAYS
      }
    }
  }

  // Run all deterministic evaluators
  const rawInsights: CrossModuleInsight[] = [
    ...evaluateHabitTaskProductivity(records, habits),
    ...evaluateDayOfWeekSpendingAnomaly(records),
    ...evaluateTaskOverloadStreakFracture(records, habits),
    ...evaluateWellbeingDiscipline(records, habits)
  ]

  // Deduplicate by ID
  const map = new Map<string, CrossModuleInsight>()
  rawInsights.forEach(ins => {
    if (!map.has(ins.id)) {
      map.set(ins.id, ins)
    }
  })

  // Sort by significance score descending
  const sorted = Array.from(map.values())
    .sort((a, b) => b.significanceScore - a.significanceScore)
    .slice(0, 8)

  return {
    insights: sorted,
    dataCompleteness: {
      currentDays,
      requiredDays: MIN_REQUIRED_DAYS
    }
  }
}
