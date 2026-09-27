export interface Habit {
  id: string
  title: string
  subtitle?: string
  emoji?: string
  icon?: string
  category: string
  color: string
  targetMin?: number
  freq?: 'daily' | 'custom'
  dow?: number[]
  reminder?: boolean
  reminderTime?: string
  checks: Record<string, number[]> // "YYYY-M": [1, 2, 15, ...]
}

export interface Task {
  id: string
  title: string
  notes?: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate: string // YYYY-MM-DD
  completed: boolean
  aiGenerated?: boolean // Whether this task was suggested by AI
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  date: string // YYYY-MM-DD
  note?: string
}

export interface Subscription {
  id: string
  name: string
  cost: number
  cycle: 'monthly' | 'annual'
  billingDay: number // 1-31
  icon?: string
  nextDate?: string
}

export interface FinanceState {
  transactions: Transaction[]
  subscriptions: Subscription[]
}

export interface AchievementItem {
  id: string
  title: string
  desc: string
  icon: string
  category: 'streak' | 'habits' | 'tasks' | 'finance' | 'level'
  unlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
}

export interface GamificationState {
  xp: number
  level: number
  streakDays: number
  maxStreak: number
  lastActiveDate: string // YYYY-MM-DD
  xpHistory: XpEvent[]
  achievements: Record<string, {
    unlocked: boolean
    unlockedAt?: string
    progress: number
  }>
}

export interface XpEvent {
  id: string
  amount: number
  reason: string
  timestamp: string // ISO string
}

export interface AiSettings {
  provider: 'local' | 'openai' | 'gemini' | 'custom'
  apiKey: string
  model: string
  baseUrl?: string // For custom providers
  temperature: number
}

export interface UserPrefs {
  lang: 'ru' | 'en'
  theme: 'dark' | 'light'
  tableDensity: 'normal' | 'dense'
  reminderEnabled: boolean
  weeklySummaryEnabled: boolean
  selectedMonth: number // 0-11
  selectedYear: number
  userName: string
  userTag: string
  tourCompleted?: boolean
  animationsEnabled: boolean
}

export interface AuthUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt?: string
  bio?: string
  isGuest: boolean
}

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

export interface AiMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: string
}

export interface EmailVerificationState {
  email: string
  code: string
  expiresAt: number
  isVerified: boolean
}
