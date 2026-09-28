# Habit: Cross-Module Insights & Data-Aware Coach "Ogonyok" (Milestone 1)

## 1. Executive Summary & Goal
Habit's unique market differentiator is that **habits, tasks, and finances live in one cohesive system and share live data**.
Milestone 1 introduces:
1. **Cross-Module Insights Engine**: Deterministic, offline-first statistical correlation detection that discovers non-trivial patterns between habit executions, task productivity, day-of-week spending anomalies, and mood/energy.
2. **Data-Aware Coach "Ogonyok"**: Transforming the AI assistant from a static generic chat into a contextual coach that receives a compact, structured summary of the user's cross-module state and delivers actionable advice.
3. **Proactive Daily Recommendation**: An automated, once-a-day smart message from Ogonyok displayed on the dashboard with 1-click continuation into chat.
4. **Dedicated Insights Screen & Dashboard Widget**: A clean view showcasing verified insights with claims, backing data, and analyzed periods, plus a data-gathering progress tracker for accounts with fewer than 14 days of history.

---

## 2. Architecture & File Structure

Following the rule of strict modularity and separation of concerns:
```
frontend/src/
├── types/
│   └── habit.ts                         # Extended types: HabitFinancialValue, DailyCheckIn, CrossModuleInsight, OgonyokCompactState
├── lib/
│   ├── insights/
│   │   ├── matrixBuilder.ts             # Constructs normalized DayRecord[] from habits, tasks, finances, check-ins
│   │   ├── evaluators.ts                # Statistical correlation detectors (productivity, spending, overload, wellbeing)
│   │   └── insightsEngine.ts            # Engine facade with caching & evaluation triggers
│   └── coach/
│       ├── ogonyokContext.ts            # Builds compact JSON payload for Gemini prompt (< 400 tokens)
│       └── proactiveMessage.ts          # Daily proactive message generator & local cache
├── components/
│   ├── insights/
│   │   ├── InsightsView.tsx             # Full screen with category filters and insight cards
│   │   ├── InsightsDashboardWidget.tsx  # Top-3 insights preview on main dashboard
│   │   └── InsightCard.tsx              # Reusable card with claim, numbers, and "Discuss with Ogonyok" action
│   ├── coach/
│   │   └── ProactiveCoachBanner.tsx     # Daily glance banner on dashboard with Ogonyok avatar
│   └── layout/
│       ├── Navbar.tsx                   # Navigation tab update
│       └── Sidebar.tsx                  # "Инсайты" tab entry
├── locales/
│   ├── ru.ts                            # Russian localization strings
│   └── en.ts                            # English localization strings
└── context/
    └── HabitContext.tsx                 # Exposes insights, check-ins, and proactive advice
```

---

## 3. Data Models (`frontend/src/types/habit.ts`)

```typescript
// 1. Habit Financial Value (Foundation for Priority 2)
export type HabitPriceType = 'none' | 'saves_money' | 'costs_money'

export interface HabitFinancialValue {
  type: HabitPriceType
  amount: number
  monthlyCost?: number
}

// 2. Daily Wellbeing & Energy Log
export interface DailyCheckIn {
  date: string // 'YYYY-MM-DD'
  mood: number // 1 to 5
  energy: number // 1 to 5
  note?: string
  updatedAt: number
}

// 3. Normalized Day Record for Correlation Analysis
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

// 4. Cross-Module Insight Structure
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

// 5. Ogonyok Compact State for Gemini AI
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
```

---

## 4. Insights Engine Logic & Evaluators

The engine runs **100% locally** with zero external dependencies and zero API costs.

### 4.1 Activation Thresholds:
- **Minimum Data Requirement**: At least 14 distinct days of recorded activity within the last 90 days.
- If fewer than 14 days exist, return empty insight array with `dataCompleteness: { currentDays, requiredDays: 14 }`.
- **Effect Threshold**: Minimum 20% difference between compared cohorts.

