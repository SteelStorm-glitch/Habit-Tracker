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
  financialValue?: HabitFinancialValue
  streakFreezesUsed?: number
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

export interface UserCloudData {
  habits?: Habit[]
  tasks?: Task[]
  finances?: FinanceState
  gamification?: GamificationState
  prefs?: Partial<UserPrefs>
  checkIns?: DailyCheckIn[]
  updatedAt?: string
}

// ──────────────────────────────────────────────
// Milestone 1: Cross-Module Insights & Coach Types
// ──────────────────────────────────────────────

export type HabitPriceType = 'none' | 'saves_money' | 'costs_money'

export interface HabitFinancialValue {
  type: HabitPriceType
  amount: number
  monthlyCost?: number
}

export interface DailyCheckIn {
  date: string // 'YYYY-MM-DD'
  mood: number // 1 to 5
  energy: number // 1 to 5
  note?: string
  updatedAt: number
}

export interface DayRecord {
  date: string // 'YYYY-MM-DD'
  dayOfWeek: number // 0 (Sun) to 6 (Sat)
  completedHabitIds: string[]
  completedHabitTitles: string[]
  tasksCompletedCount: number
  tasksPendingCount: number
  totalExpenses: number
  expensesByCategory: Record<string, number>
  mood?: number
  energy?: number
}

export type InsightCategory = 'productivity' | 'spending' | 'discipline' | 'wellbeing'

export interface CrossModuleInsight {
  id: string
  category: InsightCategory
  title: string
  claim: string
  metricDetail: string
  periodAnalysed: string
  sampleDays: number
  significanceScore: number // 0 to 1
  badgeIcon: 'zap' | 'trending-up' | 'wallet' | 'shield' | 'heart'
  habitId?: string
  createdAt: number
}

export interface InsightsResult {
  insights: CrossModuleInsight[]
  dataCompleteness: {
    currentDays: number
    requiredDays: number
  }
}

export interface OgonyokCompactState {
  habits: {
    total: number
    completionRate7d: number
    topStreak: { title: string; days: number } | null
    recentMisses: string[]
  }
  tasks: {
    pendingCount: number
    overdueCount: number
    dueTodayCount: number
    completedLast7d: number
  }
  finance: {
    monthNetBalance: number
    topExpenseCategory: string | null
    habitSavingsTotal: number
  }
  wellbeing: {
    avgMood7d: number | null
    avgEnergy7d: number | null
  }
  gamification: {
    level: number
    xp: number
    stage: 'spark' | 'ember' | 'flame' | 'blaze'
  }
  topInsights: string[]
}
