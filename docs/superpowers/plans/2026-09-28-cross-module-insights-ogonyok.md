# Habit: Milestone 1 Implementation Plan — Cross-Module Insights & Data-Aware Coach "Ogonyok"

> **Goal**: Turn Habit into an integrated personal OS where habits, tasks, and finances share live data. Milestone 1 implements:
> 1. Local deterministic Cross-Module Insights Engine (evaluates correlations between habits, task velocity, spending spikes, and wellbeing).
> 2. Data-Aware AI Coach "Ogonyok" (injects compact cross-module telemetry < 400 tokens into Gemini prompts).
> 3. Daily Proactive Advice Banner on the dashboard with 1-click continuation.
> 4. Dedicated "Инсайты" view and dashboard widget with 14-day history tracking.

---

## Architecture Overview

```
frontend/src/
├── types/
│   └── habit.ts                         # Extended types: HabitFinancialValue, DailyCheckIn, DayRecord, CrossModuleInsight, OgonyokCompactState
├── lib/
│   ├── insights/
│   │   ├── matrixBuilder.ts             # Constructs DayRecord[] from habits, tasks, transactions, check-ins
│   │   ├── evaluators.ts                # Deterministic statistical correlation detectors
│   │   ├── insightsEngine.ts            # Public API with caching, threshold filters (>= 14 days)
│   │   └── __tests__/
│   │       └── insights.test.ts         # Vitest unit test suite with 30-day synthetic telemetry
│   └── coach/
│       ├── ogonyokContext.ts            # Builds compact context string and structured payload for Gemini
│       ├── proactiveMessage.ts          # Daily proactive message generator with date-keyed localStorage cache
│       └── __tests__/
│           └── ogonyok.test.ts          # Vitest unit test suite for prompt context builder & proactive generator
├── components/
│   ├── insights/
│   │   ├── InsightCard.tsx              # Reusable card with claim, numbers, badge icon, and "Спросить Огонька"
│   │   ├── InsightsDashboardWidget.tsx  # Top 3 insights preview + 14-day progress bar on dashboard
│   │   └── InsightsView.tsx             # Full screen with category filters (All, Productivity, Spending, Discipline, Wellbeing)
│   ├── coach/
│   │   └── ProactiveCoachBanner.tsx     # Animated daily message banner on dashboard
│   └── layout/
│       ├── Sidebar.tsx                  # Adds 'insights' tab with Sparkles icon
│       └── Navbar.tsx                   # Mobile bottom bar tab support
├── locales/
│   ├── ru.ts                            # Russian localization for insights, badges, coach banner
│   └── en.ts                            # English localization
└── context/
    └── HabitContext.tsx                 # Exposes insights, check-ins, proactiveMessage, and passes compact state to AI
```

---

## Tasks Breakdown

### Task 1: Data Model Expansion
- **File**: `frontend/src/types/habit.ts`
- **Actions**:
  - Add `HabitFinancialValue` & update `Habit` interface (`financialValue?: HabitFinancialValue`, `streakFreezesUsed?: number`).
  - Add `DailyCheckIn` (`date`, `mood: 1..5`, `energy: 1..5`, `note`, `updatedAt`).
  - Add `DayRecord` for matrix builder normalization.
  - Add `CrossModuleInsight` and `InsightCategory`.
  - Add `OgonyokCompactState` interface.
  - Update `NavTabType` in `Sidebar.tsx` to include `'insights'`.
- **Verification**: Run `npm --prefix frontend run build` to verify type compatibility.
- **Commit**: `git commit -m "feat(types): add cross-module insights, check-ins, and ogonyok compact state"`

---

### Task 2: Insights Engine & Statistical Evaluators (TDD)
- **Files**:
  - `frontend/src/lib/insights/matrixBuilder.ts`
  - `frontend/src/lib/insights/evaluators.ts`
  - `frontend/src/lib/insights/insightsEngine.ts`
  - `frontend/src/lib/insights/__tests__/insights.test.ts`
- **Evaluators Logic**:
  1. `evaluateHabitTaskProductivity`: Compares average completed tasks on days when a habit was done vs not done ($\ge 20\%$ variance, $\ge 4$ points per cohort).
  2. `evaluateDayOfWeekSpendingAnomaly`: Compares average expenses on days of week (e.g. Friday/Saturday) against weekly baseline ($\ge 40\%$ spike, $\ge 3$ records).
  3. `evaluateTaskOverloadStreakFracture`: Checks if habit streak breaks correlate with high task loads ($\ge 5$ tasks).
  4. `evaluateWellbeingDiscipline`: Checks if days with high habit completion rate correlate with higher mood/energy score.
- **Engine Rules**:
  - Requires at least 14 days of recorded activity to generate claims.
  - Returns `dataCompleteness: { currentDays: number, requiredDays: 14 }`.
