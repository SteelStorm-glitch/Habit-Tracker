import type {
  Habit,
  Task,
  Transaction,
  DailyCheckIn,
  DayRecord
} from '@/types/habit'

/**
 * Normalizes Date to 'YYYY-MM-DD'
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parses 'YYYY-MM-DD' safely into year, month (0-indexed), and day
 */
export function parseDateKey(key: string): { year: number; month: number; day: number; dayOfWeek: number } {
  const [y, m, d] = key.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  return {
    year: y,
    month: m - 1,
    day: d,
    dayOfWeek: dateObj.getDay()
  }
}

/**
 * Builds normalized DayRecord[] from all four modules:
 * Habits, Tasks, Transactions, and Daily Check-ins.
 */
export function buildDayMatrix(
  habits: Habit[],
  tasks: Task[],
  transactions: Transaction[],
  checkIns: DailyCheckIn[] = []
): DayRecord[] {
  const datesSet = new Set<string>()

  // 1. Collect dates from habit completions
  habits.forEach(habit => {
    Object.entries(habit.checks || {}).forEach(([monthKey, days]) => {
      const [yearStr, monthStr] = monthKey.split('-')
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10) // 0-indexed
      if (isNaN(year) || isNaN(month)) return

      days.forEach(day => {
        const date = new Date(year, month, day)
        datesSet.add(formatDateKey(date))
      })
    })
  })

  // 2. Collect dates from tasks
  tasks.forEach(task => {
    if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
      datesSet.add(task.dueDate)
    }
  })

  // 3. Collect dates from transactions
  transactions.forEach(tx => {
    if (tx.date && /^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
      datesSet.add(tx.date)
    }
  })

  // 4. Collect dates from check-ins
  checkIns.forEach(ci => {
    if (ci.date && /^\d{4}-\d{2}-\d{2}$/.test(ci.date)) {
      datesSet.add(ci.date)
    }
  })

  // Fast lookups
  const checkInsByDate = new Map<string, DailyCheckIn>()
  checkIns.forEach(ci => checkInsByDate.set(ci.date, ci))

  const tasksByDate = new Map<string, Task[]>()
  tasks.forEach(t => {
    if (!t.dueDate) return
    const list = tasksByDate.get(t.dueDate) || []
    list.push(t)
    tasksByDate.set(t.dueDate, list)
  })

  const expensesByDate = new Map<string, Transaction[]>()
  transactions.forEach(tx => {
    if (tx.type !== 'expense' || !tx.date) return
    const list = expensesByDate.get(tx.date) || []
    list.push(tx)
    expensesByDate.set(tx.date, list)
  })

  const sortedDates = Array.from(datesSet).sort()

  const records: DayRecord[] = sortedDates.map(dateStr => {
    const { year, month, day, dayOfWeek } = parseDateKey(dateStr)
    const monthKey = `${year}-${month}`

    // Habits completed on this date
    const completedHabitIds: string[] = []
    const completedHabitTitles: string[] = []

    habits.forEach(h => {
      const checkedDays = h.checks?.[monthKey] || []
      if (checkedDays.includes(day)) {
        completedHabitIds.push(h.id)
        completedHabitTitles.push(h.title)
      }
    })

    // Tasks on this date
    const dayTasks = tasksByDate.get(dateStr) || []
    const tasksCompletedCount = dayTasks.filter(t => t.completed).length
    const tasksPendingCount = dayTasks.filter(t => !t.completed).length

    // Expenses on this date
    const dayExpenses = expensesByDate.get(dateStr) || []
    let totalExpenses = 0
    const expensesByCategory: Record<string, number> = {}

    dayExpenses.forEach(tx => {
      totalExpenses += tx.amount
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount
    })

    // Wellbeing
    const checkIn = checkInsByDate.get(dateStr)

    return {
      date: dateStr,
      dayOfWeek,
      completedHabitIds,
      completedHabitTitles,
      tasksCompletedCount,
      tasksPendingCount,
      totalExpenses,
      expensesByCategory,
      mood: checkIn?.mood,
      energy: checkIn?.energy
    }
  })

  return records
}
