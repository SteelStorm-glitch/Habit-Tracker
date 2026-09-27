import {
  db,
  rtdb,
  doc,
  getDoc,
  setDoc,
  ref,
  get,
  set
} from './firebase'
import type { GamificationState, Habit, Task, FinanceState, AchievementItem } from '@/types/habit'

export const DEFAULT_ACHIEVEMENTS_CONFIG: Omit<AchievementItem, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_step',
    title: 'Первый шаг',
    desc: 'Отметить первую привычку',
    icon: '🎯',
    category: 'habits',
    maxProgress: 1
  },
  {
    id: 'streak_7',
    title: 'Неделя силы',
    desc: 'Стрик 7 дней подряд без единого пропуска',
    icon: '🔥',
    category: 'streak',
    maxProgress: 7
  },
  {
    id: 'master_habits',
    title: 'Мастер привычек',
    desc: 'Завершить все привычки за день',
    icon: '⭐',
    category: 'habits',
    maxProgress: 1
  },
  {
    id: 'finance_guru',
    title: 'Финансовый гуру',
    desc: 'Внести 10 финансовых записей или подписок',
    icon: '💎',
    category: 'finance',
    maxProgress: 10
  },
  {
    id: 'streak_30',
    title: 'Месяц дисциплины',
    desc: 'Удерживать активный стрик 30 дней',
    icon: '🏆',
    category: 'streak',
    maxProgress: 30
  },
  {
    id: 'level_5',
    title: 'Уровень 5',
    desc: 'Набрать суммарно 750 очков опыта (XP)',
    icon: '👑',
    category: 'level',
    maxProgress: 750
  }
]

export function getInitialGamification(todayStr: string): GamificationState {
  const achievements: Record<string, { unlocked: boolean; progress: number; unlockedAt?: string }> = {}
  DEFAULT_ACHIEVEMENTS_CONFIG.forEach(a => {
    achievements[a.id] = { unlocked: false, progress: 0 }
  })

  return {
    xp: 0,
    level: 1,
    streakDays: 1,
    maxStreak: 1,
    lastActiveDate: todayStr,
    xpHistory: [
      {
        id: `xp-welcome-${Date.now()}`,
        amount: 25,
        reason: 'Добро пожаловать в HabitSpace!',
        timestamp: new Date().toISOString()
      }
    ],
    achievements
  }
}

