import React, { useState, useEffect, useCallback } from 'react'
import { useHabitStore } from '@/context/HabitContext'
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Info,
  Calendar,
  PlusCircle,
  Table,
  CheckSquare,
  Bot,
  PieChart,
  Settings
} from 'lucide-react'

interface DynamicTourStep {
  tab: 'habits' | 'tasks' | 'finance' | 'developer' | 'profile'
  targetIds: string[]
  icon: React.ElementType
  titleRu: string
  titleEn: string
  locationRu: string
  locationEn: string
  doesRu: string
  doesEn: string
  howRu: string
  howEn: string
  badgeRu: string
  badgeEn: string
}

const TOUR_STEPS: DynamicTourStep[] = [
  {
    tab: 'habits',
    targetIds: ['navTab-habits', 'navTabMobile-habits'],
    icon: Calendar,
    titleRu: 'Быстрая навигация по модулям',
    titleEn: 'Modular Navigation',
    locationRu: 'Левое боковое меню (ПК) или нижняя панель (смартфон)',
    locationEn: 'Left sidebar (Desktop) or bottom navigation (Mobile)',
    doesRu: 'Обеспечивает мгновенный переход между Трекером привычек, Менеджером задач, Финансовым учетом и Профилем.',
    doesEn: 'Enables quick switching between Habit Tracker, Task Manager, Finance Hub, and User Profile.',
    howRu: 'Нажмите на любую из иконок, чтобы открыть соответствующий раздел без перезагрузки страницы.',
    howEn: 'Click any icon to instantly switch views.',
    badgeRu: 'Шаг 1 из 8 • Меню',
    badgeEn: 'Step 1 of 8 • Navigation'
  },
  {
    tab: 'habits',
    targetIds: ['tour-btn-add-habit'],
    icon: PlusCircle,
    titleRu: 'Создание новой привычки',
    titleEn: 'Create New Habit',
    locationRu: 'Вверху справа над календарной матрицей',
    locationEn: 'Top-right above the calendar grid',
    doesRu: 'Открывает конструктор полезной рутины: выбор emoji, категории, частоты повторений (будни, выходные, каждый день) и целевого времени.',
    doesEn: 'Opens the habit creator with custom emoji, categories, schedule frequencies, and reminder time.',
    howRu: 'Нажмите кнопку «+ Новая привычка», введите цель и начните ежедневную серию выполнения.',
    howEn: 'Click "+ New Habit", configure your routine and start building your streak.',
    badgeRu: 'Шаг 2 из 8 • Привычки',
    badgeEn: 'Step 2 of 8 • Habits'
  },
  {
    tab: 'habits',
    targetIds: ['tour-habits-matrix'],
    icon: Table,
    titleRu: 'Календарная матрица дней',
    titleEn: 'Daily Calendar Grid',
    locationRu: 'Центральная интерактивная сетка привычек',
    locationEn: 'Central interactive habit matrix',
    doesRu: 'Фиксирует ежедневное выполнение привычек. Автоматически рассчитывает точность по дням месяца, общий процент успеха и серию (стрик).',
    doesEn: 'Tracks daily habit progress. Automatically calculates monthly completion rate and active streak days.',
    howRu: 'Кликните на кружок любого дня месяца, чтобы отметить выполнение. Повторный клик снимает отметку.',
    howEn: 'Click any day circle to toggle completion status. Streaks increase with consecutive days.',
    badgeRu: 'Шаг 3 из 8 • Прогресс',
    badgeEn: 'Step 3 of 8 • Matrix'
  },
  {
    tab: 'tasks',
    targetIds: ['navTab-tasks', 'navTabMobile-tasks'],
    icon: CheckSquare,
    titleRu: 'Менеджер задач и дедлайнов',
    titleEn: 'Task & Deadline Manager',
    locationRu: 'Вкладка «Задачи» на панели навигации',
    locationEn: 'Navigation bar, "Tasks" tab',
    doesRu: 'Полнофункциональный список дел с автоподсчётом дней до дедлайна, фильтрами («Сегодня», «Просрочено», «Завершено») и приоритетами от Urgent до Low.',
    doesEn: 'Smart task management with countdown deadlines, status filters, categories, and urgent-to-low priority tags.',
    howRu: 'Используйте быстрые фильтры сверху для сортировки задач по срочности и готовности.',
    howEn: 'Use status filter chips to organize work by urgency and completion status.',
    badgeRu: 'Шаг 4 из 8 • Задачи',
    badgeEn: 'Step 4 of 8 • Tasks'
  },
  {
    tab: 'tasks',
    targetIds: ['tour-btn-add-task', 'tour-btn-ai-task'],
    icon: Sparkles,
    titleRu: 'Добавление задач и AI-генератор',
    titleEn: 'Add Task & AI Suggestions',
    locationRu: 'Вверху страницы задач, кнопки «Добавить задачу» и «AI задача»',
    locationEn: 'Top-right of tasks view',
    doesRu: 'Позволяет вручную создать задачу или в один клик сгенерировать умную продуктивную цель с помощью ИИ с начислением XP.',
    doesEn: 'Create custom tasks or generate intelligent action items via AI with gamification XP rewards.',
    howRu: 'Нажмите «AI задача» — система сама сформулирует актуальную задачу для вашей продуктивности.',
    howEn: 'Click "AI задача" to let the assistant generate high-value action items.',
    badgeRu: 'Шаг 5 из 8 • Действия',
    badgeEn: 'Step 5 of 8 • Actions'
  },
  {
    tab: 'finance',
    targetIds: ['tour-finance-balance', 'tour-btn-finance-income', 'tour-btn-finance-expense', 'tour-btn-finance-sub'],
    icon: PieChart,
    titleRu: 'Учёт финансов и подписок',
    titleEn: 'Finance & Subscriptions',
    locationRu: 'Раздел «Финансы», верхний блок баланса и кнопки операций',
    locationEn: 'Finance module, balance overview & quick action buttons',
    doesRu: 'Считает чистый ежемесячный баланс, доходы, расходы и ведёт календарь регулярных подписок со стоимостью за месяц.',
    doesEn: 'Monitors monthly cashflow, income, expense categories, and recurring subscription budgets.',
    howRu: 'Кнопки «+ Доход», «- Расход» и «+ Подписка» позволяют быстро зафиксировать любые финансовые события.',
    howEn: 'Use "+ Доход", "- Расход" and "+ Подписка" to track all monetary events.',
    badgeRu: 'Шаг 6 из 8 • Финансы',
    badgeEn: 'Step 6 of 8 • Finance'
  },
  {
    tab: 'habits',
    targetIds: ['btnSidebarAi', 'btnMobileAi'],
    icon: Bot,
    titleRu: 'Умный AI-Советник',
    titleEn: 'Smart AI Advisor',
    locationRu: 'Иконка с искрами на панели навигации',
    locationEn: 'Sparkles icon on the navigation bar',
    doesRu: 'Выдвигает плавную панель персонального консультанта. Анализирует ваши привычки, даёт советы по выгоранию и отвечает на любые вопросы.',
    doesEn: 'Slides out an intelligent assistant panel. Analyzes routine consistency, suggests habit optimizations, and answers productivity queries.',
    howRu: 'Нажмите на кнопку AI — панель плавно выедет из правой стенки экрана.',
    howEn: 'Click the AI button — the assistant drawer smoothly slides in from the right wall.',
    badgeRu: 'Шаг 7 из 8 • AI Чат',
    badgeEn: 'Step 7 of 8 • AI Chat'
  },
  {
    tab: 'habits',
    targetIds: ['btnSidebarSettings', 'btnMobileSettings'],
    icon: Settings,
    titleRu: 'Настройки, облако и бэкап',
    titleEn: 'Settings & Cloud Backup',
    locationRu: 'Иконка шестерёнки в меню (ПК и мобильный)',
    locationEn: 'Settings cog button in sidebar/bottom bar',
    doesRu: 'Выдвигает панель конфигурации: смена языка (RU/EN), синхронизация с облаком Firebase, сохранение/восстановление JSON-бэкапов и режим разработчика.',
    doesEn: 'Slides out settings drawer: language switcher, Firebase cloud sync, JSON import/export backups, and developer mode.',
    howRu: 'Кликните на шестерёнку — настройки плавно выедут из правой стенки.',
    howEn: 'Click the gear icon — the settings panel smoothly slides in from the right wall.',
    badgeRu: 'Шаг 8 из 8 • Финал',
    badgeEn: 'Step 8 of 8 • Settings'
  }
]

