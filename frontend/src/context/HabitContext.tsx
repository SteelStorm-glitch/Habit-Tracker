import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type {
  Habit,
  Task,
  FinanceState,
  UserPrefs,
  Transaction,
  Subscription,
  AuthUser,
  FirebaseConfig,
  AiMessage,
  GamificationState,
  XpEvent,
  AiSettings,
  DailyCheckIn,
  CrossModuleInsight,
  InsightsResult,
  OgonyokCompactState
} from '@/types/habit'
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from '@/lib/firebase'
import {
  loadFullUserData,
  saveFullUserData,
  saveCloudGamification,
  evaluateAchievements,
  getInitialGamification,
  translateFirebaseError
} from '@/lib/firebaseAuthService'
import { generateGeminiResponse, GEMINI_API_KEY, cleanAiResponse } from '@/lib/gemini'
import { computeCrossModuleInsights } from '@/lib/insights/insightsEngine'
import { buildOgonyokCompactState, buildOgonyokSystemPrompt } from '@/lib/coach/ogonyokContext'
import { getOrGenerateProactiveDailyMessage, type ProactiveAdvice } from '@/lib/coach/proactiveMessage'

const STORAGE_KEYS = {
  HABITS: 'habit_app_habits',
  TASKS: 'habit_app_tasks',
  FINANCE: 'habit_app_finances',
  SETTINGS: 'habit_app_settings',
  FB_CONFIG: 'habit_app_fb_config',
  DEV_MODE: 'habit_app_dev_mode',
  AUTH_USER: 'habit_app_auth_user',
  AI_SETTINGS: 'habit_app_ai_settings',
  CHECKINS: 'habit_app_checkins',
}

const VALID_DEV_CODES = ['1337', 'DEV', 'DEVELOPER', 'ADMIN', '7777']

const DEFAULT_PREFS: UserPrefs = {
  lang: 'ru',
  theme: 'dark',
  tableDensity: 'normal',
  reminderEnabled: true,
  weeklySummaryEnabled: false,
  selectedMonth: 8,
  selectedYear: 2026,
  userName: 'Гость',
  userTag: 'GS',
  tourCompleted: true,
  animationsEnabled: true,
}

const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: 'gemini',
  apiKey: GEMINI_API_KEY,
  model: 'gemini-3.5-flash-lite',
  temperature: 0.7,
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h-1',
    title: 'Пить воду',
    subtitle: '2 литра в день',
    emoji: '💧',
    category: 'Здоровье',
    color: '#06b6d4',
    checks: {
      '2026-8': [1, 2, 3, 4, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22]
    }
  },
  {
    id: 'h-2',
    title: 'Пробежка',
    subtitle: '3 км утром',
    emoji: '🏃',
    category: 'Спорт',
    color: '#10b981',
    checks: {
      '2026-8': [3, 5, 7, 10, 12, 14, 17, 19, 21]
    }
  },
  {
    id: 'h-3',
    title: 'Чтение',
    subtitle: '20 страниц',
    emoji: '📖',
    category: 'Саморазвитие',
    color: '#f59e0b',
    checks: {
      '2026-8': [1, 2, 3, 5, 6, 8, 10, 11, 14, 15, 17, 20, 22]
    }
  },
  {
    id: 'h-4',
    title: 'Глубокая работа',
    subtitle: '2 часа без отвлечений',
    emoji: '💻',
    category: 'Работа',
    color: '#6366f1',
    checks: {
      '2026-8': [1, 2, 5, 6, 12, 14, 15, 19, 21]
    }
  },
  {
    id: 'h-5',
    title: 'Сон до 23:30',
    subtitle: 'Ложиться вовремя',
    emoji: '🌙',
    category: 'Здоровье',
    color: '#f43f5e',
    checks: {
      '2026-8': [3, 4, 9, 13, 16, 18, 20, 22]
    }
  }
]

