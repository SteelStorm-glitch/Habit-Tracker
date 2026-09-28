import type { OgonyokCompactState, CrossModuleInsight } from '@/types/habit'
import { formatDateKey } from '../insights/matrixBuilder'

export interface ProactiveAdvice {
  date: string
  message: string
  type: 'insight' | 'streak' | 'recovery' | 'task_focus' | 'general'
  ctaPrompt: string
}

/**
 * Heuristically generates a sharp, contextual daily message from Ogonyok.
 * Ensures instant 0ms load time and works offline without consuming LLM quotas.
 */
export function generateLocalProactiveAdvice(
  state: OgonyokCompactState,
  insights: CrossModuleInsight[] = [],
  now: Date = new Date()
): ProactiveAdvice {
  const dateStr = formatDateKey(now)

  // 1. High-priority: System-discovered cross-module insight
  if (insights.length > 0) {
    const top = insights[0]
    return {
      date: dateStr,
      message: `Замечено системой: ${top.claim}`,
      type: 'insight',
      ctaPrompt: `Привет! Расскажи подробнее про инсайт: «${top.claim}» и как мне использовать это сегодня?`
    }
  }

  // 2. Overdue or heavy task load today
  if (state.tasks.overdueCount > 0) {
    return {
      date: dateStr,
      message: `У вас ${state.tasks.overdueCount} просроч. задач. Сделайте одну главную до обеда, чтобы не прерывать привычки вечером.`,
      type: 'task_focus',
      ctaPrompt: `У меня накопились просроченные задачи. Помоги приоритизировать дела на сегодня.`
    }
  }

  if (state.tasks.dueTodayCount >= 4) {
    return {
      date: dateStr,
      message: `Сегодня высокая загрузка (${state.tasks.dueTodayCount} задач). Запланируйте ключевые привычки на утро, пока есть ресурс.`,
      type: 'task_focus',
      ctaPrompt: `Сегодня много задач. Как распределить энергию и не забросить привычки?`
    }
  }

  // 3. Streak protection / celebration
  if (state.habits.topStreak && state.habits.topStreak.days >= 5) {
    return {
      date: dateStr,
      message: `Серия «${state.habits.topStreak.title}» держится уже ${state.habits.topStreak.days} дн. Поддержим пламя сегодня? 🔥`,
      type: 'streak',
      ctaPrompt: `Как не перегореть и закрепить привычку «${state.habits.topStreak.title}» надолго?`
    }
  }

  // 4. Recovery after recent miss
  if (state.habits.recentMisses.length > 0) {
    const miss = state.habits.recentMisses[0]
    return {
      date: dateStr,
      message: `Привычка «${miss}» пропущена в прошлые дни. Главное — не бросать: сделайте хотя бы 5 минут сегодня.`,
      type: 'recovery',
      ctaPrompt: `Я пропустил привычку «${miss}». Как легко войти в ритм без чувства вины?`
    }
  }

  // 5. Default encouraging focus
  return {
    date: dateStr,
    message: `Привет! Сфокусируйтесь сегодня на 1-2 главных ритуалах. Дисциплина строится маленькими шагами.`,
    type: 'general',
    ctaPrompt: `Огонёк, подскажи, с чего лучше начать день для максимального фокуса?`
  }
}

/**
 * Gets cached advice for today or generates and caches a new one.
 */
export function getOrGenerateProactiveDailyMessage(
  state: OgonyokCompactState,
  insights: CrossModuleInsight[] = [],
  now: Date = new Date()
): ProactiveAdvice {
  const dateStr = formatDateKey(now)
  const cacheKey = `ogonyok_daily_${dateStr}`

  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
    if (cached) {
      const parsed = JSON.parse(cached) as ProactiveAdvice
      if (parsed && parsed.date === dateStr && parsed.message) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed reading proactive advice cache:', err)
  }

  const fresh = generateLocalProactiveAdvice(state, insights, now)

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify(fresh))
    }
  } catch (err) {
    console.warn('Failed saving proactive advice cache:', err)
  }

  return fresh
}