### 4.2 Core Correlation Evaluators:
1. **Habit ➔ Task Productivity**:
   - Compare average `tasksCompletedCount` on days when habit $H$ was executed vs days when habit $H$ was missed.
   - Requirement: $H$ completed on $\ge 4$ days, missed on $\ge 4$ days.
   - Insight Claim: *"В дни утренней пробежки вы закрываете на 42% больше задач."*
   - Metric Detail: *"Среднее: 4.1 задачи в дни привычки против 2.9 в обычные дни."*

2. **Day-of-Week Spending Anomaly**:
   - Compare average expenses on each day of the week vs the general daily average.
   - Requirement: Specific day has $\ge 3$ records and exceeds weekly average by $\ge 40\%$.
   - Insight Claim: *"По пятницам ваши траты в среднем на 65% выше обычного."*
   - Metric Detail: *"Средний чек в пятницу: ₽3,850 против ₽2,330 в другие дни."*

3. **Task Overload ➔ Habit Streak Fracture**:
   - Analyze days directly preceding or on which habit streaks broke.
   - If streak breaks correlate with high task days ($\ge 5$ tasks due/completed), generate:
   - Insight Claim: *"Серия чтения чаще всего прерывается в дни с высокой загрузкой (5+ задач)."*
   - Metric Detail: *"67% пропусков привычки произошли в дни с перегрузкой по делам."*

4. **Wellbeing & Discipline Correlation**:
   - When mood/energy check-ins exist, evaluate mood score on days with $\ge 80\%$ habit completions vs $< 50\%$.
   - Insight Claim: *"Дни с закрытыми привычками оцениваются на 1.4 балла выше по шкале энергии."*

---

## 5. Data-Aware Coach "Ogonyok"

### 5.1 Context Injection:
Instead of sending raw tables, `ogonyokContext.ts` builds a structured context string:
```
[Текущее состояние пользователя]:
- Привычки: 4 активных, 7-дневная дисциплина 75%, лучший стрик «Пробежка» (12 дн.), пропущено недавно: «Чтение».
- Задачи: 3 активных, 1 просрочена, 2 на сегодня.
- Финансы: баланс месяца +₽24,500, топ расходов: «Кафе и доставка».
- Самочувствие: средняя энергия 3.8/5.
- Выявленные инсайты: «В дни пробежки закрывается на 42% больше задач».
```
Ogonyok uses this data to answer accurately, recommending shifts (e.g. moving reading to the morning if evenings are overloaded with tasks).

### 5.2 Proactive Daily Message:
- Triggered once per calendar day on app load.
- If today's message already exists in `localStorage['ogonyok_daily_YYYY-MM-DD']`, it loads instantly without any latency or tokens.
- If not generated yet, it synthesizes a 1-2 sentence recommendation tying a current insight or pending task to a habit.
- Falls back to a deterministic smart local rule if offline or Google Gemini is rate-limited.

---

## 6. UI & UX Polish

1. **Dashboard Widget (`InsightsDashboardWidget.tsx`)**:
   - Displays right under the top hero stats.
   - Shows horizontal scrollable or stacked glassmorphic cards with glowing border accents.
   - Features a "Собрано X из 14 дней" progress gauge for new users.
2. **Dedicated Screen (`InsightsView.tsx`)**:
   - Filter chips: «Все», «Продуктивность», «Финансы», «Дисциплина», «Самочувствие».
   - Detailed insight cards with metric pills and "Спросить Огонька" quick-action button.
3. **Proactive Coach Banner (`ProactiveCoachBanner.tsx`)**:
   - Floating friendly pill on the main screen with Ogonyok's animated flame icon and quick chat toggle.

---

## 7. Verification & Testing Strategy
- Unit tests for `matrixBuilder.ts` and `evaluators.ts` with synthetic 30-day datasets.
- E2E Playwright verification:
  - Generate demo activity data.
  - Verify Insights tab displays calculated correlations.
  - Open AI chat, verify Ogonyok incorporates live stats into responses.
  - Verify mobile view responsiveness.