- **Verification**: Run `npm test:unit` to verify all correlation scenarios with synthetic 30-day datasets.
- **Commit**: `git commit -m "feat(insights): implement deterministic cross-module insights engine with unit tests"`

---

### Task 3: Data-Aware Coach Ogonyok Context & Daily Message
- **Files**:
  - `frontend/src/lib/coach/ogonyokContext.ts`
  - `frontend/src/lib/coach/proactiveMessage.ts`
  - `frontend/src/lib/coach/__tests__/ogonyok.test.ts`
- **Logic**:
  - `buildOgonyokCompactState(habits, tasks, finances, gamification, checkIns, insights)`: Returns compact metrics JSON and plain text summary ($\le 400$ tokens).
  - `buildOgonyokSystemPrompt(userState)`: Enriches Gemini system prompt with current user state.
  - `getOrGenerateProactiveDailyMessage(...)`: Checks `localStorage['ogonyok_daily_YYYY-MM-DD']`. If absent, computes a 1-2 sentence proactive recommendation tying today's context/insights.
- **Verification**: Run `npm test:unit` to verify context builder and proactive generator.
- **Commit**: `git commit -m "feat(coach): implement ogonyok context injector and daily proactive advice generator"`

---

### Task 4: Store & HabitContext Integration
- **File**: `frontend/src/context/HabitContext.tsx`
- **Actions**:
  - Add state for `checkIns: DailyCheckIn[]`.
  - Memoize `insightsResult` via `computeCrossModuleInsights(habits, tasks, finance, checkIns)`.
  - Provide `proactiveAdvice` state with auto-load on start.
  - Update `askGemini` function in `HabitContext.tsx` to automatically inject `buildOgonyokSystemPrompt(compactState)` into the Gemini conversation context.
  - Expose `addDailyCheckIn`, `insightsResult`, `proactiveAdvice`, and `discussInsightInChat(insight)`.
- **Verification**: Run `npm --prefix frontend run build`.
- **Commit**: `git commit -m "feat(store): integrate insights engine and ogonyok state into HabitContext"`

---

### Task 5: Localization (Russian & English)
- **Files**:
  - `frontend/src/locales/ru.ts`
  - `frontend/src/locales/en.ts`
- **Keys Added**:
  - `nav.insights`: "Инсайты" / "Insights"
  - `insights.*`: Titles, categories, badge tooltips, empty states, 14-day history progress text, "Спросить Огонька" CTA.
  - `coach.*`: Proactive banner greetings, actions, flame status.
- **Verification**: Run `npm --prefix frontend run build`.
- **Commit**: `git commit -m "feat(locales): add ru/en translations for insights and coach Ogonyok"`

---

### Task 6: UI Components Implementation
- **Files**:
  - `frontend/src/components/insights/InsightCard.tsx`: Glassmorphic card, category badge, claim highlight, numeric breakdown pill, period analyzed, and button to open chat with this insight pre-prompted.
  - `frontend/src/components/insights/InsightsDashboardWidget.tsx`: Dashboard preview showing top 3 insights or the 14-day data-gathering progress gauge.
  - `frontend/src/components/insights/InsightsView.tsx`: Full tab view with category filters, search/sort, and empty states.
  - `frontend/src/components/coach/ProactiveCoachBanner.tsx`: Daily banner on dashboard with animated flame, message text, and button to continue in AI chat.
- **Verification**: Run `npm --prefix frontend run build`.
- **Commit**: `git commit -m "feat(ui): create InsightCard, InsightsView, dashboard widget, and coach banner"`

---

### Task 7: Navigation & Tab Wiring
- **Files**:
  - `frontend/src/components/layout/Sidebar.tsx`: Add 'insights' nav item to desktop vertical menu and mobile bottom bar.
  - `frontend/src/components/habits/HabitsView.tsx`: Mount `ProactiveCoachBanner` and `InsightsDashboardWidget` above/below the hero overview.
  - `frontend/src/App.tsx`: Render `InsightsView` when `activeTab === 'insights'`.
  - `frontend/src/components/ai/AiDrawer.tsx`: Ensure "Спросить Огонька" pre-fills input or automatically sends discussion prompt.
- **Verification**: Run `npm --prefix frontend run build`.
- **Commit**: `git commit -m "feat(nav): wire insights view and coach widgets into dashboard and sidebar"`

---

### Task 8: Verification & Build Sync
- **Files**:
  - `playwright-insights-verification.cjs`
- **Actions**:
  - Run `npm test:unit` for all unit tests.
  - Launch Playwright test to verify:
    1. Navigation to "Инсайты" tab.
    2. Proactive banner appears on dashboard.
    3. Insights dashboard widget displays cards and progress bar.
    4. Clicking "Спросить Огонька" opens AI chat with context.
    5. Take screenshot artifact of the new views.
  - Run `npm run build` which builds Vite app and syncs to `www/`, `index.html`, and Capacitor Android.
- **Commit**: `git commit -m "chore(sync): verify milestone 1 e2e and sync production build"`