export function translateFirebaseError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Произошла непредвиденная ошибка.'
  const code = 'code' in error ? String(error.code) : ''

  switch (code) {
    case 'auth/invalid-email':
      return 'Введён некорректный формат email адреса.'
    case 'auth/user-disabled':
      return 'Данный аккаунт был отключен администратором.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Неверный email или пароль.'
    case 'auth/email-already-in-use':
      return 'Пользователь с таким email уже зарегистрирован. Попробуйте войти.'
    case 'auth/weak-password':
      return 'Пароль слишком простой (требуется минимум 6 символов).'
    case 'auth/popup-closed-by-user':
      return 'Окно авторизации Google было закрыто.'
    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверьте интернет-соединение.'
    case 'auth/popup-blocked':
      return 'Всплывающее окно заблокировано браузером. Разрешите всплывающие окна.'
    default:
      return 'message' in error ? String(error.message) : 'Не удалось выполнить операцию с аккаунтом.'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloud Sync: Load & Save Gamification directly to Firebase
// ─────────────────────────────────────────────────────────────────────────────

export async function loadCloudGamification(uid: string, todayStr: string): Promise<GamificationState> {
  try {
    // 1. Try Firestore users doc
    const userDocRef = doc(db, 'users', uid)
    const snapshot = await getDoc(userDocRef)
    if (snapshot.exists()) {
      const data = snapshot.data()
      if (data && data.gamification) {
        return data.gamification as GamificationState
      }
    }
  } catch (err) {
    console.warn('Firestore load failed, trying Realtime DB fallback:', err)
  }

  try {
    // 2. Fallback to Realtime Database
    const rtdbRef = ref(rtdb, `users/${uid}/gamification`)
    const snap = await get(rtdbRef)
    if (snap.exists()) {
      return snap.val() as GamificationState
    }
  } catch (err) {
    console.warn('RTDB load failed:', err)
  }

  // 3. If no cloud data found, initialize new gamification state and save to cloud
  const fresh = getInitialGamification(todayStr)
  await saveCloudGamification(uid, fresh).catch(() => {})
  return fresh
}

export async function saveCloudGamification(uid: string, gamification: GamificationState): Promise<boolean> {
  let saved = false

  try {
    // 1. Save to Firestore (Primary Cloud Storage)
    const userDocRef = doc(db, 'users', uid)
    await setDoc(userDocRef, { gamification, updatedAt: new Date().toISOString() }, { merge: true })
    saved = true
  } catch (err) {
    console.warn('Firestore save failed, attempting RTDB fallback:', err)
    try {
      const rtdbRef = ref(rtdb, `users/${uid}/gamification`)
      await set(rtdbRef, gamification)
      saved = true
    } catch {
      // RTDB fallback failed or permission denied
    }
  }

  return saved
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluate and update Achievements based on live user activity
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateAchievements(
  current: GamificationState,
  habits: Habit[],
  tasks: Task[],
  finances: FinanceState
): { updatedGamification: GamificationState; newlyUnlocked: AchievementItem[] } {
  const newlyUnlocked: AchievementItem[] = []
  const achievements = { ...current.achievements }

  // 1. First step (any completed check)
  let totalHabitChecks = 0
  habits.forEach(h => {
    Object.values(h.checks).forEach(arr => {
      totalHabitChecks += arr.length
    })
  })
  const firstStepAch = achievements['first_step'] || { unlocked: false, progress: 0 }
  if (!firstStepAch.unlocked) {
    const prog = Math.min(1, totalHabitChecks)
    const isUnlocked = prog >= 1
    achievements['first_step'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'first_step',
        title: 'Первый шаг',
        desc: 'Отметить первую привычку',
        icon: '🎯',
        category: 'habits',
        unlocked: true,
        progress: 1,
        maxProgress: 1
      })
    }
  }

  // 2. Master Habits & Tasks
  const masterAch = achievements['master_habits'] || { unlocked: false, progress: 0 }
  if (!masterAch.unlocked) {
    const completedTasks = tasks.filter(t => t.completed).length
    const prog = Math.min(1, totalHabitChecks >= 1 || completedTasks >= 1 ? 1 : 0)
    const isUnlocked = prog >= 1
    achievements['master_habits'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'master_habits',
        title: 'Мастер привычек',
        desc: 'Завершить привычку или задачу',
        icon: '⭐',
        category: 'habits',
        unlocked: true,
        progress: 1,
        maxProgress: 1
      })
    }
  }

  // 3. Streak 7
  const streak7Ach = achievements['streak_7'] || { unlocked: false, progress: 0 }
  if (!streak7Ach.unlocked) {
    const prog = Math.min(7, current.streakDays)
    const isUnlocked = current.streakDays >= 7
    achievements['streak_7'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'streak_7',
        title: 'Неделя силы',
        desc: 'Стрик 7 дней подряд без единого пропуска',
        icon: '🔥',
        category: 'streak',
        unlocked: true,
        progress: 7,
        maxProgress: 7
      })
    }
  }

  // 3. Streak 30
  const streak30Ach = achievements['streak_30'] || { unlocked: false, progress: 0 }
  if (!streak30Ach.unlocked) {
    const prog = Math.min(30, current.streakDays)
    const isUnlocked = current.streakDays >= 30
    achievements['streak_30'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'streak_30',
        title: 'Месяц дисциплины',
        desc: 'Удерживать активный стрик 30 дней',
        icon: '🏆',
        category: 'streak',
        unlocked: true,
        progress: 30,
        maxProgress: 30
      })
    }
  }

  // 4. Finance Guru (10 entries)
  const totalFinances = (finances.transactions?.length || 0) + (finances.subscriptions?.length || 0)
  const finAch = achievements['finance_guru'] || { unlocked: false, progress: 0 }
  if (!finAch.unlocked) {
    const prog = Math.min(10, totalFinances)
    const isUnlocked = prog >= 10
    achievements['finance_guru'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'finance_guru',
        title: 'Финансовый гуру',
        desc: 'Внести 10 финансовых записей или подписок',
        icon: '💎',
        category: 'finance',
        unlocked: true,
        progress: 10,
        maxProgress: 10
      })
    }
  }

  // 5. Level 5 (750 XP)
  const lvl5Ach = achievements['level_5'] || { unlocked: false, progress: 0 }
  if (!lvl5Ach.unlocked) {
    const prog = Math.min(750, current.xp)
    const isUnlocked = current.xp >= 750
    achievements['level_5'] = {
      unlocked: isUnlocked,
      progress: prog,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined
    }
    if (isUnlocked) {
      newlyUnlocked.push({
        id: 'level_5',
        title: 'Уровень 5',
        desc: 'Набрать суммарно 750 очков опыта (XP)',
        icon: '👑',
        category: 'level',
        unlocked: true,
        progress: 750,
        maxProgress: 750
      })
    }
  }

  return {
    updatedGamification: {
      ...current,
      achievements
    },
    newlyUnlocked
  }
}