const DEFAULT_TASKS: Task[] = [
  // Completed tasks across the month correlating with habits
  { id: 't-hist-1', title: 'Утренняя планёрка', category: 'Работа', priority: 'High', dueDate: '2026-09-03', completed: true },
  { id: 't-hist-2', title: 'Анализ метрик', category: 'Работа', priority: 'Medium', dueDate: '2026-09-03', completed: true },
  { id: 't-hist-3', title: 'Ревью PR', category: 'Работа', priority: 'Medium', dueDate: '2026-09-03', completed: true },
  { id: 't-hist-4', title: 'Оплата счетов', category: 'Финансы', priority: 'Low', dueDate: '2026-09-04', completed: true },
  { id: 't-hist-5', title: 'Дизайн спринт', category: 'Работа', priority: 'High', dueDate: '2026-09-05', completed: true },
  { id: 't-hist-6', title: 'Созвон с клиентом', category: 'Работа', priority: 'High', dueDate: '2026-09-05', completed: true },
  { id: 't-hist-7', title: 'Документация API', category: 'Работа', priority: 'Medium', dueDate: '2026-09-05', completed: true },
  { id: 't-hist-8', title: 'Подготовка отчёта', category: 'Работа', priority: 'Medium', dueDate: '2026-09-07', completed: true },
  { id: 't-hist-9', title: 'Ревью кода', category: 'Работа', priority: 'High', dueDate: '2026-09-07', completed: true },
  { id: 't-hist-10', title: 'Синхронизация бэкенда', category: 'Работа', priority: 'High', dueDate: '2026-09-07', completed: true },
  { id: 't-hist-11', title: 'Апдейт баг-трекера', category: 'Работа', priority: 'Low', dueDate: '2026-09-08', completed: true },
  { id: 't-hist-12', title: 'Фронтенд рефакторинг', category: 'Работа', priority: 'High', dueDate: '2026-09-10', completed: true },
  { id: 't-hist-13', title: 'Архитектурный созвон', category: 'Работа', priority: 'High', dueDate: '2026-09-10', completed: true },
  { id: 't-hist-14', title: 'Тестирование релиза', category: 'Работа', priority: 'Urgent', dueDate: '2026-09-10', completed: true },
  { id: 't-hist-15', title: 'Проверка почты', category: 'Дом', priority: 'Low', dueDate: '2026-09-11', completed: true },
  { id: 't-hist-16', title: 'Деплой сервиса', category: 'Работа', priority: 'High', dueDate: '2026-09-12', completed: true },
  { id: 't-hist-17', title: 'Тесты производительности', category: 'Работа', priority: 'Medium', dueDate: '2026-09-12', completed: true },
  { id: 't-hist-18', title: 'Спринт демо', category: 'Работа', priority: 'High', dueDate: '2026-09-12', completed: true },
  { id: 't-hist-19', title: 'Настройка мониторинга', category: 'Работа', priority: 'High', dueDate: '2026-09-14', completed: true },
  { id: 't-hist-20', title: 'Оптимизация запросов', category: 'Работа', priority: 'Medium', dueDate: '2026-09-14', completed: true },
  { id: 't-hist-21', title: 'Рефакторинг стора', category: 'Работа', priority: 'High', dueDate: '2026-09-14', completed: true },
  { id: 't-hist-22', title: 'План на квартал', category: 'Работа', priority: 'High', dueDate: '2026-09-17', completed: true },
  { id: 't-hist-23', title: 'Обновление зависимостей', category: 'Работа', priority: 'Low', dueDate: '2026-09-17', completed: true },
  { id: 't-hist-24', title: 'Подготовка релиза', category: 'Работа', priority: 'High', dueDate: '2026-09-17', completed: true },
  { id: 't-hist-25', title: 'Написание тестов', category: 'Работа', priority: 'Medium', dueDate: '2026-09-19', completed: true },
  { id: 't-hist-26', title: 'Аудит безопасности', category: 'Работа', priority: 'High', dueDate: '2026-09-19', completed: true },
  { id: 't-hist-27', title: 'Сборка артефактов', category: 'Работа', priority: 'High', dueDate: '2026-09-19', completed: true },
  { id: 't-hist-28', title: 'Финальный релиз', category: 'Работа', priority: 'Urgent', dueDate: '2026-09-21', completed: true },
  { id: 't-hist-29', title: 'Пост-релизный чекап', category: 'Работа', priority: 'High', dueDate: '2026-09-21', completed: true },
  // Active pending tasks
  { id: 't-1', title: 'Сдать отчёт по проекту', notes: 'Финальная версия с правками', category: 'Работа', priority: 'Urgent', dueDate: '2026-09-21', completed: false },
  { id: 't-2', title: 'Тренировка в зале', category: 'Здоровье', priority: 'High', dueDate: '2026-09-22', completed: false },
  { id: 't-3', title: 'Позвонить в банк', notes: 'Уточнить условия по вкладу', category: 'Финансы', priority: 'High', dueDate: '2026-09-22', completed: false },
  { id: 't-4', title: 'Купить продукты на неделю', category: 'Дом', priority: 'Medium', dueDate: '2026-09-23', completed: false },
  { id: 't-5', title: 'Подготовить презентацию', notes: '12 слайдов для команды', category: 'Работа', priority: 'High', dueDate: '2026-09-25', completed: false },
  { id: 't-6', title: 'Прочитать главу курса', category: 'Учёба', priority: 'Low', dueDate: '2026-09-28', completed: false }
]

const DEFAULT_FINANCES: FinanceState = {
  transactions: [
    // Friday spending anomalies: Sept 4, Sept 11, Sept 18
    { id: 'tx-f-1', type: 'expense', amount: 3600, category: 'Еда и рестораны', date: '2026-09-04', note: 'Пятничный ужин' },
    { id: 'tx-f-2', type: 'expense', amount: 1400, category: 'Развлечения', date: '2026-09-04', note: 'Кино с друзьями' },
    { id: 'tx-f-3', type: 'expense', amount: 4200, category: 'Еда и рестораны', date: '2026-09-11', note: 'Пятничные посиделки' },
    { id: 'tx-f-4', type: 'expense', amount: 3800, category: 'Еда и рестораны', date: '2026-09-18', note: 'Доставка и бар' },
    // Regular days
    { id: 'tx-1', type: 'income', amount: 3000, category: 'Подарок', date: '2026-09-20', note: 'Володя' },
    { id: 'tx-2', type: 'income', amount: 5000, category: 'Подарок', date: '2026-09-20', note: 'Бабуля Ира' },
    { id: 'tx-3', type: 'income', amount: 5000, category: 'Подарок', date: '2026-09-20', note: 'Тётя Света' },
    { id: 'tx-4', type: 'expense', amount: 400, category: 'Еда', date: '2026-09-20', note: 'Доставка' },
    { id: 'tx-5', type: 'expense', amount: 1300, category: 'Развлечения', date: '2026-09-20', note: 'Игра' },
    { id: 'tx-6', type: 'income', amount: 22000, category: 'Зарплата', date: '2026-09-15', note: 'Аванс' },
    { id: 'tx-7', type: 'expense', amount: 2100, category: 'Еда', date: '2026-09-14', note: 'Супермаркет' },
    { id: 'tx-8', type: 'expense', amount: 1500, category: 'Транспорт', date: '2026-09-10', note: 'Бензин' }
  ],
  subscriptions: [
    { id: 'sub-1', name: 'Яндекс Плюс', cost: 299, cycle: 'monthly', billingDay: 15, icon: '🎵' },
    { id: 'sub-2', name: 'VPN Сервис', cost: 450, cycle: 'monthly', billingDay: 20, icon: '🛡️' },
    { id: 'sub-3', name: 'Telegram Premium', cost: 299, cycle: 'monthly', billingDay: 1, icon: '⭐' }
  ]
}