export const HelpTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, tourStep, setTourStep, prefs, updatePrefs, setActiveTab, activeTab } = useHabitStore()

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [placement, setPlacement] = useState<'bottom' | 'top' | 'right' | 'left'>('bottom')
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({})

  const isRu = prefs.lang === 'ru'
  const currentStep = TOUR_STEPS[tourStep] || TOUR_STEPS[0]
  const isLast = tourStep === TOUR_STEPS.length - 1
  const StepIcon = currentStep.icon

  // Find target element across potential target IDs
  const findTargetElement = useCallback((): HTMLElement | null => {
    for (const id of currentStep.targetIds) {
      const el = document.getElementById(id)
      if (el && el.offsetParent !== null) { // visible in DOM
        return el
      }
    }
    // Fallback to any matching element by id even if hidden parent
    for (const id of currentStep.targetIds) {
      const el = document.getElementById(id)
      if (el) return el
    }
    return null
  }, [currentStep])

  // Recalculate target position and tooltip coordinates
  const updatePosition = useCallback(() => {
    if (!isTourOpen) return

    const el = findTargetElement()
    if (!el) {
      setTargetRect(null)
      // Center fallback if target element not currently visible
      setTooltipStyle({
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      })
      return
    }

    const rect = el.getBoundingClientRect()
    setTargetRect(rect)

    const tooltipWidth = Math.min(window.innerWidth - 32, 420)
    const tooltipHeight = 280

    // If target is in the left sidebar on desktop, place tooltip to the right
    const isSidebarDesktop = rect.left < 100 && window.innerWidth >= 768
    if (isSidebarDesktop) {
      setPlacement('right')
      const left = rect.right + 14
      const top = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, (rect.top + rect.height / 2) - tooltipHeight / 2))
      const arrowTop = Math.max(20, Math.min(tooltipHeight - 28, (rect.top + rect.height / 2) - top - 7))
      setArrowStyle({
        top: `${arrowTop}px`,
        left: '-7px'
      })
      setTooltipStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${tooltipWidth}px`,
        zIndex: 9999
      })
      return
    }

    // Decide vertical placement (prefer below, unless near bottom)
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const placeAbove = spaceBelow < 300 && spaceAbove > spaceBelow
    setPlacement(placeAbove ? 'top' : 'bottom')

    // Calculate vertical position
    let top = 0
    if (placeAbove) {
      top = Math.max(16, rect.top - tooltipHeight - 14)
    } else {
      top = Math.min(window.innerHeight - tooltipHeight - 16, rect.bottom + 14)
    }

    // Calculate horizontal position (centered to target, clamped to screen)
    const targetCenter = rect.left + rect.width / 2
    let left = targetCenter - tooltipWidth / 2
    left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left))

    // Arrow alignment relative to tooltip
    const arrowPos = Math.max(20, Math.min(tooltipWidth - 28, targetCenter - left - 7))
    setArrowStyle({
      left: `${arrowPos}px`
    })

    setTooltipStyle({
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      zIndex: 9999
    })
  }, [findTargetElement, isTourOpen])

  // Sync tab and scroll target into view
  useEffect(() => {
    if (!isTourOpen) return

    if (currentStep.tab && activeTab !== currentStep.tab) {
      setActiveTab(currentStep.tab)
    }

    const timer = setTimeout(() => {
      const el = findTargetElement()
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
      updatePosition()
    }, 120)

    return () => clearTimeout(timer)
  }, [tourStep, isTourOpen, currentStep, activeTab, setActiveTab, findTargetElement, updatePosition])

  // Window scroll and resize listeners
  useEffect(() => {
    if (!isTourOpen) return

    const handleResizeOrScroll = () => {
      requestAnimationFrame(updatePosition)
    }

    window.addEventListener('resize', handleResizeOrScroll)
    window.addEventListener('scroll', handleResizeOrScroll, true)

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    }
  }, [isTourOpen, updatePosition])

  // Keyboard navigation
  useEffect(() => {
    if (!isTourOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      } else if (e.key === 'ArrowRight' && !isLast) {
        handleNext()
      } else if (e.key === 'ArrowLeft' && tourStep > 0) {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTourOpen, tourStep, isLast])

  if (!isTourOpen) return null

  const handleNext = () => {
    if (isLast) {
      handleClose()
    } else {
      const nextIdx = tourStep + 1
      setTourStep(nextIdx)
      setActiveTab(TOUR_STEPS[nextIdx].tab)
    }
  }

  const handlePrev = () => {
    if (tourStep > 0) {
      const prevIdx = tourStep - 1
      setTourStep(prevIdx)
      setActiveTab(TOUR_STEPS[prevIdx].tab)
    }
  }

  const handleClose = () => {
    setIsTourOpen(false)
    updatePrefs({ tourCompleted: true })
  }

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none">
      {/* Dimmed ambient backdrop that allows seeing the interface */}
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Target Focus Highlight Beacon */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            left: `${targetRect.left - 6}px`,
            top: `${targetRect.top - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
          className="pointer-events-none z-[9995] rounded-2xl border-2 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.65),inset_0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300 animate-pulse"
        >
          {/* Beacon pin */}
          <div className="absolute -top-3 -right-3 size-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-500/60 ring-2 ring-white/30 animate-bounce">
            📍
          </div>
        </div>
      )}

      {/* Dynamic Contextual Tooltip Card */}
      <div
        style={tooltipStyle}
        className="pointer-events-auto relative bg-[#0e1017]/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] text-neutral-100 transition-all duration-300 animate-fade-scale"
        role="dialog"
        aria-modal="true"
        aria-label={isRu ? currentStep.titleRu : currentStep.titleEn}
      >
        {/* Pointer Arrow pointing to the highlighted target */}
        {targetRect && (
          <div
            style={arrowStyle}
            className={`absolute size-3.5 bg-[#0e1017] border-indigo-500/30 rotate-45 transform pointer-events-none transition-all duration-300 ${
              placement === 'bottom'
                ? '-top-2 border-t border-l'
                : placement === 'top'
                ? '-bottom-2 border-b border-r'
                : placement === 'right'
                ? '-left-2 border-b border-l'
                : '-right-2 border-t border-r'
            }`}
          />
        )}

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-[11px] font-semibold text-indigo-300">
            <Sparkles className="size-3 text-indigo-400 animate-pulse" />
            <span>{isRu ? currentStep.badgeRu : currentStep.badgeEn}</span>
          </div>

          <button
            onClick={handleClose}
            className="size-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title={isRu ? 'Закрыть подсказки (Esc)' : 'Close hints (Esc)'}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Function Title */}
        <div className="flex items-start gap-2.5 mb-3">
          <div className="size-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5 shadow-sm">
            <StepIcon className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {isRu ? currentStep.titleRu : currentStep.titleEn}
            </h3>
            {/* Precise location indicator */}
            <div className="flex items-center gap-1 text-[11px] text-indigo-300/80 font-medium mt-0.5">
              <MapPin className="size-3 text-indigo-400 shrink-0" />
              <span>{isRu ? currentStep.locationRu : currentStep.locationEn}</span>
            </div>
          </div>
        </div>

        {/* Function Explanation Blocks */}
        <div className="space-y-2 mb-4 text-xs">
          {/* What it does */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-400" />
              <span>{isRu ? 'Что делает функция:' : 'What it does:'}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11.5px]">
              {isRu ? currentStep.doesRu : currentStep.doesEn}
            </p>
          </div>

          {/* How to use */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <Info className="size-3.5 text-sky-400" />
              <span>{isRu ? 'Как использовать:' : 'How to use:'}</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11.5px]">
              {isRu ? currentStep.howRu : currentStep.howEn}
            </p>
          </div>
        </div>

        {/* Navigation & Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
          {/* Skip button */}
          <button
            onClick={handleClose}
            className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isRu ? 'Пропустить' : 'Skip'}
          </button>

          {/* Interactive Step Dots */}
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTourStep(idx)
                  setActiveTab(TOUR_STEPS[idx].tab)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === tourStep
                    ? 'w-5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                    : idx < tourStep
                    ? 'w-1.5 bg-indigo-500/40'
                    : 'w-1.5 bg-white/10 hover:bg-white/20'
                }`}
                title={`Шаг ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev & Next Buttons */}
          <div className="flex items-center gap-1.5">
            {tourStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">{isRu ? 'Назад' : 'Back'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>
                {isLast 
                  ? (isRu ? 'Понятно!' : 'Got it!') 
                  : (isRu ? 'Далее' : 'Next')}
              </span>
              {isLast ? <CheckCircle2 className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