const DEFAULT_CHECKINS: DailyCheckIn[] = [
  { date: '2026-09-01', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-02', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-03', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-04', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-05', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-06', mood: 3, energy: 3, updatedAt: 1726000000000 },
  { date: '2026-09-07', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-08', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-09', mood: 3, energy: 3, updatedAt: 1726000000000 },
  { date: '2026-09-10', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-11', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-12', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-13', mood: 3, energy: 3, updatedAt: 1726000000000 },
  { date: '2026-09-14', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-15', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-16', mood: 3, energy: 3, updatedAt: 1726000000000 },
  { date: '2026-09-17', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-18', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-19', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-20', mood: 4, energy: 4, updatedAt: 1726000000000 },
  { date: '2026-09-21', mood: 5, energy: 5, updatedAt: 1726000000000 },
  { date: '2026-09-22', mood: 4, energy: 4, updatedAt: 1726000000000 }
]

const AI_TASK_BANK: Record<string, string[]> = {
  'Здоровье': [
    'Выпить стакан воды с лимоном натощак',
    'Сделать 15-минутную разминку для шеи и спины',
    'Прогулка на свежем воздухе не менее 30 минут',
    'Проветрить комнату перед сном',
    'Контрастный душ утром'
  ],
  'Спорт': [
    'Сделать 30 отжиманий за день',
    'Планка 2 минуты (2 подхода по 1 мин)',
    'Растяжка всех групп мышц 10 минут',
    'Лестница вместо лифта сегодня',
    '10 000 шагов за день'
  ],
  'Саморазвитие': [
    'Прочитать 15 страниц развивающей книги',
    'Выучить 5 новых иностранных слов',
    'Посмотреть образовательное видео по профессии',
    'Записать 3 мысли или инсайта дня в дневник',
    '10 минут осознанной медитации'
  ],
  'Работа': [
    'Выделить 90 минут на главную задачу дня без уведомлений',
    'Разобрать входящие сообщения и почту до нуля',
    'Составить план спринта на завтра',
    'Закрыть все ненужные вкладки в браузере',
    'Сделать ревью выполненных задач'
  ],
  'Финансы': [
    'Внести все расходы за последние 3 дня',
    'Проверить активные подписки и отменить ненужные',
    'Отложить 10% от последнего дохода в накопления',
    'Составить список покупок перед походом в магазин',
    'Проверить баланс всех счетов'
  ],
  'Дом': [
    'Навести порядок на рабочем столе',
    'Полить домашние растения',
    'Выбросить 3 ненужные вещи',
    'Влажная уборка в комнате',
    'Приготовить здоровый ужин дома'
  ]
}

export interface HabitContextType {
  // State
  habits: Habit[]
  tasks: Task[]
  finances: FinanceState
  prefs: UserPrefs
  activeTab: 'habits' | 'tasks' | 'finance' | 'insights' | 'developer' | 'profile'
  setActiveTab: (tab: 'habits' | 'tasks' | 'finance' | 'insights' | 'developer' | 'profile') => void

  // Cross-Module Insights & Coach Ogonyok
  checkIns: DailyCheckIn[]
  addDailyCheckIn: (checkIn: Omit<DailyCheckIn, 'updatedAt'>) => void
  insightsResult: InsightsResult
  ogonyokState: OgonyokCompactState
  proactiveAdvice: ProactiveAdvice | null
  refreshProactiveAdvice: () => void
  discussInsightInChat: (insight: CrossModuleInsight) => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (open: boolean) => void
  isAddIncomeOpen: boolean
  setIsAddIncomeOpen: (open: boolean) => void
  isAddExpenseOpen: boolean
  setIsAddExpenseOpen: (open: boolean) => void
  isAddHabitOpen: boolean
  setIsAddHabitOpen: (open: boolean) => void
  isAddTaskOpen: boolean
  setIsAddTaskOpen: (open: boolean) => void
  isAddSubOpen: boolean
  setIsAddSubOpen: (open: boolean) => void

  // Auth & Cloud Sync
  currentUser: AuthUser | null
  firebaseConfig: FirebaseConfig | null
  lastSyncTime: string | null
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  registerWithEmail: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logoutUser: () => Promise<void>
  saveFirebaseConfig: (config: FirebaseConfig) => void
  syncCloudData: (mode: 'push' | 'pull') => Promise<boolean>

  // Developer Mode & Time Travel
  isDevModeUnlocked: boolean
  isDevPasscodeModalOpen: boolean
  setIsDevPasscodeModalOpen: (open: boolean) => void
  unlockDevMode: (code: string) => boolean
  lockDevMode: () => void
  virtualDateOffsetDays: number
  shiftVirtualDays: (days: number) => void
  resetVirtualTime: () => void
  setVirtualDateString: (dateStr: string) => void
  getSimulatedNow: () => Date
  generateDemoData: () => void
  wipeAllDevData: () => boolean
  importStateJson: (jsonStr: string) => boolean

  // AI Assistant
  isAiDrawerOpen: boolean
  setIsAiDrawerOpen: (open: boolean) => void
  aiMessages: AiMessage[]
  sendAiMessage: (text: string) => void
  isAiThinking: boolean
  aiSettings: AiSettings
  updateAiSettings: (settings: Partial<AiSettings>) => void
  generateAiTask: () => void

  // Gamification (Account-bound, cloud stored)
  gamification: GamificationState | null
  earnXp: (amount: number, reason: string) => void
  checkAndUpdateStreak: () => void

  // Onboarding Tour
  isTourOpen: boolean
  setIsTourOpen: (open: boolean) => void
  tourStep: number
  setTourStep: (step: number) => void

  // Habits actions
  toggleHabitDay: (habitId: string, day: number) => void
  addHabit: (habit: Omit<Habit, 'id' | 'checks'>) => void
  deleteHabit: (habitId: string) => void
  // Tasks actions
  toggleTask: (taskId: string) => void
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  deleteTask: (taskId: string) => void
  // Finance actions
  addTransaction: (txn: Omit<Transaction, 'id'>) => void
  deleteTransaction: (txnId: string) => void
  addSubscription: (sub: Omit<Subscription, 'id'>) => void
  deleteSubscription: (subId: string) => void

  // Email verification (future foundation)
  isEmailVerificationEnabled: boolean
  sendEmailVerificationCode: (email: string) => Promise<{ success: boolean; devCode?: string }>
  verifyEmailCode: (email: string, code: string) => Promise<boolean>
  // Settings actions
  updatePrefs: (newPrefs: Partial<UserPrefs>) => void
  clearAllData: () => void
  exportBackup: () => void
  importBackup: (jsonData: string) => boolean
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'habits' | 'tasks' | 'finance' | 'insights' | 'developer' | 'profile'>('habits')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isAddSubOpen, setIsAddSubOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDevPasscodeModalOpen, setIsDevPasscodeModalOpen] = useState(false)
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  // Virtual date offset in days (for developer time-travel)
  const [virtualDateOffsetDays, setVirtualDateOffsetDays] = useState(0)

  // Auth User: default to null (account required for gamification/streak)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Firebase Config
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FB_CONFIG)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Developer Mode
  const [isDevModeUnlocked, setIsDevModeUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEV_MODE) === 'true'
    } catch {
      return false
    }
  })

  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // AI Messages
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'ai-init',
      text: 'Привет! 👋 Я ваш AI-ассистент. Анализирую привычки, задачи и бюджет. Могу предложить персональные задачи для роста! Чем помочь?',
      sender: 'bot',
      timestamp: '12:00'
    }
  ])

  // AI Settings (Gemini 3.5 Flash-Lite)
  const [aiSettings, setAiSettings] = useState<AiSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_AI_SETTINGS,
          ...parsed,
          provider: 'gemini',
          model: parsed.model || DEFAULT_AI_SETTINGS.model,
          apiKey: DEFAULT_AI_SETTINGS.apiKey
        }
      }
      return DEFAULT_AI_SETTINGS
    } catch {
      return DEFAULT_AI_SETTINGS
    }
  })

  // Gamification State (Cloud bound, NOT persisted in LocalStorage for guests)
  const [gamification, setGamification] = useState<GamificationState | null>(null)

  // 1. Prefs
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS
    } catch {
      return DEFAULT_PREFS
    }
  })

  // 2. Habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS)
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HABITS
    } catch {
      return DEFAULT_HABITS
    }
  })

  // 3. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS)
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TASKS
    } catch {
      return DEFAULT_TASKS
    }
  })

  // 4. Finances
  const [finances, setFinances] = useState<FinanceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FINANCE)
      const parsed = saved ? JSON.parse(saved) : null
      return parsed && parsed.transactions ? parsed : DEFAULT_FINANCES
    } catch {
      return DEFAULT_FINANCES
    }
  })

  // ═══════════════════════════════════════════
  // PERSISTENCE (EXCLUDING GUEST GAMIFICATION)
  // ═══════════════════════════════════════════

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(prefs)) }, [prefs])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(finances)) }, [finances])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(aiSettings)) }, [aiSettings])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    }
  }, [currentUser])

  useEffect(() => {
    if (firebaseConfig) {
      localStorage.setItem(STORAGE_KEYS.FB_CONFIG, JSON.stringify(firebaseConfig))
    }
  }, [firebaseConfig])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEV_MODE, isDevModeUnlocked ? 'true' : 'false')
  }, [isDevModeUnlocked])

  // ═══════════════════════════════════════════
  // VIRTUAL TIME
  // ═══════════════════════════════════════════

  const getSimulatedNow = () => {
    const d = new Date(2026, prefs.selectedMonth, 22)
    d.setDate(d.getDate() + virtualDateOffsetDays)
    return d
  }

  const shiftVirtualDays = (days: number) => {
    setVirtualDateOffsetDays(prev => prev + days)
  }

  const resetVirtualTime = () => {
    setVirtualDateOffsetDays(0)
  }

  const setVirtualDateString = (dateStr: string) => {
    const parts = dateStr.split('-').map(Number)
    if (parts.length === 3) {
      const target = new Date(parts[0], parts[1] - 1, parts[2])
      const base = new Date(2026, prefs.selectedMonth, 22)
      const diffDays = Math.round((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24))
      setVirtualDateOffsetDays(diffDays)
    }
  }

  // ───────────────────────────────────────────────
  // Milestone 1: Daily Check-Ins & Insights Engine
  // ───────────────────────────────────────────────

  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS)
      return saved ? JSON.parse(saved) : DEFAULT_CHECKINS
    } catch {
      return DEFAULT_CHECKINS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns))
    } catch {}
  }, [checkIns])

  const addDailyCheckIn = (data: Omit<DailyCheckIn, 'updatedAt'>) => {
    const entry: DailyCheckIn = {
      ...data,
      updatedAt: Date.now()
    }
    setCheckIns(prev => {
      const filtered = prev.filter(c => c.date !== data.date)
      return [entry, ...filtered]
    })
  }

  // Cross-Module Insights evaluation
  const insightsResult: InsightsResult = useMemo(() => {
    return computeCrossModuleInsights(habits, tasks, finances.transactions, checkIns)
  }, [habits, tasks, finances.transactions, checkIns])

  // Data-Aware Coach Ogonyok compact telemetry (< 400 tokens)
  const ogonyokState: OgonyokCompactState = useMemo(() => {
    const todayStr = getSimulatedNow().toISOString().split('T')[0]
    return buildOgonyokCompactState(
      habits,
      tasks,
      finances,
      gamification || getInitialGamification(todayStr),
      checkIns,
      insightsResult.insights,
      getSimulatedNow()
    )
  }, [habits, tasks, finances, gamification, checkIns, insightsResult.insights, virtualDateOffsetDays])

  // Daily proactive message from Ogonyok
  const [proactiveAdvice, setProactiveAdvice] = useState<ProactiveAdvice | null>(() => {
    const todayStr = getSimulatedNow().toISOString().split('T')[0]
    const fallbackOgonyok = buildOgonyokCompactState(
      habits,
      tasks,
      finances,
      gamification || getInitialGamification(todayStr),
      checkIns,
      insightsResult.insights,
      getSimulatedNow()
    )
    return getOrGenerateProactiveDailyMessage(fallbackOgonyok, insightsResult.insights, getSimulatedNow())
  })

  useEffect(() => {
    const advice = getOrGenerateProactiveDailyMessage(ogonyokState, insightsResult.insights, getSimulatedNow())
    setProactiveAdvice(advice)
  }, [ogonyokState, insightsResult.insights])

  const refreshProactiveAdvice = () => {
    const advice = getOrGenerateProactiveDailyMessage(ogonyokState, insightsResult.insights, getSimulatedNow())
    setProactiveAdvice(advice)
  }

  const discussInsightInChat = (insight: CrossModuleInsight) => {
    setIsAiDrawerOpen(true)
    const prompt = `Привет! Расскажи подробнее про выявленный инсайт: «${insight.claim}». Что мне предпринять сегодня?`
    sendAiMessage(prompt)
  }

  // ═══════════════════════════════════════════
  // FIREBASE AUTH & REAL-TIME STATE LISTENER
  // ═══════════════════════════════════════════

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userObj: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Пользователь',
          photoURL: fbUser.photoURL || undefined,
          isGuest: false
        }
        setCurrentUser(userObj)
        setPrefs(prev => ({
          ...prev,
          userName: userObj.displayName || prev.userName,
          userTag: (userObj.displayName || 'US').slice(0, 2).toUpperCase()
        }))

        const todayStr = getSimulatedNow().toISOString().split('T')[0]
        const cloudData = await loadFullUserData(fbUser.uid, todayStr)
        if (cloudData) {
          if (cloudData.habits && cloudData.habits.length > 0) setHabits(cloudData.habits)
          if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks)
          if (cloudData.finances) setFinances(cloudData.finances)
          if (cloudData.prefs) setPrefs(prev => ({ ...prev, ...cloudData.prefs }))

          // Load gamification and check streak immediately on login
          const loadedGamification = cloudData.gamification || getInitialGamification(todayStr)
          const lastDate = new Date(loadedGamification.lastActiveDate)
          const todayDate = new Date(todayStr)
          const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

          if (loadedGamification.lastActiveDate !== todayStr) {
            let newStreak = loadedGamification.streakDays
            if (diffDays === 1) {
              newStreak += 1
            } else if (diffDays > 1) {
              newStreak = 1
            }
            const maxStreak = Math.max(loadedGamification.maxStreak || 1, newStreak)
            const updatedGam = { ...loadedGamification, streakDays: newStreak, maxStreak, lastActiveDate: todayStr }
            setGamification(updatedGam)
            saveCloudGamification(fbUser.uid, updatedGam).catch(() => {})
          } else {
            setGamification(loadedGamification)
          }
        } else {
          // If first time or empty, save current state to user's cloud account
          const freshGamification = getInitialGamification(todayStr)
          setGamification(freshGamification)
          await saveFullUserData(fbUser.uid, {
            habits,
            tasks,
            finances,
            gamification: freshGamification,
            prefs,
            updatedAt: new Date().toISOString()
          })
        }
        setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
      } else {
        setCurrentUser(null)
        setGamification(null)
      }
    })

    return () => unsubscribe()
  }, [virtualDateOffsetDays])

  // Auto-sync full state to Firebase cloud whenever user makes changes
  useEffect(() => {
    if (!currentUser || currentUser.isGuest) return

    const timer = setTimeout(() => {
      const todayStr = getSimulatedNow().toISOString().split('T')[0]
      saveFullUserData(currentUser.uid, {
        habits,
        tasks,
        finances,
        gamification: gamification || getInitialGamification(todayStr),
        prefs,
        updatedAt: new Date().toISOString()
      }).then(ok => {
        if (ok) {
          setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
        }
      }).catch(err => {
        console.warn('Auto cloud sync failed:', err)
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [habits, tasks, finances, gamification, prefs, currentUser])

  // ═══════════════════════════════════════════
  // GAMIFICATION (ACCOUNT-BOUND)
  // ═══════════════════════════════════════════

  const earnXp = (amount: number, reason: string) => {
    if (!currentUser || !gamification) {
      // Feature is locked without account
      return
    }

    const newXp = gamification.xp + amount
    let newLevel = gamification.level
    let remainingXp = newXp

    // Level up check
    while (remainingXp >= newLevel * 150) {
      remainingXp -= newLevel * 150
      newLevel++
    }

    const event: XpEvent = {
      id: `xp-${Date.now()}`,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    }

    const updatedGamification: GamificationState = {
      ...gamification,
      xp: newXp,
      level: newLevel,
      xpHistory: [event, ...gamification.xpHistory.slice(0, 49)],
    }

    const { updatedGamification: evaluated } = evaluateAchievements(
      updatedGamification,
      habits,
      tasks,
      finances
    )

    setGamification(evaluated)
    // Save directly to Firebase
    saveCloudGamification(currentUser.uid, evaluated).catch(() => {})
  }

  const checkAndUpdateStreak = () => {
    if (!currentUser || !gamification) return

    const todayStr = getSimulatedNow().toISOString().split('T')[0]
    if (gamification.lastActiveDate === todayStr) return

    const lastDate = new Date(gamification.lastActiveDate)
    const todayDate = new Date(todayStr)
    const diffMs = todayDate.getTime() - lastDate.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    let newStreak = gamification.streakDays
    if (diffDays === 1) {
      newStreak += 1
    } else if (diffDays > 1) {
      newStreak = 1
    }

    const maxStreak = Math.max(gamification.maxStreak || 1, newStreak)

    const updated: GamificationState = {
      ...gamification,
      streakDays: newStreak,
      maxStreak,
      lastActiveDate: todayStr,
    }

    const { updatedGamification: evaluated } = evaluateAchievements(
      updated,
      habits,
      tasks,
      finances
    )

    setGamification(evaluated)
    saveCloudGamification(currentUser.uid, evaluated).catch(() => {})
  }

  // ═══════════════════════════════════════════
  // AUTH METHODS (FIREBASE BACKEND)
  // ═══════════════════════════════════════════

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass)
      const user = cred.user
      const displayName = user.displayName || email.split('@')[0]
      const userObj: AuthUser = {
        uid: user.uid,
        email: user.email || email,
        displayName,
        photoURL: user.photoURL || undefined,
        isGuest: false
      }
      setCurrentUser(userObj)
      setPrefs(prev => ({
        ...prev,
        userName: displayName,
        userTag: displayName.slice(0, 2).toUpperCase()
      }))

      const todayStr = getSimulatedNow().toISOString().split('T')[0]
      const cloudData = await loadFullUserData(user.uid, todayStr)
      if (cloudData) {
        if (cloudData.habits && cloudData.habits.length > 0) setHabits(cloudData.habits)
        if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks)
        if (cloudData.finances) setFinances(cloudData.finances)
        if (cloudData.gamification) setGamification(cloudData.gamification)
        if (cloudData.prefs) setPrefs(prev => ({ ...prev, ...cloudData.prefs }))
      } else {
        const freshGamification = getInitialGamification(todayStr)
        setGamification(freshGamification)
        await saveFullUserData(user.uid, {
          habits,
          tasks,
          finances,
          gamification: freshGamification,
          prefs,
          updatedAt: new Date().toISOString()
        })
      }
      setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: translateFirebaseError(err) }
    }
  }

  const registerWithEmail = async (email: string, pass: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      const user = cred.user
      const displayName = name || email.split('@')[0]

      if (displayName) {
        try {
          await updateProfile(user, { displayName })
        } catch {}
      }

      const userObj: AuthUser = {
        uid: user.uid,
        email: user.email || email,
        displayName,
        isGuest: false
      }
      setCurrentUser(userObj)
      setPrefs(prev => ({
        ...prev,
        userName: displayName,
        userTag: displayName.slice(0, 2).toUpperCase()
      }))

      const todayStr = getSimulatedNow().toISOString().split('T')[0]
      const freshGamification = getInitialGamification(todayStr)
      setGamification(freshGamification)

      await saveFullUserData(user.uid, {
        habits,
        tasks,
        finances,
        gamification: freshGamification,
        prefs,
        updatedAt: new Date().toISOString()
      })

      setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: translateFirebaseError(err) }
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const user = cred.user
      const displayName = user.displayName || user.email?.split('@')[0] || 'Пользователь'

      const userObj: AuthUser = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        photoURL: user.photoURL || undefined,
        isGuest: false
      }
      setCurrentUser(userObj)
      setPrefs(prev => ({
        ...prev,
        userName: displayName,
        userTag: displayName.slice(0, 2).toUpperCase()
      }))

      const todayStr = getSimulatedNow().toISOString().split('T')[0]
      const cloudData = await loadFullUserData(user.uid, todayStr)
      if (cloudData) {
        if (cloudData.habits && cloudData.habits.length > 0) setHabits(cloudData.habits)
        if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks)
        if (cloudData.finances) setFinances(cloudData.finances)
        if (cloudData.gamification) setGamification(cloudData.gamification)
        if (cloudData.prefs) setPrefs(prev => ({ ...prev, ...cloudData.prefs }))
      } else {
        const freshGamification = getInitialGamification(todayStr)
        setGamification(freshGamification)
        await saveFullUserData(user.uid, {
          habits,
          tasks,
          finances,
          gamification: freshGamification,
          prefs,
          updatedAt: new Date().toISOString()
        })
      }
      setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: translateFirebaseError(err) }
    }
  }

  const logoutUser = async (): Promise<void> => {
    try {
      await signOut(auth)
    } catch {}
    setCurrentUser(null)
    setGamification(null)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    setPrefs(prev => ({ ...prev, userName: 'Гость', userTag: 'GS' }))
    setIsAuthModalOpen(false)
  }

  const saveFirebaseConfig = (config: FirebaseConfig) => {
    setFirebaseConfig(config)
  }

  const syncCloudData = async (mode: 'push' | 'pull'): Promise<boolean> => {
    if (!currentUser || currentUser.isGuest) return false
    const todayStr = getSimulatedNow().toISOString().split('T')[0]
    if (mode === 'pull') {
      const cloudData = await loadFullUserData(currentUser.uid, todayStr)
      if (cloudData) {
        if (cloudData.habits && cloudData.habits.length > 0) setHabits(cloudData.habits)
        if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks)
        if (cloudData.finances) setFinances(cloudData.finances)
        if (cloudData.gamification) setGamification(cloudData.gamification)
        if (cloudData.prefs) setPrefs(prev => ({ ...prev, ...cloudData.prefs }))
        if (cloudData.checkIns && cloudData.checkIns.length > 0) setCheckIns(cloudData.checkIns)
        setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        return true
      }
      return false
    } else {
      const ok = await saveFullUserData(currentUser.uid, {
        habits,
        tasks,
        finances,
        gamification: gamification || getInitialGamification(todayStr),
        prefs,
        checkIns,
        updatedAt: new Date().toISOString()
      })
      if (ok) {
        setLastSyncTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      }
      return ok
    }
  }

  // ═══════════════════════════════════════════
  // AI
  // ═══════════════════════════════════════════

  const updateAiSettings = (newSettings: Partial<AiSettings>) => {
    setAiSettings(prev => ({ ...prev, ...newSettings }))
  }

  const generateAiTask = () => {
    const categories = Object.keys(AI_TASK_BANK) as (keyof typeof AI_TASK_BANK)[]
    const habitCategories = habits.map(h => h.category)

    let selectedCategory = categories[Math.floor(Math.random() * categories.length)]
    for (const cat of categories) {
      if (habitCategories.some(hc => hc.toLowerCase().includes(cat.toLowerCase()))) {
        if (Math.random() > 0.4) {
          selectedCategory = cat
          break
        }
      }
    }

    const taskPool = AI_TASK_BANK[selectedCategory]
    // Pick a random task, avoid duplicates (try up to 5 times)
    let taskTitle = taskPool[Math.floor(Math.random() * taskPool.length)]
    for (let attempt = 0; attempt < 5; attempt++) {
      if (!tasks.some(t => t.title === taskTitle)) break
      taskTitle = taskPool[Math.floor(Math.random() * taskPool.length)]
    }
    // If all are duplicates, abort
    if (tasks.some(t => t.title === taskTitle)) return

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dueDate = tomorrow.toISOString().split('T')[0]

    const newTask: Task = {
      id: `t-ai-${Date.now()}`,
      title: taskTitle,
      notes: `🤖 Предложено AI · ${selectedCategory}`,
      category: selectedCategory,
      priority: 'Medium',
      dueDate,
      completed: false,
      aiGenerated: true,
    }

    setTasks(prev => [newTask, ...prev])

    // Award +30 XP for using the AI task generator (account-bound)
    earnXp(30, 'AI сгенерировал задачу')

    const botMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      text: `✨ Я добавил новую задачу: «${taskTitle}». Выполните её, чтобы получить +20 XP! (Уже зачислено +30 XP за использование AI 🎉)`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
    setAiMessages(prev => [...prev, botMsg])
  }

  const sendAiMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
    setAiMessages(prev => [...prev, userMsg])
    setIsAiThinking(true)

    const query = text.toLowerCase()

    if (query.includes('задач') && (query.includes('предлож') || query.includes('генер') || query.includes('создай') || query.includes('придум'))) {
      setTimeout(() => {
        generateAiTask()
        setIsAiThinking(false)
      }, 700)
      return
    }

    try {
      const inc = finances.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const exp = finances.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

      const history = aiMessages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text
      }))

      const ogonyokSysPrompt = buildOgonyokSystemPrompt(ogonyokState)

      const result = await generateGeminiResponse(
        text,
        {
          habitsCount: habits.length,
          streakDays: gamification?.streakDays || 0,
          level: gamification?.level || 1,
          xp: gamification?.xp || 0,
          pendingTasksCount: tasks.filter(t => !t.completed).length,
          balance: inc - exp
        },
        history,
        aiSettings.model,
        ogonyokSysPrompt
      )

      let replyText = cleanAiResponse(result.text)
      if (result.fallbackOccurred && result.modelUsed) {
        replyText += `\n\n⚡ _(Отвечено через резервную модель ${result.modelUsed}, так как выбранная была временно перегружена)_`
      }

      const botMsg: AiMessage = {
        id: `msg-${Date.now() + 1}`,
        text: replyText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
      setAiMessages(prev => [...prev, botMsg])
    } catch (geminiError: unknown) {
      console.warn('[Gemini 3.5 Flash-Lite] Request error:', geminiError)

      // Add brief realistic thinking delay before replying
      await new Promise(r => setTimeout(r, 600))

      const errString = String((geminiError as any)?.message || geminiError).toLowerCase()
      const isRateLimit = errString.includes('429') || errString.includes('quota') || errString.includes('исчерпан') || errString.includes('rate limit')
      const isOverloaded = errString.includes('503') || errString.includes('high demand') || errString.includes('unavailable') || errString.includes('нагрузка')
      const isGeoBlocked = errString.includes('403') || errString.includes('vpn') || errString.includes('net:') || errString.includes('failed to fetch') || errString.includes('network') || errString.includes('load resource')

      let fallbackNotice = ''
      if (isRateLimit) {
        fallbackNotice = '⚠️ Лимит запросов бесплатного тарифа Gemini временно исчерпан (ошибка 429: Rate Limit). Подождите ~20 секунд и отправьте сообщение снова.'
      } else if (isOverloaded) {
        fallbackNotice = '⚠️ Сервера Google Gemini сейчас перегружены (ошибка 503: High Demand на стороне Google). Подождите 10–15 секунд и напишите снова.'
      } else if (isGeoBlocked) {
        fallbackNotice = '⚠️ Gemini недоступен: включите VPN (Google API блокирует прямые запросы из РФ) или напишите чуть позже.'
      } else {
        fallbackNotice = '⚠️ Gemini сейчас временно недоступен. Напишите чуть позже или включите VPN для стабильного подключения к Google API.'
      }

      let botResponse = ''

      // Specific integration mentions
      if (query.includes('@yt') || query.includes('@youtube')) {
        const cleanTopic = text.replace(/@yt|@youtube/gi, '').trim() || 'утренние привычки и продуктивность'
        botResponse = `${fallbackNotice}\n\n🎥 @yt Карточка YouTube с подборкой видео по теме «${cleanTopic}» сформирована и доступна ниже!`
      } else if (query.includes('@google')) {
        const cleanQuery = text.replace(/@google/gi, '').trim() || 'психология привычек и дофамин'
        botResponse = `${fallbackNotice}\n\n🔍 @google Карточка поиска по теме «${cleanQuery}» подготовлена ниже.`
      } else if (query.includes('@notion')) {
        botResponse = `${fallbackNotice}\n\n📝 @notion Шаблон трекера недели в стиле Notion готов! Скопируйте Markdown по кнопке ниже.`
      } else if (query.includes('кто ты') || query.includes('что ты') || query.includes('ты кто')) {
        botResponse = `Привет! 👋 Я — AI-ассистент HabitSpace на базе Gemini 3.5 Flash-Lite.\n\n${fallbackNotice}\n\nКак только связь с сервером наладится, я смогу вести с вами полноценный умный диалог и анализировать ваши привычки.`
      } else if (query.includes('@habits') || query.includes('привычк') || query.includes('дисциплин') || query.includes('стрик')) {
        const streakInfo = gamification && gamification.streakDays > 0 ? ` Ваш стрик: ${gamification.streakDays} дн. 🔥` : ''
        botResponse = `${fallbackNotice}\n\n📊 @habits По локальным данным у вас ${habits.length} активных привычек.${streakInfo}`
      } else if (query.includes('@tasks') || query.includes('задач') || query.includes('дедлайн') || query.includes('дел')) {
        const activeTasks = tasks.filter(t => !t.completed)
        botResponse = `${fallbackNotice}\n\n📋 @tasks У вас ${activeTasks.length} незавершенных задач. Выполняйте их для получения XP!`
      } else if (query.includes('@finance') || query.includes('финанс') || query.includes('деньг') || query.includes('бюджет')) {
        const inc = finances.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        const exp = finances.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        botResponse = `${fallbackNotice}\n\n💰 @finance Баланс месяца: +₽${(inc - exp).toLocaleString('ru-RU')}.`
      } else {
        botResponse = `${fallbackNotice}\n\n💡 Попробуйте отправить сообщение ещё раз через пару секунд или воспользуйтесь быстрыми командами @yt, @google, @notion или кнопкой «Сгенерировать задачу».`
      }

      const botMsg: AiMessage = {
        id: `msg-${Date.now() + 1}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
      setAiMessages(prev => [...prev, botMsg])
    } finally {
      setIsAiThinking(false)
    }
  }

  // ═══════════════════════════════════════════
  // HABIT ACTIONS
  // ═══════════════════════════════════════════

  const toggleHabitDay = (habitId: string, day: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(12) } catch {}
    }

    const monthKey = `${prefs.selectedYear}-${prefs.selectedMonth}`
    let wasChecked = false

    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h
      const currentChecks = h.checks[monthKey] || []
      const isChecked = currentChecks.includes(day)
      wasChecked = isChecked
      const newChecks = isChecked
        ? currentChecks.filter(d => d !== day)
        : [...currentChecks, day]
      return {
        ...h,
        checks: { ...h.checks, [monthKey]: newChecks }
      }
    }))

    // XP for checking a habit (only for authenticated account)
    if (!wasChecked) {
      earnXp(10, 'Отметка привычки')

      setTimeout(() => {
        const allDone = habits.every(h => {
          const checks = h.checks[monthKey] || []
          return h.id === habitId ? true : checks.includes(day)
        })
        if (allDone && habits.length > 1) {
          earnXp(50, 'Все привычки за день!')
        }
      }, 50)
    }
  }

  const addHabit = (habitData: Omit<Habit, 'id' | 'checks'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      checks: {}
    }
    setHabits(prev => [...prev, newHabit])
  }

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }

  // ═══════════════════════════════════════════
  // TASK ACTIONS
  // ═══════════════════════════════════════════

  const toggleTask = (taskId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(15) } catch {}
    }

    let completedNow = false
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      completedNow = !t.completed
      return { ...t, completed: completedNow }
    }))

    if (completedNow) {
      earnXp(20, 'Выполнение задачи')
    }
  }

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      completed: false
    }
    setTasks(prev => [newTask, ...prev])
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  // ═══════════════════════════════════════════
  // FINANCE ACTIONS
  // ═══════════════════════════════════════════

  const addTransaction = (txnData: Omit<Transaction, 'id'>) => {
    const newTxn: Transaction = {
      ...txnData,
      id: `tx-${Date.now()}`
    }
    setFinances(prev => {
      const next = {
        ...prev,
        transactions: [newTxn, ...prev.transactions]
      }
      if (currentUser && gamification) {
        const { updatedGamification } = evaluateAchievements(gamification, habits, tasks, next)
        setGamification(updatedGamification)
        saveCloudGamification(currentUser.uid, updatedGamification).catch(() => {})
      }
      return next
    })
  }

  const deleteTransaction = (txnId: string) => {
    setFinances(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== txnId)
    }))
  }

  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`
    }
    setFinances(prev => {
      const next = {
        ...prev,
        subscriptions: [...prev.subscriptions, newSub]
      }
      if (currentUser && gamification) {
        const { updatedGamification } = evaluateAchievements(gamification, habits, tasks, next)
        setGamification(updatedGamification)
        saveCloudGamification(currentUser.uid, updatedGamification).catch(() => {})
      }
      return next
    })
  }

  const deleteSubscription = (subId: string) => {
    setFinances(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.filter(s => s.id !== subId)
    }))
  }

  // ═══════════════════════════════════════════
  // EMAIL VERIFICATION
  // ═══════════════════════════════════════════

  const isEmailVerificationEnabled = false

  const sendEmailVerificationCode = async (_email: string): Promise<{ success: boolean; devCode?: string }> => {
    return { success: true, devCode: '123456' }
  }

  const verifyEmailCode = async (_email: string, code: string): Promise<boolean> => {
    return code === '123456'
  }

  // ═══════════════════════════════════════════
  // SETTINGS & BACKUP ACTIONS
  // ═══════════════════════════════════════════

  const updatePrefs = (newPrefs: Partial<UserPrefs>) => {
    setPrefs(prev => ({ ...prev, ...newPrefs }))
  }

  const clearAllData = () => {
    setHabits([])
    setTasks([])
    setFinances({ transactions: [], subscriptions: [] })
    setGamification(null)
    localStorage.removeItem(STORAGE_KEYS.HABITS)
    localStorage.removeItem(STORAGE_KEYS.TASKS)
    localStorage.removeItem(STORAGE_KEYS.FINANCE)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    setCurrentUser(null)
  }

  const exportBackup = () => {
    const data = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      habits,
      tasks,
      finances,
      prefs,
      gamification,
      aiSettings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (Array.isArray(data.habits)) setHabits(data.habits)
      if (Array.isArray(data.tasks)) setTasks(data.tasks)
      if (data.finances) setFinances(data.finances)
      if (data.prefs) setPrefs(prev => ({ ...prev, ...data.prefs }))
      if (data.gamification && currentUser) setGamification(data.gamification)
      return true
    } catch {
      return false
    }
  }

  // ═══════════════════════════════════════════
  // DEVELOPER MODE
  // ═══════════════════════════════════════════

  const unlockDevMode = (code: string): boolean => {
    if (VALID_DEV_CODES.includes(code.trim().toUpperCase())) {
      setIsDevModeUnlocked(true)
      return true
    }
    return false
  }

  const lockDevMode = () => {
    setIsDevModeUnlocked(false)
  }

  const generateDemoData = () => {
    setHabits(DEFAULT_HABITS)
    setTasks(DEFAULT_TASKS)
    setFinances(DEFAULT_FINANCES)
    setCheckIns(DEFAULT_CHECKINS)
  }

  const wipeAllDevData = (): boolean => {
    clearAllData()
    setCheckIns([])
    return true
  }

  const importStateJson = (jsonStr: string): boolean => {
    return importBackup(jsonStr)
  }

  return (
    <HabitContext.Provider value={{
      habits, tasks, finances, prefs,
      activeTab, setActiveTab,
      isSettingsOpen, setIsSettingsOpen,
      isAddIncomeOpen, setIsAddIncomeOpen,
      isAddExpenseOpen, setIsAddExpenseOpen,
      isAddHabitOpen, setIsAddHabitOpen,
      isAddTaskOpen, setIsAddTaskOpen,
      isAddSubOpen, setIsAddSubOpen,

      // Cross-Module Insights & Coach Ogonyok
      checkIns, addDailyCheckIn,
      insightsResult, ogonyokState,
      proactiveAdvice, refreshProactiveAdvice,
      discussInsightInChat,

      // Auth & Cloud Sync
      currentUser, firebaseConfig, lastSyncTime,
      isAuthModalOpen, setIsAuthModalOpen,
      loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser,
      saveFirebaseConfig, syncCloudData,

      // Developer Mode & Time Travel
      isDevModeUnlocked, isDevPasscodeModalOpen, setIsDevPasscodeModalOpen,
      unlockDevMode, lockDevMode,
      virtualDateOffsetDays, shiftVirtualDays, resetVirtualTime,
      setVirtualDateString, getSimulatedNow,
      generateDemoData, wipeAllDevData, importStateJson,

      // AI Assistant
      isAiDrawerOpen, setIsAiDrawerOpen,
      aiMessages, sendAiMessage, isAiThinking,
      aiSettings, updateAiSettings, generateAiTask,

      // Gamification
      gamification, earnXp, checkAndUpdateStreak,

      // Onboarding Tour
      isTourOpen, setIsTourOpen, tourStep, setTourStep,

      // Habits
      toggleHabitDay, addHabit, deleteHabit,
      // Tasks
      toggleTask, addTask, deleteTask,
      // Finance
      addTransaction, deleteTransaction, addSubscription, deleteSubscription,

      // Email verification
      isEmailVerificationEnabled, sendEmailVerificationCode, verifyEmailCode,
      // Settings
      updatePrefs, clearAllData, exportBackup, importBackup,
    }}>
      {children}
    </HabitContext.Provider>
  )
}

export const useHabitStore = () => {
  const context = useContext(HabitContext)
  if (!context) throw new Error('useHabitStore must be used within a HabitProvider')
  return context
}
