/**
     * Habit Application - Multi-Cookie Persistence & Dynamic Month Length Engine
     */
(function () {
  'use strict';

  // --- Localization Dictionary (RU / EN) ---
  const I18N = {
    ru: {
      help_tour: 'Помощь (?)',
      tab_habits: 'Привычки',
      tab_tasks: 'Задачи',
      tab_finance: 'Финансы',
      tab_developer: 'Разработчик',
      nav_settings: 'Настройки',
      habits_title: 'Трекер привычек',
      habits_subtitle: 'Формируйте дисциплину с динамической матрицей рутины',
      add_habit: 'Новая привычка',
      tasks_title: 'Задачи и сроки',
      tasks_subtitle: 'Управляйте дедлайнами и приоритетами',
      add_task: 'Добавить задачу',
      finance_title: 'Бюджет и подписки',
      finance_subtitle: 'Контролируйте доходы, лимиты расходов и регулярные сервисы',
      monthly_completion: 'Выполнение за месяц',
      score: 'РЕЙТИНГ',
      daily_wave: 'График ежедневного выполнения',
      days_1_prefix: 'Дни 1 – ',
      active_habits: 'Активных привычек',
      best_streak: 'Лучший стрик',
      top_day: 'Лучший день',
      habits_routines: 'Привычки и рутина',
      week_1: 'Неделя 1 (1–7)',
      week_2: 'Неделя 2 (8–14)',
      week_3: 'Неделя 3 (15–21)',
      week_4: 'Неделя 4 (22–28)',
      week_extra: 'Остаток',
      category_target: 'Категория / Цель',
      progress: 'Прогресс',
      rate: 'Процент',
      daily_total: 'Итого за день',
      no_habits_title: 'Привычек пока нет',
      no_habits_desc: 'Начните строить дисциплину, создав свою первую полезную привычку.',
      create_first_habit: '+ Создать первую привычку',
      total_tasks: 'Всего задач',
      in_progress: 'В процессе',
      completed: 'Завершено',
      overdue: 'Просрочено',
      search_tasks: 'Поиск задач...',
      all_categories: 'Все категории',
      cat_work: 'Работа',
      cat_personal: 'Личное',
      cat_study: 'Учёба',
      cat_health: 'Здоровье',
      cat_finance: 'Финансы',
      all_status: 'Все статусы',
      status_active: 'Только активные',
      status_completed: 'Завершённые',
      status_overdue: 'Просроченные',
      sort_due: 'По сроку',
      sort_priority: 'По приоритету',
      sort_name: 'По названию',
      task_name: 'Задача',
      category: 'Категория',
      due_date: 'Срок',
      days_left: 'Осталось',
      priority: 'Приоритет',
      actions: 'Действия',
      no_tasks_title: 'Задач пока нет',
      no_tasks_desc: 'Добавьте важные дела и контролируйте их сроки выполнения.',
      create_first_task: '+ Добавить первую задачу',
      total_income: 'Общий доход',
      active_streams: 'источника дохода',
      total_expenses: 'Расходы',
      actual_spent: 'Фактические траты за месяц',
      net_balance: 'Чистый остаток',
      savings_buffer: 'Накопления / Резерв',
      savings_rate: 'Норма сбережений',
      of_monthly_income: 'От месячного дохода',
      budget_categories: 'Категории расходов и бюджет',
      add_category: 'Категория',
      budgeted: 'План',
      actual: 'Факт',
      remaining: 'Остаток',
      usage: 'Расход',
      no_categories_title: 'Категории расходов не добавлены',
      no_categories_desc: 'Задайте плановые бюджеты на жильё, продукты и подписки.',
      expense_breakdown: 'Структура расходов',
      income_streams: 'Источники дохода',
      add_income: 'Доход',
      source: 'Источник',
      planned: 'План',
      status: 'Статус',
      no_income_title: 'Источники дохода пока не внесены',
      recurring_subs: 'Регулярные подписки',
      add_sub: 'Подписка',
      no_subs_title: 'Активных подписок пока нет',
      settings_title: 'Настройки и профиль',
      language: 'Язык / Language',
      language_desc: 'Выберите язык интерфейса',
      theme: 'Тема оформления',
      theme_desc: 'Тёмная или светлая тема',
      data_management: 'Данные и хранилище',
      data_desc: 'Экспорт или импорт всех данных рабочего пространства в формате JSON',
      export_backup: 'Скачать бэкап',
      import_backup: 'Загрузить бэкап',
      clear_all_data: 'Очистить хранилище',
      clear_desc: 'Удалить все записи и сбросить к чистому состоянию',
      clear_btn: 'Очистить всё',
      modal_add_habit: 'Новая привычка',
      habit_name: 'Название привычки',
      emoji_icon: 'Иконка Emoji',
      quick_pick: 'Быстрый выбор:',
      cat_mindfulness: 'Осознанность и баланс',
      cat_productivity: 'Продуктивность и фокус',
      cat_learning: 'Обучение и карьера',
      cancel: 'Отмена',
      save: 'Сохранить',
      modal_add_task: 'Создать задачу',
      task_title: 'Название задачи',
      notes: 'Заметки / детали',
      pri_urgent: 'Срочный',
      pri_high: 'Высокий',
      pri_medium: 'Средний',
      pri_low: 'Низкий',
      modal_add_expense: 'Категория расходов',
      category_name: 'Название категории',
      modal_add_income: 'Добавить источник дохода',
      source_name: 'Название источника',
      received: 'Получено',
      pending: 'Ожидается',
      modal_add_sub: 'Добавить подписку',
      service_name: 'Сервис / Инструмент',
      monthly_cost: 'Стоимость в месяц ($)',
      billing_day: 'День списания',
      // 8-Step Tour Strings
      tour_1_title: 'Добро пожаловать в Habit',
      tour_1_desc: 'Ваше персональное рабочее пространство без лишнего мусора, готовое к вашим личным целям.',
      tour_2_title: 'Создание привычек',
      tour_2_desc: 'Нажмите "+ Новая привычка", чтобы добавить рутину с собственным emoji и категорией.',
      tour_3_title: 'Динамическая календарная матрица',
      tour_3_desc: 'Отмечайте чекбоксы по дням. Количество дней точно совпадает с выбранным месяцем (28, 29, 30 или 31).',
      tour_4_title: 'График волны и прогресс',
      tour_4_desc: 'Отслеживайте пики продуктивности на графике волны и общий балл выполнения за месяц.',
      tour_5_title: 'Вкладки модулей',
      tour_5_desc: 'Легко переключайтесь между трекером привычек, задачами и финансами.',
      tour_6_title: 'Задачи и сроки',
      tour_6_desc: 'Управляйте дедлайнами с автоподсчётом оставшихся дней, приоритетами и быстрым поиском.',
      tour_7_title: 'Бюджет и подписки',
      tour_7_desc: 'Контролируйте доходы, лимиты по категориям с индикаторами и регулярные SaaS-подписки.',
      tour_8_title: 'Настройки и хранилище',
      tour_8_desc: 'Переключайте язык (RU/EN), тему (Dark/Light) и управляйте резервными копиями JSON.',
      faq_title: 'Частые вопросы (FAQ)',
      faq_q1: 'Как создавать и настраивать привычки?',
      faq_a1: 'Нажмите «+ Новая привычка» в верхней панели. Выберите готовый пресет (Чтение, Спорт, Вода, Медитация) или укажите своё название, emoji, уникальный цветовой акцент строки, целевое время и расписание по дням недели.',
      faq_q2: 'Как график волны рассчитывает продуктивность?',
      faq_a2: 'Динамический сплайн-график анализирует количество отмеченных привычек на каждый день активного месяца, отображая пики продуктивности и динамику дисциплины в реальном времени.',
      faq_q3: 'Где хранятся мои данные и как работает облако?',
      faq_a3: 'По умолчанию приложение работает в безопасном офлайн-режиме через localStorage без ограничений 4KB. При подключении Firebase в облако автоматически загружаются все данные и включается фоновая синхронизация между устройствами.',
      faq_q4: 'Как экспортировать или сбросить прогресс?',
      faq_a4: 'Используйте кнопку «Скачать бэкап» для сохранения локального JSON-файла. Кнопка «Очистить хранилище» позволяет удалить данные и начать трекинг с чистого листа.',
      support_title: 'Поддержка и связь',
      support_tg_heading: 'Telegram Поддержка',
      support_desc: 'Вопросы, идеи по улучшению или обратная связь',
      support_tg_btn: 'Написать в Telegram',
      share_title: 'Поделиться Habit',
      share_desc: 'Поделитесь трекером с друзьями и коллегами',
      share_btn: 'Поделиться',
      about_summary: 'Минималистичный гибридный трекер привычек, задач и личных финансов.',
      privacy_link: 'Конфиденциальность',
      terms_link: 'Условия использования',
      google_soon: '❌ Скоро',
      fb_settings_title: 'Синхронизация и Firebase',
      fb_config_heading: 'Конфигурация Firebase',
      fb_config_sub: 'Ключи для сохранения данных между устройствами',
      paste_json_btn: 'Вставить JSON',
      fb_save_btn: 'Сохранить и подключить',
      fb_reset_btn: 'Сбросить',
      fb_status_connected: '🟢 Подключено',
      fb_status_offline: '⚪ Офлайн',
      layout_mode: 'Режим интерфейса',
      layout_mode_desc: 'Оптимизация для мобильных устройств или ПК',
      layout_mobile: '📱 Моб',
      layout_desktop: '💻 ПК',
      layout_auto: '⚡ Авто',
      onboarding_welcome: 'Добро пожаловать в Habit',
      onboarding_subtitle: 'Выберите предпочтительный режим отображения для вашего устройства',
      onboarding_mobile_title: 'Режим для телефонов',
      onboarding_mobile_desc: 'Нижняя панель навигации, быстрый FAB и оптимизация под сенсорный ввод',
      onboarding_desktop_title: 'Режим для ПК',
      onboarding_desktop_desc: 'Классическая верхняя панель, расширенная сетка и компактная плотность',
      onboarding_login_btn: 'Войти через Cloud Sync / Аккаунт',
      dev_mode_title: 'Режим разработчика',
      dev_mode_desc: 'Консоль QA, симулятор времени и инспектор состояния',
      dev_activate_btn: 'Активировать',
      dev_open_btn: 'Открыть панель',
      dev_modal_title: 'Доступ разработчика',
      dev_modal_subtitle: 'Введите код доступа для активации инженерной консоли и инструментов тестирования',
      dev_code_label: 'Секретный код',
      dev_code_error: 'Неверный код доступа. Попробуйте снова.',
      unlock_btn: 'Подтвердить',
      cancel: 'Отмена'
    },
    en: {
      help_tour: 'Help (?)',
      tab_habits: 'Habits',
      tab_tasks: 'Tasks',
      tab_finance: 'Finance',
      tab_developer: 'Developer',
      nav_settings: 'Settings',
      habits_title: 'Habit Tracker',
      habits_subtitle: 'Build momentum with dynamic routine matrix',
      add_habit: 'New Habit',
      tasks_title: 'Tasks & Deadlines',
      tasks_subtitle: 'Organize urgent deliverables with dynamic status tracking',
      add_task: 'Add Task',
      finance_title: 'Personal Budget & Subscriptions',
      finance_subtitle: 'Monitor cashflow, category variances, and monthly recurring tools',
      monthly_completion: 'Monthly Completion',
      score: 'SCORE',
      daily_wave: 'Daily Habit Completion Wave',
      days_1_prefix: 'Days 1 – ',
      active_habits: 'Active Habits',
      best_streak: 'Best Streak',
      top_day: 'Top Day',
      habits_routines: 'Habits & Routines',
      week_1: 'Week 1 (1–7)',
      week_2: 'Week 2 (8–14)',
      week_3: 'Week 3 (15–21)',
      week_4: 'Week 4 (22–28)',
      week_extra: 'Extra',
      category_target: 'Category / Target',
      progress: 'Progress',
      rate: 'Rate %',
      daily_total: 'Daily Total',
      no_habits_title: 'No habits yet',
      no_habits_desc: 'Build positive momentum by creating your first daily routine.',
      create_first_habit: '+ Create First Habit',
      total_tasks: 'Total Tasks',
      in_progress: 'In Progress',
      completed: 'Completed',
      overdue: 'Overdue',
      search_tasks: 'Search tasks...',
      all_categories: 'All Categories',
      cat_work: 'Work',
      cat_personal: 'Personal',
      cat_study: 'Study',
      cat_health: 'Health',
      cat_finance: 'Finance',
      all_status: 'All Status',
      status_active: 'Active Only',
      status_completed: 'Completed',
      status_overdue: 'Overdue',
      sort_due: 'Sort by Due Date',
      sort_priority: 'Sort by Priority',
      sort_name: 'Sort by Name',
      task_name: 'Task Name',
      category: 'Category',
      due_date: 'Due Date',
      days_left: 'Days Left',
      priority: 'Priority',
      actions: 'Actions',
      no_tasks_title: 'No tasks scheduled',
      no_tasks_desc: 'Stay on track by adding your urgent tasks and projects.',
      create_first_task: '+ Add First Task',
      total_income: 'Total Income',
      active_streams: 'active streams',
      total_expenses: 'Total Expenses',
      actual_spent: 'Actual spent this month',
      net_balance: 'Net Balance',
      savings_buffer: 'Discretionary / Savings buffer',
      savings_rate: 'Savings Rate',
      of_monthly_income: 'Of monthly income',
      budget_categories: 'Expense Categories vs Budget',
      add_category: 'Expense Cat',
      budgeted: 'Budget',
      actual: 'Actual',
      remaining: 'Remaining',
      usage: 'Usage',
      no_categories_title: 'No expense categories',
      no_categories_desc: 'Set up budgets for housing, groceries, and subscriptions.',
      expense_breakdown: 'Expense Structure',
      income_streams: 'Income Streams',
      add_income: 'Income',
      source: 'Source',
      planned: 'Planned',
      status: 'Status',
      no_income_title: 'No income streams recorded',
      recurring_subs: 'Recurring Subscriptions',
      add_sub: 'Subscription',
      no_subs_title: 'No active subscriptions',
      settings_title: 'Settings & Profile',
      language: 'Language',
      language_desc: 'Select interface language',
      theme: 'Theme',
      theme_desc: 'Dark or light theme',
      data_management: 'Data & Storage',
      data_desc: 'Export or import your workspace in JSON format',
      export_backup: 'Export Backup',
      import_backup: 'Import Backup',
      clear_all_data: 'Clear Storage',
      clear_desc: 'Erase all records and start fresh',
      clear_btn: 'Clear All',
      modal_add_habit: 'New Habit',
      habit_name: 'Habit Name',
      emoji_icon: 'Emoji Icon',
      quick_pick: 'Quick Pick:',
      cat_mindfulness: 'Mindfulness & Balance',
      cat_productivity: 'Productivity & Focus',
      cat_learning: 'Learning & Career',
      cancel: 'Cancel',
      save: 'Save',
      modal_add_task: 'New Task',
      task_title: 'Task Title',
      notes: 'Notes / Details',
      pri_urgent: 'Urgent',
      pri_high: 'High',
      pri_medium: 'Medium',
      pri_low: 'Low',
      modal_add_expense: 'Expense Category',
      category_name: 'Category Name',
      modal_add_income: 'Add Income Stream',
      source_name: 'Source Name',
      received: 'Received',
      pending: 'Pending',
      modal_add_sub: 'Add Subscription',
      service_name: 'Service / Tool',
      monthly_cost: 'Monthly Cost ($)',
      billing_day: 'Billing Day',
      // 8-Step Tour Strings
      tour_1_title: 'Welcome to Habit',
      tour_1_desc: 'Welcome to Habit! Your workspace starts with a pristine clean slate, free of mock clutter, ready for your real goals.',
      tour_2_title: 'Create Your Habits',
      tour_2_desc: 'Click "+ New Habit" to create custom routines with emojis, frequency goals, and categories.',
      tour_3_title: 'Dynamic Calendar Matrix',
      tour_3_desc: 'Click checkboxes across days. Column count adapts dynamically to the selected month (28, 29, 30, or 31).',
      tour_4_title: 'Momentum & Wave Analytics',
      tour_4_desc: 'Track your daily completion peaks on the wave spline and view your overall monthly score ring.',
      tour_5_title: 'Module Navigation Tabs',
      tour_5_desc: 'Effortlessly switch between your Habits, Task Manager, and Personal Budget.',
      tour_6_title: 'Tasks & Deadlines',
      tour_6_desc: 'Manage urgent to-dos with auto-calculated "Days Left" badges, priority flags, and quick search.',
      tour_7_title: 'Budget & Subscriptions',
      tour_7_desc: 'Track cashflow, category variance bars, expense breakdown charts, and recurring SaaS payments.',
      tour_8_title: 'Settings & Storage',
      tour_8_desc: 'Switch between Russian & English, toggle Dark/Light themes, or manage your JSON backups.',
      faq_title: 'Frequently Asked Questions (FAQ)',
      faq_q1: 'How do I create and edit custom habits?',
      faq_a1: 'Click "+ New Habit" in the top bar. Pick a preset (Reading, Gym, Water, Meditation) or customize your title, emoji icon, dynamic row accent color, duration goal, and day-of-week schedule.',
      faq_q2: 'How does the dynamic wave chart calculate my progress?',
      faq_a2: 'The dynamic spline wave chart calculates daily habit completions across the active month, highlighting your momentum peaks and consistency in real time.',
      faq_q3: 'Where is my data stored, and how does cloud sync work?',
      faq_a3: 'By default, your data is saved locally in browser localStorage without 4KB limits. When connecting Firebase, your workspace automatically syncs to Cloud Firestore across your devices.',
      faq_q4: 'Can I export or reset my progress?',
      faq_a4: 'Use "Export Backup" to save a full JSON snapshot of your data. "Clear All Data" erases local records and resets the workspace to a pristine clean slate.',
      support_title: 'Support & Helpdesk',
      support_tg_heading: 'Telegram Support',
      support_desc: 'Questions, feature suggestions, or feedback',
      support_tg_btn: 'Chat on Telegram',
      share_title: 'Share Habit',
      share_desc: 'Share Habit with friends and colleagues to boost daily momentum',
      share_btn: 'Share',
      about_summary: 'Minimalist hybrid habit tracker, task manager, and personal finance dashboard.',
      privacy_link: 'Privacy Policy',
      terms_link: 'Terms of Service',
      google_soon: '❌ Soon',
      fb_settings_title: 'Cloud Sync & Firebase',
      fb_config_heading: 'Firebase Cloud Config',
      fb_config_sub: 'Credentials for cross-device synchronization',
      paste_json_btn: 'Paste JSON',
      fb_save_btn: 'Save & Connect',
      fb_reset_btn: 'Reset',
      fb_status_connected: '🟢 Connected',
      fb_status_offline: '⚪ Offline',
      layout_mode: 'Display Layout',
      layout_mode_desc: 'Optimize interface for mobile devices or desktop',
      layout_mobile: '📱 Mobile',
      layout_desktop: '💻 Desktop',
      layout_auto: '⚡ Auto',
      onboarding_welcome: 'Welcome to Habit',
      onboarding_subtitle: 'Choose your preferred display layout for this device',
      onboarding_mobile_title: 'Mobile Mode',
      onboarding_mobile_desc: 'Bottom navigation bar, quick FAB, and touch-friendly density',
      onboarding_desktop_title: 'Desktop Mode',
      onboarding_desktop_desc: 'Classic top navigation bar, expanded grid view, and dense tables',
      onboarding_login_btn: 'Sign In via Cloud Sync / Account',
      dev_mode_title: 'Developer Mode',
      dev_mode_desc: 'QA console, time simulation & live state inspector',
      dev_activate_btn: 'Activate',
      dev_open_btn: 'Open Panel',
      dev_modal_title: 'Developer Access',
      dev_modal_subtitle: 'Enter access passcode to unlock developer console and testing tools',
      dev_code_label: 'Secret Code',
      dev_code_error: 'Invalid access code. Please try again.',
      unlock_btn: 'Confirm',
      cancel: 'Cancel'
    }
  };

  const MONTH_NAMES = {
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  // ========================================================================
  // FIREBASE CONFIGURATION & HYBRID CLOUD SYNC MODULE
  // ========================================================================
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDgQcYtqcEY5F5s9a2dr9V-igvXsz4JgZU",
    authDomain: "habit-b2d0a.firebaseapp.com",
    projectId: "habit-b2d0a",
    storageBucket: "habit-b2d0a.firebasestorage.app",
    messagingSenderId: "102979641225",
    appId: "1:102979641225:web:38484c9306f6d3aeb28b58",
    measurementId: "G-VLB18BZNBR"
  };

  let firebaseConfig = (() => {
    try {
      const saved = localStorage.getItem('habit_app_fb_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.apiKey) {
          return Object.assign({}, DEFAULT_FIREBASE_CONFIG, parsed);
        }
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_FIREBASE_CONFIG);
  })();

  let firebaseApp = null;
  let firebaseAuth = null;
  let firestoreDb = null;
  let currentAuthUser = null;
  let isFirebaseReady = false;
  let syncDebounceTimer = null;
  let lastSyncTimestamp = null;

  function isFirebaseConfigured() {
    return Boolean(
      typeof firebase !== 'undefined' &&
      firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== "YOUR_API_KEY" &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== "YOUR_PROJECT_ID"
    );
  }

  function initFirebase() {
    try {
      if (isFirebaseConfigured()) {
        if (!firebase.apps.length) {
          firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
          firebaseApp = firebase.app();
        }
        firebaseAuth = firebase.auth();
        firestoreDb = firebase.firestore();
        isFirebaseReady = true;

        firebaseAuth.onAuthStateChanged(handleAuthStateChanged);
        console.log('[Firebase] Cloud sync initialized successfully.');
      } else {
        console.log('[Firebase] Offline / Guest mode active (Configure firebaseConfig in Settings for cloud sync).');
        updateCloudUI();
      }
    } catch (err) {
      console.warn('[Firebase] Initialization error (running in Guest mode):', err);
      updateCloudUI();
    }
    updateSettingsFbStatus();
  }

  async function reinitFirebase(newConfig) {
    try {
      firebaseConfig = Object.assign({}, newConfig);
      localStorage.setItem('habit_app_fb_config', JSON.stringify(firebaseConfig));

      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        await Promise.all(firebase.apps.map(app => app.delete().catch(() => {})));
      }

      firebaseApp = null;
      firebaseAuth = null;
      firestoreDb = null;
      currentAuthUser = null;
      isFirebaseReady = false;

      initFirebase();
      updateCloudUI();
      updateDevFbStatus();
      populateDevFbForm();
      return true;
    } catch (err) {
      console.error('[Firebase] Reinit error:', err);
      return false;
    }
  }

  function populateDevFbForm() {
    const elApiKey = document.getElementById('devFbApiKey') || document.getElementById('fbApiKey');
    const elAuthDomain = document.getElementById('devFbAuthDomain') || document.getElementById('fbAuthDomain');
    const elProjectId = document.getElementById('devFbProjectId') || document.getElementById('fbProjectId');
    const elStorageBucket = document.getElementById('devFbStorageBucket') || document.getElementById('fbStorageBucket');
    const elSenderId = document.getElementById('devFbMessagingSenderId') || document.getElementById('fbMessagingSenderId');
    const elAppId = document.getElementById('devFbAppId') || document.getElementById('fbAppId');

    if (elApiKey) elApiKey.value = firebaseConfig.apiKey || '';
    if (elAuthDomain) elAuthDomain.value = firebaseConfig.authDomain || '';
    if (elProjectId) elProjectId.value = firebaseConfig.projectId || '';
    if (elStorageBucket) elStorageBucket.value = firebaseConfig.storageBucket || '';
    if (elSenderId) elSenderId.value = firebaseConfig.messagingSenderId || '';
    if (elAppId) elAppId.value = firebaseConfig.appId || '';
  }

  function updateDevFbStatus() {
    const pill = document.getElementById('devFbStatusPill') || document.getElementById('settingsFbStatusPill');
    if (pill) {
      const configured = isFirebaseConfigured();
      pill.className = `fb-status-pill ${configured ? 'connected' : 'offline'}`;
      pill.textContent = configured
        ? (state.prefs.lang === 'ru' ? '🟢 Подключено' : '🟢 Connected')
        : (state.prefs.lang === 'ru' ? '⚪ Офлайн' : '⚪ Offline');
    }
  }

  function populateSettingsFbForm() {
    populateDevFbForm();
  }

  function updateSettingsFbStatus() {
    updateDevFbStatus();
  }

  function parseFirebaseConfigInput(text) {
    if (!text || typeof text !== 'string') return null;
    let clean = text.trim();
    clean = clean.replace(/^(const|let|var)\s+\w+\s*=\s*/i, '');
    clean = clean.replace(/;\s*$/, '');

    try {
      const parsed = JSON.parse(clean);
      if (parsed && typeof parsed === 'object' && (parsed.apiKey || parsed.projectId)) {
        return parsed;
      }
    } catch (e) {}

    try {
      const result = {};
      const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];
      keys.forEach(k => {
        const regex = new RegExp(`['"]?${k}['"]?\\s*:\\s*['"\`]([^'"\`]+)['"\`]`);
        const match = clean.match(regex);
        if (match && match[1]) {
          result[k] = match[1].trim();
        }
      });
      if (result.apiKey || result.projectId) {
        return result;
      }
    } catch (e) {}

    return null;
  }

  function setSyncStatus(status) {
    const dot = document.getElementById('headerSyncDot');
    if (dot) {
      dot.className = `sync-dot ${status}`;
    }
    updateSyncTimestampLabel();
  }

  function safeRenderIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      try {
        lucide.createIcons();
      } catch (e) {
        console.warn('lucide.createIcons warning:', e);
      }
    }
  }

  function updateSyncTimestampLabel() {
    const timeEl = document.getElementById('authLastSyncTime');
    if (timeEl) {
      if (lastSyncTimestamp) {
        const timeStr = lastSyncTimestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        timeEl.textContent = `Синхронизировано в ${timeStr}`;
      } else {
        timeEl.textContent = 'Синхронизация активна';
      }
    }
  }

  function updateCloudUI() {
    const dot = document.getElementById('headerSyncDot');
    const label = document.getElementById('headerSyncLabel');
    const loggedInView = document.getElementById('authLoggedInView');
    const guestView = document.getElementById('authGuestView');
    const userEmail = document.getElementById('authUserEmail');
    const userAvatar = document.getElementById('authUserAvatar');
    const configStatus = document.getElementById('firebaseConfigStatusText');

    if (configStatus) {
      if (isFirebaseConfigured()) {
        configStatus.innerHTML = `<span class="text-emerald">🟢 Firebase настроен: ${firebaseConfig.projectId}</span>`;
      } else {
        configStatus.innerHTML = `<span class="text-amber">🟡 Ожидание ключей: укажите apiKey и projectId в настройках Firebase</span>`;
      }
    }

    if (currentAuthUser) {
      if (dot) dot.className = 'sync-dot synced';
      if (label) {
        const shortName = currentAuthUser.displayName || (currentAuthUser.email ? currentAuthUser.email.split('@')[0] : 'Облако');
        label.textContent = shortName;
      }
      if (loggedInView) loggedInView.style.display = 'block';
      if (guestView) guestView.style.display = 'none';
      if (userEmail) userEmail.textContent = currentAuthUser.email || currentAuthUser.displayName || 'Google User';
      if (userAvatar) {
        const letter = (currentAuthUser.displayName || currentAuthUser.email || 'U')[0].toUpperCase();
        userAvatar.textContent = letter;
      }
    } else {
      if (dot) dot.className = 'sync-dot offline';
      if (label) label.textContent = 'Облако';
      if (loggedInView) loggedInView.style.display = 'none';
      if (guestView) guestView.style.display = 'block';
    }
    updateSettingsFbStatus();
  }

  async function handleAuthStateChanged(user) {
    currentAuthUser = user;
    updateCloudUI();
    if (user) {
      await syncOnLogin(user);
    }
  }

  async function syncOnLogin(user) {
    if (!firestoreDb || !user) return;
    setSyncStatus('syncing');
    try {
      const docRef = firestoreDb.collection('users').doc(user.uid).collection('data').doc('state');
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const cloudData = docSnap.data();
        if (cloudData) {
          // Hydrate state from cloud
          if (Array.isArray(cloudData.habits)) state.habits = cloudData.habits;
          if (Array.isArray(cloudData.tasks)) state.tasks = cloudData.tasks;
          if (cloudData.finances) state.finances = cloudData.finances;
          if (cloudData.prefs) state.prefs = Object.assign({}, DEFAULT_PREFS, cloudData.prefs);

          // Cache to localStorage for offline readiness
          Storage.set(STORAGE_KEYS.HABITS, state.habits);
          Storage.set(STORAGE_KEYS.TASKS, state.tasks);
          Storage.set(STORAGE_KEYS.FINANCE, state.finances);
          Storage.set(STORAGE_KEYS.SETTINGS, state.prefs);

          // Render UI
          applyTheme(state.prefs.theme || 'dark');
          applyLanguage(state.prefs.lang || 'ru');
          renderHabitTrackerFull();
          renderTasks();
          renderFinance();

          lastSyncTimestamp = new Date();
          setSyncStatus('synced');
          showToast(state.prefs.lang === 'ru' ? 'Данные синхронизированы из облака! ☁️' : 'Synced from cloud!', 'success');
          return;
        }
      }

      // First-time login: Upload existing local guest data to Firestore
      await pushStateToCloud(user);
      showToast(state.prefs.lang === 'ru' ? 'Локальные данные сохранены в облако! ☁️' : 'Local data synced to cloud!', 'success');
    } catch (err) {
      console.error('[Firebase] syncOnLogin error:', err);
      setSyncStatus('offline');
      showToast(state.prefs.lang === 'ru' ? 'Ошибка загрузки данных из облака' : 'Error loading cloud data', 'error');
    }
  }

  async function pushStateToCloud(user = currentAuthUser) {
    if (!firestoreDb || !user) return;
    setSyncStatus('syncing');
    try {
      const docRef = firestoreDb.collection('users').doc(user.uid).collection('data').doc('state');
      await docRef.set({
        habits: state.habits,
        tasks: state.tasks,
        finances: state.finances,
        prefs: state.prefs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      lastSyncTimestamp = new Date();
      setSyncStatus('synced');
    } catch (err) {
      console.error('[Firebase] pushStateToCloud error:', err);
      setSyncStatus('offline');
    }
  }

  async function pullStateFromCloud(user = currentAuthUser) {
    if (!firestoreDb || !user) {
      showToast('Требуется подключение к Firebase', 'warning');
      return;
    }
    await syncOnLogin(user);
  }

  function triggerCloudSyncDebounced() {
    if (!currentAuthUser || !firestoreDb) return;
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    setSyncStatus('syncing');
    syncDebounceTimer = setTimeout(() => {
      pushStateToCloud(currentAuthUser);
    }, 1000);
  }

  // ========================================================================
  // LOCALSTORAGE ENGINE (BULLETPROOF & CROSS-PROTOCOL COMPATIBLE)
  // ========================================================================
  const STORAGE_KEYS = {
    HABITS: 'habit_app_habits',
    TASKS: 'habit_app_tasks',
    FINANCE: 'habit_app_finances',
    SETTINGS: 'habit_app_settings',
    FB_CONFIG: 'habit_app_fb_config',
    DEV_MODE: 'habit_app_dev_mode',
    UI_MODE: 'habit_app_ui_mode'
  };

  const Storage = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null || raw === undefined) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[Storage.get] Error reading "${key}":`, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[Storage.set] Error saving "${key}":`, e);
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn(`[Storage.remove] Error removing "${key}":`, e);
        return false;
      }
    },
    clear() {
      try {
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        return true;
      } catch (e) {
        console.warn('[Storage.clear] Error clearing storage:', e);
        return false;
      }
    }
  };

  // One-time graceful migration from legacy cookies if localStorage is empty
  function migrateFromLegacyCookies() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.HABITS) && !localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        const getCookieFallback = (name) => {
          const cname = name + "=";
          const decoded = decodeURIComponent(document.cookie);
          const ca = decoded.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cname) === 0) {
              try { return JSON.parse(c.substring(cname.length)); } catch (err) { }
            }
          }
          return null;
        };

        const legacyHabits = getCookieFallback('habit_records');
        const legacyTasks = getCookieFallback('habit_tasks');
        const legacyFinance = getCookieFallback('habit_finance');
        const legacyPrefs = getCookieFallback('habit_prefs');

        if (legacyHabits) Storage.set(STORAGE_KEYS.HABITS, legacyHabits);
        if (legacyTasks) Storage.set(STORAGE_KEYS.TASKS, legacyTasks);
        if (legacyFinance) Storage.set(STORAGE_KEYS.FINANCE, legacyFinance);
        if (legacyPrefs) Storage.set(STORAGE_KEYS.SETTINGS, legacyPrefs);
      }
    } catch (e) {
      // Silent fallback
    }
  }

  migrateFromLegacyCookies();

  // --- Pure Clean Slate Initial Defaults ---
  const DEFAULT_PREFS = {
    lang: 'ru',
    theme: 'dark',
    uiMode: 'auto',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    tourCompleted: false
  };

  const rawSavedPrefs = Storage.get(STORAGE_KEYS.SETTINGS, null);
  const nowInit = new Date();
  const initialPrefs = Object.assign({}, DEFAULT_PREFS, rawSavedPrefs || {});
  if (typeof initialPrefs.selectedMonth !== 'number' || isNaN(initialPrefs.selectedMonth)) {
    initialPrefs.selectedMonth = nowInit.getMonth();
  }
  if (typeof initialPrefs.selectedYear !== 'number' || isNaN(initialPrefs.selectedYear)) {
    initialPrefs.selectedYear = nowInit.getFullYear();
  }

  let state = {
    prefs: initialPrefs,
    habits: Storage.get(STORAGE_KEYS.HABITS, []),
    tasks: Storage.get(STORAGE_KEYS.TASKS, []),
    finances: (() => {
      const saved = Storage.get(STORAGE_KEYS.FINANCE, null);
      if (saved && !saved.transactions) {
        return { transactions: [], subscriptions: saved.subscriptions || [] };
      }
      return saved || { transactions: [], subscriptions: [] };
    })()
  };

  function saveAll() {
    Storage.set(STORAGE_KEYS.SETTINGS, state.prefs);
    Storage.set(STORAGE_KEYS.HABITS, state.habits);
    Storage.set(STORAGE_KEYS.TASKS, state.tasks);
    Storage.set(STORAGE_KEYS.FINANCE, state.finances);
    triggerCloudSyncDebounced();
  }

  function savePrefs() {
    Storage.set(STORAGE_KEYS.SETTINGS, state.prefs);
    triggerCloudSyncDebounced();
  }

  function saveHabits() {
    Storage.set(STORAGE_KEYS.HABITS, state.habits);
    triggerCloudSyncDebounced();
  }

  function saveTasks() {
    Storage.set(STORAGE_KEYS.TASKS, state.tasks);
    triggerCloudSyncDebounced();
  }

  function saveFinance() {
    Storage.set(STORAGE_KEYS.FINANCE, state.finances);
    triggerCloudSyncDebounced();
  }

  // --- Translation Helper ---
  function t(key) {
    const lang = state.prefs.lang || 'ru';
    return (I18N[lang] && I18N[lang][key]) || (I18N.ru && I18N.ru[key]) || I18N.en[key] || key;
  }

  // --- High Performance DOM Cache & Debounce ---
  const _domCache = new Map();
  function getEl(id) {
    let el = _domCache.get(id);
    if (!el || !el.isConnected) {
      el = document.getElementById(id);
      if (el) _domCache.set(id, el);
    }
    return el;
  }

  function debounce(fn, delay = 150) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function applyLanguage(lang) {
    state.prefs.lang = lang;
    savePrefs();

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    document.querySelectorAll('#langSegmentControl .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    updateMonthSelectorOptions(lang);
    updateDevSettingsButton(localStorage.getItem(STORAGE_KEYS.DEV_MODE) === 'true');
    renderHabitTrackerFull();
    renderTasks();
    renderFinance();
  }

  // --- Theme Management ---
  function applyTheme(theme) {
    state.prefs.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    savePrefs();

    document.querySelectorAll('#themeSegmentControl .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });

    renderHabitWaveChart();
    renderExpenseDonutChart();
  }

  // --- Layout Mode Management (Mobile / Desktop / Auto) ---
  function applyLayoutMode(mode) {
    if (!mode) mode = 'auto';
    state.prefs.uiMode = mode;
    savePrefs();
    Storage.set(STORAGE_KEYS.UI_MODE, mode);

    document.body.classList.remove('layout-mobile', 'layout-desktop', 'layout-auto');
    document.body.classList.add(`layout-${mode}`);

    document.querySelectorAll('#layoutSegmentControl .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layout') === mode);
    });

    // Re-render wave chart and donut chart smoothly to match container dimensions
    setTimeout(() => {
      renderHabitWaveChart();
      renderExpenseDonutChart();
    }, 60);
  }

  function selectLayoutFromOnboarding(mode) {
    applyLayoutMode(mode);
    const modal = document.getElementById('onboardingLayoutModal');
    if (modal) {
      modal.classList.remove('active');
    }
    const modeLabel = mode === 'mobile'
      ? (state.prefs.lang === 'ru' ? 'Режим для телефонов активирован 📱' : 'Mobile Layout activated 📱')
      : (state.prefs.lang === 'ru' ? 'Режим для ПК активирован 💻' : 'Desktop Layout activated 💻');
    showToast(modeLabel, 'success');
  }

  function checkLayoutOnboarding() {
    const savedUiMode = Storage.get(STORAGE_KEYS.UI_MODE, null);
    if (!savedUiMode) {
      const modal = document.getElementById('onboardingLayoutModal');
      if (modal) {
        modal.classList.add('active');
      }
      document.body.classList.remove('layout-mobile', 'layout-desktop', 'layout-auto');
      document.body.classList.add('layout-auto');
    } else {
      applyLayoutMode(savedUiMode);
    }
  }

  // --- Toast Notification System ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'check-circle-2';
    if (type === 'info') icon = 'info';
    if (type === 'error') icon = 'alert-triangle';

    toast.innerHTML = `
          <i data-lucide="${icon}" class="icon-base"></i>
          <span>${message}</span>
        `;
    container.appendChild(toast);
    safeRenderIcons();

    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.25s forwards';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // ========================================================================
  // TIME-TRAVEL & VIRTUAL CLOCK ENGINE (QA & SIMULATION)
  // ========================================================================
  let virtualTimeOffsetMs = 0; // 0 = real time

  function triggerHaptic(duration = 12) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(duration); } catch (e) {}
    }
  }

  function getNow() {
    if (virtualTimeOffsetMs === 0) return new Date();
    return new Date(Date.now() + virtualTimeOffsetMs);
  }

  function getTodayString() {
    const d = getNow();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function setVirtualDate(targetDate) {
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) return;
    const realNow = Date.now();
    virtualTimeOffsetMs = targetDate.getTime() - realNow;
    onTimeTravelUpdated();
  }

  function shiftVirtualTime(days = 0, months = 0) {
    const cur = getNow();
    if (months !== 0) {
      cur.setMonth(cur.getMonth() + months);
    }
    if (days !== 0) {
      cur.setDate(cur.getDate() + days);
    }
    setVirtualDate(cur);
  }

  function resetVirtualTime() {
    virtualTimeOffsetMs = 0;
    onTimeTravelUpdated();
  }

  function onTimeTravelUpdated() {
    const currentVirtual = getNow();
    // Synchronize active month and year with virtual date
    state.prefs.selectedMonth = currentVirtual.getMonth();
    state.prefs.selectedYear = currentVirtual.getFullYear();
    savePrefs();

    updateMonthSelectorOptions(state.prefs.lang || 'ru');
    renderHabitTrackerFull();
    renderTasks();
    renderFinance();
    if (activeTab === 'developer') {
      renderDevDashboard();
    }
  }

  // ========================================================================
  // DYNAMIC CALENDAR & MONTH LENGTH ENGINE
  // ========================================================================
  function getDaysInActiveMonth() {
    const curNow = (typeof getNow === 'function') ? getNow() : new Date();
    const year = (state && state.prefs && Number.isInteger(state.prefs.selectedYear))
      ? state.prefs.selectedYear
      : curNow.getFullYear();
    const month = (state && state.prefs && Number.isInteger(state.prefs.selectedMonth))
      ? state.prefs.selectedMonth
      : curNow.getMonth();
    const d = new Date(year, month + 1, 0).getDate();
    return (Number.isInteger(d) && d >= 28 && d <= 31) ? d : 30;
  }

  function getMonthKey() {
    const curNow = (typeof getNow === 'function') ? getNow() : new Date();
    const y = (state && state.prefs && Number.isInteger(state.prefs.selectedYear)) ? state.prefs.selectedYear : curNow.getFullYear();
    const m = (state && state.prefs && Number.isInteger(state.prefs.selectedMonth)) ? state.prefs.selectedMonth : curNow.getMonth();
    return `${y}-${m}`;
  }

  function updateMonthSelectorOptions(lang) {
    const select = document.getElementById('monthSelector');
    if (!select) return;
    const currentVal = state.prefs.selectedMonth;
    const names = MONTH_NAMES[lang] || MONTH_NAMES.ru;
    select.innerHTML = '';
    names.forEach((name, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = name;
      if (idx === currentVal) opt.selected = true;
      select.appendChild(opt);
    });

    const yearSelect = document.getElementById('yearSelector');
    if (yearSelect) yearSelect.value = state.prefs.selectedYear;
  }

  // ========================================================================
  // MODULE A: HABIT TRACKER (DYNAMIC DAYS & ZERO-JANK IN-PLACE)
  // ========================================================================
  let waveChartInstance = null;

  function renderHabitTrackerFull() {
    const tbody = document.getElementById('habitTableBody');
    const foot = document.getElementById('habitTableFoot');
    const weekHeaderRow = document.getElementById('habitWeekHeaderRow');
    const dayHeaderRow = document.getElementById('habitDayHeaderRow');

    tbody.innerHTML = '';
    weekHeaderRow.innerHTML = '';
    dayHeaderRow.innerHTML = '';

    const daysInMonth = getDaysInActiveMonth();
    const monthKey = getMonthKey();
    const todayDate = getNow();
    const isCurrentMonth = todayDate.getMonth() === state.prefs.selectedMonth && todayDate.getFullYear() === state.prefs.selectedYear;
    const currentDayNumber = isCurrentMonth ? todayDate.getDate() : -1;

    // Update Wave span label
    const waveDaysSpan = document.getElementById('waveChartDaysSpan');
    if (waveDaysSpan) {
      waveDaysSpan.textContent = `${t('days_1_prefix')}${daysInMonth}`;
    }

    // 1. Render Dynamic Week Group Header Row
    let weekHeadersHtml = `<th class="sticky-habit-col sticky-habit-pad text-left">${t('habits_routines')}</th>`;
    weekHeadersHtml += `<th colspan="7" class="week-col-1">${t('week_1')}</th>`;
    weekHeadersHtml += `<th colspan="7" class="week-col-2">${t('week_2')}</th>`;
    weekHeadersHtml += `<th colspan="7" class="week-col-3">${t('week_3')}</th>`;
    weekHeadersHtml += `<th colspan="7" class="week-col-4">${t('week_4')}</th>`;

    if (daysInMonth > 28) {
      const extraDays = daysInMonth - 28;
      weekHeadersHtml += `<th colspan="${extraDays}" class="week-col-extra">${t('week_extra')} (29–${daysInMonth})</th>`;
    }
    weekHeadersHtml += `<th class="habit-summary-col text-center">${t('progress')}</th>`;
    weekHeaderRow.innerHTML = weekHeadersHtml;

    // 2. Render Day Numbers Header Row
    let dayHeadersHtml = `<th class="sticky-habit-col sticky-habit-pad text-left">${t('category_target')}</th>`;
    for (let d = 1; d <= daysInMonth; d++) {
      let colClass = '';
      if (d === 1) colClass = 'week-col-1';
      else if (d === 8) colClass = 'week-col-2';
      else if (d === 15) colClass = 'week-col-3';
      else if (d === 22) colClass = 'week-col-4';
      else if (d === 29) colClass = 'week-col-extra';

      // Day of week calculation
      const dateObj = new Date(state.prefs.selectedYear, state.prefs.selectedMonth, d);
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) colClass += ' is-weekend-column';
      if (d === currentDayNumber) colClass += ' is-today-column';

      dayHeadersHtml += `<th class="${colClass.trim()}" ${d === currentDayNumber ? 'title="Сегодня"' : ''}>${d}</th>`;
    }
    dayHeadersHtml += `<th class="habit-summary-col text-center">${t('rate')}</th>`;
    dayHeaderRow.innerHTML = dayHeadersHtml;

    // 3. Handle Empty State for Habits
    if (!state.habits || state.habits.length === 0) {
      foot.style.display = 'none';
      const emptyTr = document.createElement('tr');
      emptyTr.innerHTML = `
            <td colspan="${daysInMonth + 2}" class="td-empty-wrap">
              <div class="empty-state-card empty-state-frameless">
                <div class="empty-icon-wrap">
                  <i data-lucide="sparkles" class="icon-xl text-accent"></i>
                </div>
                <h3>${t('no_habits_title')}</h3>
                <p>${t('no_habits_desc')}</p>
                <button class="btn-primary" id="addFirstHabitBtn">
                  <i data-lucide="plus" class="icon-sm"></i>
                  <span>${t('create_first_habit')}</span>
                </button>
              </div>
            </td>
          `;
      tbody.appendChild(emptyTr);
      document.getElementById('addFirstHabitBtn').onclick = () => openHabitModal();
    } else {
      foot.style.display = 'table-footer-group';

      // Render Habit Rows with DocumentFragment for zero reflow overhead
      const habitFrag = document.createDocumentFragment();
      state.habits.forEach(habit => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-habit-id', habit.id);

        const accentColor = habit.color || '#6366f1';
        const accentGlow = hexToRgba(accentColor, 0.35);
        const accentSubtle = hexToRgba(accentColor, 0.12);
        tr.style.setProperty('--habit-accent', accentColor);
        tr.style.setProperty('--habit-accent-glow', accentGlow);
        tr.style.setProperty('--habit-accent-subtle', accentSubtle);

        const titleTd = document.createElement('td');
        titleTd.className = 'sticky-habit-col';
        titleTd.innerHTML = `
              <div class="habit-cell-title">
                <div class="habit-lead">
                  <span class="habit-emoji-box">${habit.emoji || '⚡'}</span>
                  <div class="habit-text-stack">
                    <span class="habit-name-text" title="${habit.title}">${habit.title}</span>
                    <span class="habit-cat-text">${habit.category}</span>
                  </div>
                </div>
                <div class="habit-actions-hover">
                  <button class="btn-row-action edit-habit-btn" data-id="${habit.id}" title="Редактировать">
                    <i data-lucide="edit-2" class="icon-xs"></i>
                  </button>
                  <button class="btn-row-action delete delete-habit-btn" data-id="${habit.id}" title="Удалить">
                    <i data-lucide="trash-2" class="icon-xs"></i>
                  </button>
                </div>
              </div>
            `;
        tr.appendChild(titleTd);

        const monthChecks = (habit.checks && habit.checks[monthKey]) || [];
        let completedCount = 0;

        // Day Checkbox Cells
        for (let d = 1; d <= daysInMonth; d++) {
          const isChecked = monthChecks.includes(d);
          if (isChecked) completedCount++;

          const dayTd = document.createElement('td');
          if (d === 1) dayTd.className = 'week-col-1';
          else if (d === 8) dayTd.className = 'week-col-2';
          else if (d === 15) dayTd.className = 'week-col-3';
          else if (d === 22) dayTd.className = 'week-col-4';
          else if (d === 29) dayTd.className = 'week-col-extra';

          const dateObj = new Date(state.prefs.selectedYear, state.prefs.selectedMonth, d);
          const dayOfWeek = dateObj.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) dayTd.classList.add('is-weekend-column');
          if (d === currentDayNumber) dayTd.classList.add('is-today-column');

          dayTd.innerHTML = `
                <div class="habit-check-cell ${isChecked ? 'checked' : ''}" data-habit-id="${habit.id}" data-day="${d}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              `;
          tr.appendChild(dayTd);
        }

        // Progress Bar Cell
        const pct = Math.round((completedCount / daysInMonth) * 100);
        const summaryTd = document.createElement('td');
        summaryTd.className = 'habit-summary-col';
        summaryTd.innerHTML = `
              <div class="progress-bar-container">
                <div class="progress-track">
                  <div class="progress-fill" id="prog-bar-${habit.id}" style="width: ${pct}%; background: ${habit.color || 'var(--accent-primary)'};"></div>
                </div>
                <span class="progress-percent-label" id="prog-pct-${habit.id}">${pct}%</span>
              </div>
            `;
        tr.appendChild(summaryTd);

        habitFrag.appendChild(tr);
      });
      tbody.appendChild(habitFrag);

      // Render Daily Tally Footer Cells
      renderDailyTallyFooter(daysInMonth, monthKey, currentDayNumber);
    }

    renderMobileHabitCards();
    updateMetricsAndDonut();
    renderHabitWaveChart();
    bindHabitRowActions();
    safeRenderIcons();
    applyHabitAccentColors();
  }

  function calculateHabitStreak(habit) {
    const monthKey = getMonthKey();
    const checks = (habit.checks && habit.checks[monthKey]) || [];
    const today = getNow();
    const currentDay = today.getDate();
    let streak = 0;
    for (let d = currentDay; d >= 1; d--) {
      if (checks.includes(d)) {
        streak++;
      } else if (d < currentDay) {
        break;
      }
    }
    return streak;
  }

  function renderMobileHabitCards() {
    const container = document.getElementById('mobileHabitsCardsList');
    if (!container) return;
    container.innerHTML = '';

    if (!state.habits || state.habits.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon-wrap"><i data-lucide="target" class="icon-xl text-accent"></i></div>
          <h3>${t('no_habits_title')}</h3>
          <p>${t('no_habits_desc')}</p>
          <button class="btn-primary" onclick="document.getElementById('addHabitBtn').click()">
            <i data-lucide="plus" class="icon-sm"></i>
            <span>${t('create_first_habit')}</span>
          </button>
        </div>
      `;
      return;
    }

    const daysInMonth = getDaysInActiveMonth();
    const monthKey = getMonthKey();
    const now = getNow();
    const isCurrentMonth = now.getMonth() === state.prefs.selectedMonth && now.getFullYear() === state.prefs.selectedYear;
    const currentDayNumber = isCurrentMonth ? now.getDate() : 1;

    // 7 Days around currentDay (Mon - Sun of active week)
    const curDate = new Date(state.prefs.selectedYear, state.prefs.selectedMonth, currentDayNumber);
    const dayOfWeek = curDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStartDay = currentDayNumber + mondayOffset;

    const weekDays = [];
    const dayNamesShort = state.prefs.lang === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    for (let i = 0; i < 7; i++) {
      const dNum = weekStartDay + i;
      if (dNum >= 1 && dNum <= daysInMonth) {
        const dObj = new Date(state.prefs.selectedYear, state.prefs.selectedMonth, dNum);
        weekDays.push({
          day: dNum,
          dayName: dayNamesShort[dObj.getDay()],
          isToday: dNum === currentDayNumber && isCurrentMonth
        });
      }
    }

    const mobileFrag = document.createDocumentFragment();
    state.habits.forEach(habit => {
      const monthChecks = (habit.checks && habit.checks[monthKey]) || [];
      const completedCount = monthChecks.length;
      const rate = Math.round((completedCount / daysInMonth) * 100);
      const streak = calculateHabitStreak(habit);
      const isCheckedToday = monthChecks.includes(currentDayNumber);
      const accent = habit.color || '#6366f1';

      let stripHtml = '';
      weekDays.forEach(w => {
        const isChecked = monthChecks.includes(w.day);
        stripHtml += `
          <div class="mob-day-pill ${isChecked ? 'checked' : ''} ${w.isToday ? 'is-today' : ''}" data-habit-id="${habit.id}" data-day="${w.day}">
            <span class="mob-day-name">${w.dayName}</span>
            <span class="mob-day-num">${w.day}</span>
            <div class="mob-day-dot">✓</div>
          </div>
        `;
      });

      const card = document.createElement('div');
      card.className = 'mobile-habit-card';
      card.style.setProperty('--habit-accent', accent);
      card.style.setProperty('--habit-accent-glow', `${accent}44`);

      card.innerHTML = `
        <div class="mob-habit-header">
          <div class="mob-habit-icon-title">
            <span class="mob-habit-emoji">${habit.emoji || habit.icon || '⚡'}</span>
            <div>
              <h4 class="mob-habit-title">${habit.title}</h4>
              <div class="mob-habit-meta">
                <span class="mob-habit-cat-pill">${habit.category || 'General'}</span>
                ${habit.targetMin ? `<span class="mob-habit-duration">⏱️ ${habit.targetMin} мин</span>` : ''}
                ${habit.reminderTime ? `<span class="mob-habit-time">🔔 ${habit.reminderTime}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="mob-habit-actions">
            <button class="mob-action-icon edit-habit-btn" data-id="${habit.id}" title="Редактировать">
              <i data-lucide="edit-2" class="icon-sm"></i>
            </button>
            <button class="mob-action-icon delete-habit-btn" data-id="${habit.id}" title="Удалить">
              <i data-lucide="trash-2" class="icon-sm"></i>
            </button>
          </div>
        </div>

        <div class="mob-week-strip">
          ${stripHtml}
        </div>

        <div class="mob-habit-footer">
          <div class="mob-habit-progress-wrap">
            <div class="mob-habit-streak"><i data-lucide="flame" class="icon-xs text-amber"></i> ${streak} дн</div>
            <div class="mob-habit-bar">
              <div class="mob-habit-bar-fill" style="width: ${rate}%;"></div>
            </div>
            <span class="mob-habit-rate-text">${rate}%</span>
          </div>
          <button class="mob-quick-check-btn ${isCheckedToday ? 'checked' : ''}" data-habit-id="${habit.id}" data-day="${currentDayNumber}">
            <i data-lucide="${isCheckedToday ? 'check-circle-2' : 'circle'}" class="icon-sm"></i>
            <span>${isCheckedToday ? (state.prefs.lang === 'ru' ? 'Выполнено' : 'Done') : (state.prefs.lang === 'ru' ? 'Отметить' : 'Check')}</span>
          </button>
        </div>
      `;

      mobileFrag.appendChild(card);
    });
    container.appendChild(mobileFrag);

    container.querySelectorAll('.mob-day-pill').forEach(pill => {
      pill.onclick = () => {
        const habitId = pill.getAttribute('data-habit-id');
        const day = parseInt(pill.getAttribute('data-day'), 10);
        toggleHabitDayCheck(habitId, day);
      };
    });

    container.querySelectorAll('.mob-quick-check-btn').forEach(btn => {
      btn.onclick = () => {
        const habitId = btn.getAttribute('data-habit-id');
        const day = parseInt(btn.getAttribute('data-day'), 10);
        toggleHabitDayCheck(habitId, day);
      };
    });

    safeRenderIcons();
  }

  function toggleHabitDayCheck(habitId, day) {
    triggerHaptic(12);
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    const monthKey = getMonthKey();
    if (!habit.checks) habit.checks = {};
    if (!habit.checks[monthKey]) habit.checks[monthKey] = [];

    const idx = habit.checks[monthKey].indexOf(day);
    if (idx === -1) {
      habit.checks[monthKey].push(day);
    } else {
      habit.checks[monthKey].splice(idx, 1);
    }

    saveHabits();
    renderHabitTrackerFull();
  }

  function renderDailyTallyFooter(daysInMonth, monthKey, currentDayNumber) {
    const dailyTotalRow = document.getElementById('habitDailyTotalRow');
    dailyTotalRow.innerHTML = `
          <td class="sticky-habit-col sticky-habit-pad text-left text-accent font-semibold">
            <i data-lucide="bar-chart-2" class="icon-xs align-middle mr-xs"></i>
            <span>${t('daily_total')}</span>
          </td>
        `;

    for (let d = 1; d <= daysInMonth; d++) {
      let count = 0;
      state.habits.forEach(h => {
        const checks = (h.checks && h.checks[monthKey]) || [];
        if (checks.includes(d)) count++;
      });

      const td = document.createElement('td');
      if (d === 1) td.className = 'week-col-1';
      else if (d === 8) td.className = 'week-col-2';
      else if (d === 15) td.className = 'week-col-3';
      else if (d === 22) td.className = 'week-col-4';
      else if (d === 29) td.className = 'week-col-extra';

      if (d === currentDayNumber) td.classList.add('is-today-column');

      td.innerHTML = `<span class="daily-tally-badge ${getTallyHeatClass(count)}" id="tally-day-${d}">${count}</span>`;
      dailyTotalRow.appendChild(td);
    }

    dailyTotalRow.innerHTML += `
          <td class="habit-summary-col font-mono font-bold text-center" id="totalHabitsChecksSum">0</td>
        `;
  }

  function getTallyHeatClass(count) {
    const max = state.habits.length || 1;
    const ratio = count / max;
    if (ratio >= 0.7) return 'tally-high';
    if (ratio >= 0.35) return 'tally-mid';
    if (count > 0) return 'tally-low';
    return '';
  }

  // Zero-Jank In-Place Checkbox Handler
  function handleHabitCheckClick(boxEl) {
    const habitId = boxEl.getAttribute('data-habit-id');
    const day = parseInt(boxEl.getAttribute('data-day'), 10);
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const monthKey = getMonthKey();
    if (!habit.checks) habit.checks = {};
    if (!habit.checks[monthKey]) habit.checks[monthKey] = [];

    const idx = habit.checks[monthKey].indexOf(day);
    const isNowChecked = idx === -1;
    if (isNowChecked) {
      habit.checks[monthKey].push(day);
    } else {
      habit.checks[monthKey].splice(idx, 1);
    }

    // 1. In-place micro-bounce checkmark
    triggerHaptic(12);
    boxEl.classList.toggle('checked', isNowChecked);
    if (isNowChecked) {
      boxEl.style.animation = 'none';
      void boxEl.offsetWidth;
      boxEl.style.animation = '';
    }

    // 2. In-place row progress bar update
    const daysInMonth = getDaysInActiveMonth();
    const completedThisMonth = habit.checks[monthKey].length;
    const rowPct = Math.round((completedThisMonth / daysInMonth) * 100);
    const barEl = document.getElementById(`prog-bar-${habit.id}`);
    const pctEl = document.getElementById(`prog-pct-${habit.id}`);
    if (barEl) {
      barEl.style.width = `${rowPct}%`;
      if (habit.color) barEl.style.background = habit.color;
    }
    if (pctEl) pctEl.textContent = `${rowPct}%`;


    // 3. In-place daily tally counter update
    let dayCount = 0;
    state.habits.forEach(h => {
      const checks = (h.checks && h.checks[monthKey]) || [];
      if (checks.includes(day)) dayCount++;
    });
    const tallyEl = document.getElementById(`tally-day-${day}`);
    if (tallyEl) {
      tallyEl.textContent = dayCount;
      tallyEl.className = `daily-tally-badge ${getTallyHeatClass(dayCount)}`;
    }

    // 4. In-place Donut & KPIs
    updateMetricsAndDonut();

    // 5. In-place Wave Chart
    updateWaveChartDataInPlace();

    saveHabits();
  }

  function updateMetricsAndDonut() {
    const daysInMonth = getDaysInActiveMonth();
    const monthKey = getMonthKey();
    let totalPossible = state.habits.length * daysInMonth;
    let totalDone = 0;
    let dailyCounts = new Array(daysInMonth).fill(0);

    state.habits.forEach(h => {
      const checks = (h.checks && h.checks[monthKey]) || [];
      checks.forEach(d => {
        if (d >= 1 && d <= daysInMonth) {
          totalDone++;
          dailyCounts[d - 1]++;
        }
      });
    });

    const overallPercent = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Donut SVG stroke offset
    const circle = document.getElementById('habitDonutProgress');
    if (circle) {
      const circumference = 2 * Math.PI * 52;
      const offset = circumference - (overallPercent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    const pctValEl = document.getElementById('donutPercentVal');
    if (pctValEl) pctValEl.textContent = `${overallPercent}%`;

    const tallyDetailEl = document.getElementById('donutTallyDetail');
    if (tallyDetailEl) {
      const suffix = state.prefs.lang === 'ru' ? 'отметок' : 'checks';
      tallyDetailEl.textContent = `${totalDone} / ${totalPossible} ${suffix}`;
    }

    const sumEl = document.getElementById('totalHabitsChecksSum');
    if (sumEl) sumEl.textContent = totalDone;

    // Calculate max streak this month
    let maxStreak = 0;
    state.habits.forEach(h => {
      const checks = (h.checks && h.checks[monthKey]) || [];
      let curr = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        if (checks.includes(d)) {
          curr++;
          if (curr > maxStreak) maxStreak = curr;
        } else {
          curr = 0;
        }
      }
    });

    let topCount = 0;
    let topDayNum = 1;
    dailyCounts.forEach((c, idx) => {
      if (c > topCount) {
        topCount = c;
        topDayNum = idx + 1;
      }
    });

    const daysSuffix = state.prefs.lang === 'ru' ? 'Дней' : 'Days';
    const dayLabel = state.prefs.lang === 'ru' ? 'День' : 'Day';

    const kpiActive = getEl('kpiActiveHabits');
    if (kpiActive) kpiActive.textContent = state.habits.length;
    const kpiStreak = getEl('kpiBestStreak');
    if (kpiStreak) kpiStreak.textContent = `${maxStreak} ${daysSuffix}`;
    const kpiTop = getEl('kpiTopDay');
    if (kpiTop) kpiTop.textContent = topCount > 0 ? `${dayLabel} ${topDayNum} (${topCount})` : '-';
  }

  function renderHabitWaveChart() {
    const canvas = document.getElementById('habitWaveChart');
    if (!canvas) return;

    const daysInMonth = getDaysInActiveMonth();
    const monthKey = getMonthKey();
    const dailyCounts = new Array(daysInMonth).fill(0);

    state.habits.forEach(h => {
      const checks = (h.checks && h.checks[monthKey]) || [];
      checks.forEach(d => {
        if (d >= 1 && d <= daysInMonth) dailyCounts[d - 1]++;
      });
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    const isDark = state.prefs.theme !== 'light';

    if (waveChartInstance) {
      waveChartInstance.destroy();
    }

    if (typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.35)' : 'rgba(79, 70, 229, 0.25)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    waveChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: dailyCounts,
          borderColor: '#6366f1',
          borderWidth: 2,
          fill: true,
          backgroundColor: gradient,
          tension: 0.38,
          pointBackgroundColor: '#6366f1',
          pointHoverRadius: 5,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#475569',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 8,
            displayColors: false,
            callbacks: {
              title: (items) => {
                const d = items[0].label;
                return state.prefs.lang === 'ru' ? `День ${d}` : `Day ${d}`;
              },
              label: (item) => {
                const v = item.raw;
                return state.prefs.lang === 'ru' ? ` Выполнено: ${v}` : ` ${v} Habits Done`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: isDark ? '#64748b' : '#94a3b8',
              font: { size: 9, family: 'Inter' }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(state.habits.length, 3),
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
            },
            ticks: {
              stepSize: 1,
              color: isDark ? '#64748b' : '#94a3b8',
              font: { size: 9, family: 'Inter' }
            }
          }
        }
      }
    });
  }

  function updateWaveChartDataInPlace() {
    if (!waveChartInstance) return;
    const daysInMonth = getDaysInActiveMonth();
    const monthKey = getMonthKey();
    const dailyCounts = new Array(daysInMonth).fill(0);

    state.habits.forEach(h => {
      const checks = (h.checks && h.checks[monthKey]) || [];
      checks.forEach(d => {
        if (d >= 1 && d <= daysInMonth) dailyCounts[d - 1]++;
      });
    });

    waveChartInstance.data.datasets[0].data = dailyCounts;
    waveChartInstance.update('none');
  }

  function bindHabitRowActions() {
    document.querySelectorAll('.habit-check-cell').forEach(box => {
      box.onclick = () => handleHabitCheckClick(box);
    });

    document.querySelectorAll('.edit-habit-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        openHabitModal(btn.getAttribute('data-id'));
      };
    });

    document.querySelectorAll('.delete-habit-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const habitId = btn.getAttribute('data-id');
        const confirmMsg = state.prefs.lang === 'ru' ? 'Удалить эту привычку?' : 'Delete this habit?';
        if (confirm(confirmMsg)) {
          state.habits = state.habits.filter(h => h.id !== habitId);
          saveHabits();
          renderHabitTrackerFull();
          showToast(state.prefs.lang === 'ru' ? 'Привычка удалена' : 'Habit removed', 'info');
        }
      };
    });
  }

  // ========================================================================
  // ADVANCED HABIT BUILDER — Icon grid, colors, presets, reminders
  // ========================================================================

  const HABIT_ICONS = [
    '📖', '🏋️', '💧', '🧘', '🇬🇧', '💻', '🏃', '✍️', '🎯', '🌿',
    '🍎', '😴', '🎸', '🧠', '📝', '🎨', '🌅', '💊', '🚴', '🏊',
    '🥗', '🍵', '📊', '🗣️', '🏔️', '🧹', '📷', '⚡', '🔥', '💡',
    '🌙', '☀️', '🧩', '🕐', '💰', '📱', '✅', '🎵', '🏡', '🌊'
  ];

  const HABIT_COLORS = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#ec4899', '#f43f5e',
    '#f59e0b', '#eab308', '#10b981', '#06b6d4', '#38bdf8',
    '#3b82f6', '#64748b', '#84cc16', '#f97316', '#14b8a6'
  ];

  // Build icon grid on first open (once-only guard)
  let _builderInitialized = false;
  function buildHabitBuilderUI() {
    // Icon Grid
    const grid = document.getElementById('habitIconGrid');
    if (grid && grid.children.length === 0) {
      HABIT_ICONS.forEach(icon => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'icon-grid-btn';
        btn.textContent = icon;
        btn.addEventListener('click', () => {
          document.getElementById('habitInputEmoji').value = icon;
          grid.querySelectorAll('.icon-grid-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
        grid.appendChild(btn);
      });
    }

    // Color palette
    const palette = document.getElementById('habitColorPalette');
    if (palette && palette.children.length === 0) {
      HABIT_COLORS.forEach(color => {
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;
        swatch.addEventListener('click', () => {
          document.getElementById('habitInputColor').value = color;
          palette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        });
        palette.appendChild(swatch);
      });
    }

    if (!_builderInitialized) {
      _builderInitialized = true;

      // Preset chips
      document.querySelectorAll('#habitPresetChips .preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const title = chip.dataset.title;
          const emoji = chip.dataset.emoji;
          const cat = chip.dataset.cat;
          const color = chip.dataset.color;
          const dur = parseInt(chip.dataset.dur, 10) || 0;

          document.getElementById('habitInputTitle').value = title;
          document.getElementById('habitInputEmoji').value = emoji;
          document.getElementById('habitInputCategory').value = cat;
          document.getElementById('habitInputDuration').value = dur;
          document.getElementById('habitInputColor').value = color;

          // Sync icon selection
          document.querySelectorAll('.icon-grid-btn').forEach(b => {
            b.classList.toggle('selected', b.textContent === emoji);
          });

          // Sync color selection
          document.querySelectorAll('.color-swatch').forEach(s => {
            s.classList.toggle('selected', s.style.backgroundColor === hexToRgbStr(color) || s.title === color);
          });

          // Pulse the chip
          chip.style.transform = 'scale(0.93)';
          setTimeout(() => (chip.style.transform = ''), 150);
        });
      });

      // Duration pills
      document.querySelectorAll('.dur-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const inp = document.getElementById('habitInputDuration');
          const cur = parseInt(inp.value, 10) || 0;
          inp.value = Math.min(480, cur + parseInt(pill.dataset.add, 10));
        });
      });

      // Frequency mode buttons
      const freqDaily = document.getElementById('freqBtnDaily');
      const freqCustom = document.getElementById('freqBtnCustom');
      const dowRow = document.getElementById('dowRow');

      freqDaily.addEventListener('click', () => {
        freqDaily.classList.add('active');
        freqCustom.classList.remove('active');
        dowRow.style.display = 'none';
        document.getElementById('habitInputFreq').value = 'daily';
      });

      freqCustom.addEventListener('click', () => {
        freqCustom.classList.add('active');
        freqDaily.classList.remove('active');
        dowRow.style.display = 'flex';
        document.getElementById('habitInputFreq').value = 'custom';
      });

      // Day-of-week toggle buttons
      document.querySelectorAll('.dow-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('active');
          const activeDow = [...document.querySelectorAll('.dow-btn.active')].map(b => b.dataset.dow);
          document.getElementById('habitInputDow').value = activeDow.join(',');
        });
      });

      // Reminder toggle — request Notification permission
      const reminderToggle = document.getElementById('habitReminderToggle');
      reminderToggle.addEventListener('change', async () => {
        if (reminderToggle.checked) {
          await requestNotificationPermission();
        }
        updateNotifStatus();
      });
    }
  }

  function hexToRgbStr(hex) {
    if (!hex || typeof hex !== 'string') return 'rgb(99, 102, 241)';
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return 'rgb(99, 102, 241)';
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(99, 102, 241, ${alpha})`;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(99, 102, 241, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    updateNotifStatus();
  }

  function updateNotifStatus() {
    const el = document.getElementById('notifStatusMsg');
    if (!el) return;
    if (!('Notification' in window)) {
      el.textContent = '⚠ Браузер не поддерживает уведомления';
      el.className = 'notif-status denied';
      return;
    }
    const perm = Notification.permission;
    const toggle = document.getElementById('habitReminderToggle');
    if (!toggle || !toggle.checked) {
      el.textContent = '';
      return;
    }
    if (perm === 'granted') {
      el.textContent = '✓ Уведомления разрешены — напоминание будет активно';
      el.className = 'notif-status granted';
    } else if (perm === 'denied') {
      el.textContent = '✗ Уведомления заблокированы — разрешите в настройках браузера';
      el.className = 'notif-status denied';
    } else {
      el.textContent = 'Нажмите, чтобы запросить разрешение на уведомления';
      el.className = 'notif-status';
    }
  }

  // ---- Reminder scheduler ----
  // Stores active setTimeout IDs keyed by habit.id
  const _reminderTimers = {};

  function scheduleHabitReminders() {
    // Clear all existing timers
    Object.values(_reminderTimers).forEach(id => clearTimeout(id));

    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    state.habits.forEach(habit => {
      if (!habit.reminder || !habit.reminderTime) return;

      const [hh, mm] = habit.reminderTime.split(':').map(Number);
      const now = new Date();
      const next = new Date();
      next.setHours(hh, mm, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);

      const msUntil = next - now;
      _reminderTimers[habit.id] = setTimeout(() => {
        // Check if today's day-of-week matches
        const todayDow = new Date().getDay(); // 0=Sun
        const allowedDow = habit.freq === 'daily'
          ? [0, 1, 2, 3, 4, 5, 6]
          : (habit.dow || []).map(Number);

        if (allowedDow.includes(todayDow)) {
          new Notification('Habit — напоминание', {
            body: `${habit.emoji || '⚡'} ${habit.title} — время выполнить привычку!`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">⚡</text></svg>'
          });
        }
        // Re-schedule for next day
        scheduleHabitReminders();
      }, msUntil);
    });
  }

  // ---- Sync icon/color selection in grid/palette ----
  function syncBuilderSelections(emoji, color) {
    document.querySelectorAll('.icon-grid-btn').forEach(b => {
      b.classList.toggle('selected', b.textContent === emoji);
    });
    const targetColor = (color || '#6366f1').toLowerCase();
    const targetRgb = hexToRgbStr(targetColor);
    document.querySelectorAll('.color-swatch').forEach(s => {
      const swatchColor = (s.title || s.dataset.color || '').toLowerCase();
      s.classList.toggle('selected', swatchColor === targetColor || s.style.backgroundColor === targetRgb);
    });
  }

  // ---- Set DOW buttons active state ----
  function setDowButtons(dowArray) {
    document.querySelectorAll('.dow-btn').forEach(btn => {
      btn.classList.toggle('active', dowArray.map(String).includes(btn.dataset.dow));
    });
  }

  function openHabitModal(habitId = null) {
    const modal = document.getElementById('habitModal');
    const form = document.getElementById('habitForm');
    const titleEl = document.getElementById('habitModalTitle');
    const editId = document.getElementById('habitEditId');

    // Build UI components on first open
    buildHabitBuilderUI();

    form.reset();

    // Reset frequency to daily
    document.getElementById('freqBtnDaily').classList.add('active');
    document.getElementById('freqBtnCustom').classList.remove('active');
    document.getElementById('dowRow').style.display = 'none';
    document.getElementById('habitInputFreq').value = 'daily';
    document.getElementById('habitInputDow').value = '1,2,3,4,5,6,0';
    document.getElementById('habitInputDuration').value = '0';
    document.getElementById('habitInputTime').value = '09:00';
    document.getElementById('habitReminderToggle').checked = false;
    document.getElementById('notifStatusMsg').textContent = '';

    if (habitId) {
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        titleEl.textContent = '✏️ Редактировать привычку';
        editId.value = habit.id;
        document.getElementById('habitInputTitle').value = habit.title;
        document.getElementById('habitInputEmoji').value = habit.emoji || '⚡';
        document.getElementById('habitInputCategory').value = habit.category;
        document.getElementById('habitInputColor').value = habit.color || '#6366f1';
        document.getElementById('habitInputDuration').value = habit.targetMin || 0;
        document.getElementById('habitInputFreq').value = habit.freq || 'daily';
        document.getElementById('habitInputDow').value = (habit.dow || [1, 2, 3, 4, 5, 6, 0]).join(',');
        document.getElementById('habitReminderToggle').checked = !!habit.reminder;
        document.getElementById('habitInputTime').value = habit.reminderTime || '09:00';

        // Restore frequency UI
        if (habit.freq === 'custom') {
          document.getElementById('freqBtnCustom').classList.add('active');
          document.getElementById('freqBtnDaily').classList.remove('active');
          document.getElementById('dowRow').style.display = 'flex';
        }
        setDowButtons(habit.dow || [1, 2, 3, 4, 5, 6, 0]);
        syncBuilderSelections(habit.emoji || '⚡', habit.color || '#6366f1');
        updateNotifStatus();
      }
    } else {
      titleEl.textContent = '✨ Новая привычка';
      editId.value = '';
      document.getElementById('habitInputEmoji').value = '⚡';
      document.getElementById('habitInputColor').value = '#6366f1';
      syncBuilderSelections('⚡', '#6366f1');
      setDowButtons([1, 2, 3, 4, 5, 6, 0]);
    }

    modal.classList.add('active');
  }

  document.getElementById('addHabitBtn').onclick = () => openHabitModal();

  document.getElementById('habitForm').onsubmit = (e) => {
    e.preventDefault();
    const editId = document.getElementById('habitEditId').value;
    const title = document.getElementById('habitInputTitle').value.trim();
    const emoji = document.getElementById('habitInputEmoji').value.trim() || '⚡';
    const category = document.getElementById('habitInputCategory').value;
    const color = document.getElementById('habitInputColor').value || '#6366f1';
    const targetMin = parseInt(document.getElementById('habitInputDuration').value, 10) || 0;
    const freq = document.getElementById('habitInputFreq').value || 'daily';
    const dowRaw = document.getElementById('habitInputDow').value;
    const dow = dowRaw ? dowRaw.split(',').map(Number) : [1, 2, 3, 4, 5, 6, 0];
    const reminder = document.getElementById('habitReminderToggle').checked;
    const reminderTime = document.getElementById('habitInputTime').value || '09:00';

    if (editId) {
      const habit = state.habits.find(h => h.id === editId);
      if (habit) {
        Object.assign(habit, { title, emoji, category, color, targetMin, freq, dow, reminder, reminderTime });
        showToast('Привычка обновлена!', 'success');
      }
    } else {
      state.habits.push({
        id: 'h-' + Date.now(),
        title, emoji, category, color, targetMin, freq, dow, reminder, reminderTime,
        checks: {}
      });
      showToast('Привычка создана! 🎉', 'success');
    }

    saveHabits();
    renderHabitTrackerFull();
    scheduleHabitReminders();
    document.getElementById('habitModal').classList.remove('active');
  };

  // ---- Apply per-habit accent color to rows and progress bars ----
  function applyHabitAccentColors() {
    state.habits.forEach(habit => {
      const accentColor = habit.color || '#6366f1';
      const accentGlow = hexToRgba(accentColor, 0.35);
      const accentSubtle = hexToRgba(accentColor, 0.12);

      const row = document.querySelector(`tr[data-habit-id="${habit.id}"]`);
      if (row) {
        row.style.setProperty('--habit-accent', accentColor);
        row.style.setProperty('--habit-accent-glow', accentGlow);
        row.style.setProperty('--habit-accent-subtle', accentSubtle);
      }

      const bar = document.getElementById(`prog-bar-${habit.id}`);
      if (bar) {
        bar.style.background = accentColor;
      }
    });
  }

  // ========================================================================
  // MODULE B: TASK MANAGER
  // ========================================================================
  function renderTasks() {
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';

    const searchQuery = document.getElementById('taskSearchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('taskCategoryFilter').value;
    const statusFilter = document.getElementById('taskStatusFilter').value;
    const sortBy = document.getElementById('taskSortSelect').value;

    const today = getNow();
    today.setHours(0, 0, 0, 0);

    let filtered = state.tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery)) ||
        t.category.toLowerCase().includes(searchQuery);

      if (!matchesSearch) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const isOverdue = !t.completed && dueDate < today;

      if (statusFilter === 'active' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      if (statusFilter === 'overdue' && !isOverdue) return false;

      return true;
    });

    // Handle Empty Tasks State
    if (!state.tasks || state.tasks.length === 0) {
      const emptyTr = document.createElement('tr');
      emptyTr.innerHTML = `
            <td colspan="7" class="td-empty-wrap">
              <div class="empty-state-card empty-state-frameless">
                <div class="empty-icon-wrap">
                  <i data-lucide="check-square" class="icon-xl text-accent"></i>
                </div>
                <h3>${t('no_tasks_title')}</h3>
                <p>${t('no_tasks_desc')}</p>
                <button class="btn-primary" id="addFirstTaskBtn">
                  <i data-lucide="plus" class="icon-sm"></i>
                  <span>${t('create_first_task')}</span>
                </button>
              </div>
            </td>
          `;
      tbody.appendChild(emptyTr);
      document.getElementById('addFirstTaskBtn').onclick = () => openTaskModal();
    } else {
      filtered.sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortBy === 'priority') {
          const pWeights = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
        }
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });

      const taskFrag = document.createDocumentFragment();
      filtered.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = `task-item-row ${task.completed ? 'completed' : ''}`;

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let daysBadge = '';
        const isRu = state.prefs.lang === 'ru';
        if (task.completed) {
          daysBadge = `<span class="badge-days-due due-upcoming"><i data-lucide="check" class="icon-xs"></i> ${isRu ? 'Готово' : 'Done'}</span>`;
        } else if (diffDays < 0) {
          daysBadge = `<span class="badge-days-due due-overdue"><i data-lucide="alert-circle" class="icon-xs"></i> ${Math.abs(diffDays)}${isRu ? 'д просрочено' : 'd overdue'}</span>`;
        } else if (diffDays === 0) {
          daysBadge = `<span class="badge-days-due due-today"><i data-lucide="clock" class="icon-xs"></i> ${isRu ? 'Сегодня' : 'Today'}</span>`;
        } else if (diffDays === 1) {
          daysBadge = `<span class="badge-days-due due-upcoming">${isRu ? 'Завтра' : 'Tomorrow'}</span>`;
        } else {
          daysBadge = `<span class="badge-days-due due-upcoming">${isRu ? 'Через ' + diffDays + 'д' : 'In ' + diffDays + 'd'}</span>`;
        }

        const priLower = (task.priority || 'medium').toLowerCase();
        let priorityClass = 'priority-low';
        if (priLower === 'urgent') priorityClass = 'priority-urgent';
        else if (priLower === 'high') priorityClass = 'priority-high';
        else if (priLower === 'medium') priorityClass = 'priority-medium';

        const priLabel = t(`pri_${priLower}`) || task.priority;

        tr.innerHTML = `
              <td class="text-center">
                <div class="habit-check-cell ${task.completed ? 'checked' : ''} task-toggle-check" data-id="${task.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </td>
              <td>
                <div class="task-title-main">${task.title}</div>
                ${task.notes ? `<div class="task-notes-sub">${task.notes}</div>` : ''}
              </td>
              <td><span class="badge-cat-pill">${task.category}</span></td>
              <td class="font-mono-sm text-secondary">${task.dueDate}</td>
              <td>${daysBadge}</td>
              <td><span class="badge-priority ${priorityClass}">${priLabel}</span></td>
              <td class="text-right">
                <div class="actions-inline-group">
                  <button class="btn-row-action edit-task-btn" data-id="${task.id}" title="Редактировать">
                    <i data-lucide="edit-2" class="icon-xs"></i>
                  </button>
                  <button class="btn-row-action delete delete-task-btn" data-id="${task.id}" title="Удалить">
                    <i data-lucide="trash-2" class="icon-xs"></i>
                  </button>
                </div>
              </td>
            `;
        taskFrag.appendChild(tr);
      });
      tbody.appendChild(taskFrag);
    }

    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = state.tasks.filter(t => !t.completed && new Date(t.dueDate).setHours(0, 0, 0, 0) < today).length;

    document.getElementById('taskStatTotal').textContent = total;
    document.getElementById('taskStatPending').textContent = pending;
    document.getElementById('taskStatCompleted').textContent = completed;
    document.getElementById('taskStatOverdue').textContent = overdue;
    renderMobileTaskCards(filtered || []);
    bindTaskEvents();
    safeRenderIcons();
  }

  function renderMobileTaskCards(tasks) {
    const container = document.getElementById('mobileTasksCardsList');
    if (!container) return;
    container.innerHTML = '';

    if (!tasks || tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon-wrap"><i data-lucide="check-square" class="icon-xl text-accent"></i></div>
          <h3>${t('no_tasks_title')}</h3>
          <p>${t('no_tasks_desc')}</p>
          <button class="btn-primary" onclick="document.getElementById('addTaskBtn').click()">
            <i data-lucide="plus" class="icon-sm"></i>
            <span>${t('create_first_task')}</span>
          </button>
        </div>
      `;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mobTaskFrag = document.createDocumentFragment();
    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let badgeText = `${diffDays}d`;
      let badgeClass = 'badge-due-safe';
      const isRu = state.prefs.lang === 'ru';
      if (task.completed) {
        badgeText = isRu ? '✓ Готово' : '✓ Done';
        badgeClass = 'badge-due-done';
      } else if (diffDays < 0) {
        badgeText = `${Math.abs(diffDays)}${isRu ? 'д просрочено' : 'd overdue'}`;
        badgeClass = 'badge-due-overdue';
      } else if (diffDays === 0) {
        badgeText = isRu ? 'Сегодня' : 'Today';
        badgeClass = 'badge-due-today';
      } else if (diffDays === 1) {
        badgeText = isRu ? 'Завтра' : 'Tomorrow';
        badgeClass = 'badge-due-upcoming';
      } else if (diffDays <= 3) {
        badgeText = `${isRu ? 'Через ' + diffDays + 'д' : 'In ' + diffDays + 'd'}`;
        badgeClass = 'badge-due-upcoming';
      }

      const priLower = (task.priority || 'medium').toLowerCase();
      const priorityLabel = t(`pri_${priLower}`) || task.priority;

      const card = document.createElement('div');
      card.className = `mobile-task-card ${task.completed ? 'completed' : ''} priority-${(task.priority || 'medium').toLowerCase()}`;
      card.innerHTML = `
        <button class="mob-task-check-btn ${task.completed ? 'checked' : ''}" data-id="${task.id}" title="Отметить">
          <i data-lucide="${task.completed ? 'check-circle-2' : 'circle'}" class="icon-xl"></i>
        </button>
        <div class="mob-task-content">
          <div class="mob-task-title">${task.title}</div>
          ${task.notes ? `<div class="mob-task-notes">${task.notes}</div>` : ''}
          <div class="mob-task-tags">
            <span class="mob-task-cat">${task.category}</span>
            <span class="mob-task-pri pri-${(task.priority || 'medium').toLowerCase()}">${priorityLabel}</span>
            <span class="mob-task-due ${badgeClass}">${badgeText}</span>
          </div>
        </div>
        <div class="mob-task-actions">
          <button class="mob-action-icon edit-task-btn" data-id="${task.id}" title="Редактировать">
            <i data-lucide="edit-2" class="icon-sm"></i>
          </button>
          <button class="mob-action-icon delete-task-btn" data-id="${task.id}" title="Удалить">
            <i data-lucide="trash-2" class="icon-sm"></i>
          </button>
        </div>
      `;

      mobTaskFrag.appendChild(card);
    });
    container.appendChild(mobTaskFrag);

    container.querySelectorAll('.mob-task-check-btn').forEach(btn => {
      btn.onclick = () => {
        triggerHaptic(12);
        const taskId = btn.getAttribute('data-id');
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };
    });

    safeRenderIcons();
  }

  function bindTaskEvents() {
    document.querySelectorAll('.task-toggle-check').forEach(box => {
      box.onclick = () => {
        triggerHaptic(12);
        const taskId = box.getAttribute('data-id');
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };
    });

    document.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.onclick = () => openTaskModal(btn.getAttribute('data-id'));
    });

    document.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.onclick = () => {
        const taskId = btn.getAttribute('data-id');
        const confirmMsg = state.prefs.lang === 'ru' ? 'Удалить эту задачу?' : 'Delete this task?';
        if (confirm(confirmMsg)) {
          state.tasks = state.tasks.filter(t => t.id !== taskId);
          saveTasks();
          renderTasks();
          showToast(state.prefs.lang === 'ru' ? 'Задача удалена' : 'Task removed', 'info');
        }
      };
    });
  }

  function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const title = document.getElementById('taskModalTitle');
    const editId = document.getElementById('taskEditId');

    form.reset();
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('taskInputDueDate').value = todayStr;

    if (taskId) {
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        title.textContent = state.prefs.lang === 'ru' ? 'Редактировать задачу' : 'Edit Task';
        editId.value = task.id;
        document.getElementById('taskInputTitle').value = task.title;
        document.getElementById('taskInputNotes').value = task.notes || '';
        document.getElementById('taskInputCategory').value = task.category;
        document.getElementById('taskInputPriority').value = task.priority;
        document.getElementById('taskInputDueDate').value = task.dueDate;
      }
    } else {
      title.textContent = t('modal_add_task');
      editId.value = '';
    }

    modal.classList.add('active');
  }

  document.getElementById('addTaskBtn').onclick = () => openTaskModal();

  document.getElementById('taskForm').onsubmit = (e) => {
    e.preventDefault();
    const editId = document.getElementById('taskEditId').value;
    const title = document.getElementById('taskInputTitle').value.trim();
    const notes = document.getElementById('taskInputNotes').value.trim();
    const category = document.getElementById('taskInputCategory').value;
    const priority = document.getElementById('taskInputPriority').value;
    const dueDate = document.getElementById('taskInputDueDate').value;

    if (editId) {
      const task = state.tasks.find(t => t.id === editId);
      if (task) {
        task.title = title;
        task.notes = notes;
        task.category = category;
        task.priority = priority;
        task.dueDate = dueDate;
        showToast(state.prefs.lang === 'ru' ? 'Задача обновлена!' : 'Task updated!', 'success');
      }
    } else {
      state.tasks.push({
        id: 't-' + Date.now(),
        title,
        notes,
        category,
        priority,
        dueDate,
        completed: false
      });
      showToast(state.prefs.lang === 'ru' ? 'Задача добавлена!' : 'Task added!', 'success');
    }

    saveTasks();
    renderTasks();
    document.getElementById('taskModal').classList.remove('active');
  };

  const debouncedRenderTasks = debounce(renderTasks, 150);
  const taskSearchEl = document.getElementById('taskSearchInput');
  if (taskSearchEl) {
    taskSearchEl.oninput = debouncedRenderTasks;
  }
  ['taskCategoryFilter', 'taskStatusFilter', 'taskSortSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.onchange = renderTasks;
    }
  });

  // ========================================================================
  // MODULE C: FINANCE — TRANSACTION TRACKER
  // ========================================================================
  let expenseDonutChartInstance = null;

  const TXN_CATEGORIES = {
    expense: [
      { id: 'food', label: 'Еда', icon: '🍔' },
      { id: 'transport', label: 'Транспорт', icon: '🚕' },
      { id: 'housing', label: 'Жильё', icon: '🏠' },
      { id: 'shopping', label: 'Покупки', icon: '🛍' },
      { id: 'fun', label: 'Развлечения', icon: '🎮' },
      { id: 'utilities', label: 'Коммуналка', icon: '💡' },
      { id: 'health', label: 'Здоровье', icon: '💊' },
      { id: 'education', label: 'Обучение', icon: '📚' },
      { id: 'other', label: 'Прочее', icon: '📦' },
    ],
    income: [
      { id: 'salary', label: 'Зарплата', icon: '💼' },
      { id: 'freelance', label: 'Фриланс', icon: '💻' },
      { id: 'gift', label: 'Подарок', icon: '🎁' },
      { id: 'invest', label: 'Инвестиции', icon: '📈' },
      { id: 'other_inc', label: 'Прочее', icon: '💰' },
    ]
  };

  function formatMoney(amount) {
    return '₽' + Math.abs(amount).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  function getCategoryInfo(type, catId) {
    const list = TXN_CATEGORIES[type] || TXN_CATEGORIES.expense;
    return list.find(c => c.id === catId) || { id: catId, label: catId, icon: type === 'income' ? '💰' : '📦' };
  }

  function renderFinance() {
    const txns = state.finances.transactions || [];
    const subs = state.finances.subscriptions || [];

    const totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const totalExpenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const netBalance = totalIncome - totalExpenses;

    // KPI cards
    const totalIncEl = document.getElementById('finTotalIncome');
    const totalExpEl = document.getElementById('finTotalExpenses');
    const netBalEl = document.getElementById('finNetBalance');

    if (totalIncEl) totalIncEl.textContent = formatMoney(totalIncome);
    if (totalExpEl) totalExpEl.textContent = formatMoney(totalExpenses);
    if (netBalEl) {
      netBalEl.textContent = (netBalance >= 0 ? '+' : '−') + formatMoney(netBalance);
      netBalEl.style.color = netBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-coral)';
    }

    const incomeTxns = txns.filter(t => t.type === 'income').length;
    const expenseTxns = txns.filter(t => t.type === 'expense').length;
    const incSubEl = document.getElementById('finIncomeSubtext');
    const expSubEl = document.getElementById('finExpenseSubtext');
    if (incSubEl) incSubEl.textContent = `${incomeTxns} операций`;
    if (expSubEl) expSubEl.textContent = `${expenseTxns} операций`;

    // Transaction feed
    const listEl = document.getElementById('txnList');
    const countEl = document.getElementById('txnCount');
    if (listEl) {
      listEl.innerHTML = '';
      const sorted = [...txns].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (sorted.length === 0) {
        listEl.innerHTML = `
              <div class="empty-state-card empty-state-frameless">
                <div class="empty-icon-wrap"><i data-lucide="receipt" class="icon-xl text-accent"></i></div>
                <h3>Операций пока нет</h3>
                <p>Нажмите «Добавить доход» или «Добавить расход», чтобы начать</p>
              </div>`;
        if (countEl) countEl.textContent = '';
      } else {
        if (countEl) countEl.textContent = `${sorted.length} операций`;
        const txnFrag = document.createDocumentFragment();
        sorted.forEach(txn => {
          const catInfo = getCategoryInfo(txn.type, txn.category);
          const div = document.createElement('div');
          div.className = 'txn-item';
          div.innerHTML = `
                <div class="txn-icon ${txn.type === 'income' ? 'income-icon' : 'expense-icon'}">${catInfo.icon}</div>
                <div class="txn-meta">
                  <div class="txn-category">${catInfo.label}</div>
                  <div class="txn-note">${txn.note || '—'}</div>
                </div>
                <div class="txn-right">
                  <span class="txn-amount ${txn.type}">${txn.type === 'income' ? '+' : '−'}${formatMoney(txn.amount)}</span>
                  <span class="txn-date">${formatDate(txn.date)}</span>
                </div>
                <button class="txn-delete-btn" data-id="${txn.id}" title="Удалить">
                  <i data-lucide="trash-2" class="icon-xs"></i>
                </button>`;
          txnFrag.appendChild(div);
        });
        listEl.appendChild(txnFrag);
      }
    }

    // Subscriptions List & Timeline Rendering
    const subsContainer = document.getElementById('subscriptionsContainer');
    if (subsContainer) {
      subsContainer.innerHTML = '';
      let subsMonthlyTotal = 0;

      if (subs.length === 0) {
        subsContainer.innerHTML = `<div class="empty-subs-msg">${state.prefs.lang === 'ru' ? 'Нет активных подписок' : 'No active subscriptions'}</div>`;
      } else {
        // Calculate timeline & normalize monthly cost
        const enrichedSubs = subs.map(sub => {
          const timeline = getSubscriptionTimeline(sub);
          const costNum = parseFloat(sub.cost) || 0;
          const monthlyCost = sub.cycle === 'annual' ? (costNum / 12) : costNum;
          subsMonthlyTotal += monthlyCost;
          return { sub, timeline, monthlyCost };
        }).sort((a, b) => a.timeline.diffDays - b.timeline.diffDays);

        const subsFrag = document.createDocumentFragment();
        enrichedSubs.forEach(({ sub, timeline }) => {
          const item = document.createElement('div');
          item.className = 'sub-item-card';
          const isAnnual = sub.cycle === 'annual';
          const cycleLabel = isAnnual ? (state.prefs.lang === 'ru' ? 'год' : 'yr') : (state.prefs.lang === 'ru' ? 'мес' : 'mo');
          const cycleBadge = isAnnual ? `<span class="sub-cycle-badge">${state.prefs.lang === 'ru' ? 'Год' : 'Annual'}</span>` : '';

          item.innerHTML = `
                <div class="sub-brand-info">
                  <div class="sub-icon-avatar">${sub.icon || detectSubIcon(sub.name)}</div>
                  <div class="sub-details">
                    <div class="sub-name-row">
                      <h5 title="${sub.name}">${sub.name}</h5>
                      ${cycleBadge}
                    </div>
                    <div class="sub-date-row">
                      <span class="sub-next-date">📅 ${timeline.nextDateStr}</span>
                      <span class="sub-countdown-badge ${timeline.badgeClass}">${timeline.badgeText}</span>
                    </div>
                  </div>
                </div>
                <div class="sub-right">
                  <div class="sub-cost-tag">
                    ${formatMoney(sub.cost)}<span class="sub-cost-unit">/${cycleLabel}</span>
                  </div>
                  <div class="sub-actions">
                    <button class="txn-delete-btn sub-edit-btn sub-action-visible" data-sub-id="${sub.id}" title="Редактировать">
                      <i data-lucide="edit-2" class="icon-xs"></i>
                    </button>
                    <button class="txn-delete-btn sub-del-btn sub-action-visible" data-sub-id="${sub.id}" title="Удалить">
                      <i data-lucide="trash-2" class="icon-xs"></i>
                    </button>
                  </div>
                </div>`;
          subsFrag.appendChild(item);
        });
        subsContainer.appendChild(subsFrag);

        const totalBar = document.createElement('div');
        totalBar.className = 'sub-total-bar';
        totalBar.innerHTML = `
              <span class="text-secondary font-medium">${state.prefs.lang === 'ru' ? 'Итого в месяц (с учётом годовых)' : 'Total monthly average'}</span>
              <span class="font-mono font-bold text-amber">${formatMoney(subsMonthlyTotal)}</span>
            `;
        subsContainer.appendChild(totalBar);
      }
    }

    renderExpenseDonutChart();
    bindFinanceEvents();
    safeRenderIcons();
  }

  function renderExpenseDonutChart() {
    const canvas = document.getElementById('expenseDonutChart');
    if (!canvas) return;

    const txns = (state.finances.transactions || []).filter(t => t.type === 'expense');
    const isDark = state.prefs.theme !== 'light';
    const palette = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#64748b'];

    // Aggregate by category
    const catMap = {};
    txns.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0); });
    const entries = Object.entries(catMap).filter(([, v]) => v > 0);

    const labels = entries.length > 0 ? entries.map(([catId]) => { const c = getCategoryInfo('expense', catId); return c.icon + ' ' + c.label; }) : ['Нет расходов'];
    const data = entries.length > 0 ? entries.map(([, v]) => v) : [1];
    const colors = entries.length > 0 ? palette.slice(0, entries.length) : ['#334155'];

    if (typeof Chart === 'undefined') return;

    if (expenseDonutChartInstance) { expenseDonutChartInstance.destroy(); }

    expenseDonutChartInstance = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: isDark ? '#1e293b' : '#ffffff', hoverOffset: entries.length > 0 ? 4 : 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#475569', boxWidth: 10, font: { size: 10, family: 'Inter' }, padding: 8 } },
          tooltip: { enabled: entries.length > 0, backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#f8fafc' : '#0f172a', bodyColor: isDark ? '#94a3b8' : '#475569', borderColor: '#334155', borderWidth: 1, callbacks: { label: (item) => ` ${formatMoney(item.raw)}` } }
        }
      }
    });
  }

  // ---- Subscription Timeline & Auto-Advance Helper ----
  function getSubscriptionTimeline(sub) {
    const today = getNow();
    today.setHours(0, 0, 0, 0);

    let nextDate;
    if (sub.nextBillingDate) {
      nextDate = new Date(sub.nextBillingDate + 'T00:00:00');
    } else if (sub.billingDay) {
      // Legacy fallback: convert billingDay (1-31) to next occurrence
      const day = Math.min(Math.max(parseInt(sub.billingDay, 10) || 1, 1), 31);
      nextDate = new Date(today.getFullYear(), today.getMonth(), day);
    } else {
      nextDate = new Date(today);
    }

    // Auto rollover: if date has already passed, advance by +1 month (or +1 year)
    let rolled = false;
    while (nextDate < today) {
      if (sub.cycle === 'annual') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      rolled = true;
    }

    if (rolled || !sub.nextBillingDate) {
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      sub.nextBillingDate = `${yyyy}-${mm}-${dd}`;
    }

    const diffMs = nextDate - today;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let badgeText = '';
    let badgeClass = '';

    if (diffDays === 0) {
      badgeText = state.prefs.lang === 'ru' ? 'Сегодня' : 'Today';
      badgeClass = 'due-today';
    } else if (diffDays === 1) {
      badgeText = state.prefs.lang === 'ru' ? 'Завтра' : 'Tomorrow';
      badgeClass = 'due-soon';
    } else if (diffDays <= 3) {
      badgeText = state.prefs.lang === 'ru' ? `Через ${diffDays} дня` : `In ${diffDays} days`;
      badgeClass = 'due-soon';
    } else if (diffDays <= 7) {
      badgeText = state.prefs.lang === 'ru' ? `Через ${diffDays} дней` : `In ${diffDays} days`;
      badgeClass = '';
    } else {
      badgeText = state.prefs.lang === 'ru' ? `Через ${diffDays} дн.` : `In ${diffDays}d`;
      badgeClass = '';
    }

    const formattedDate = nextDate.toLocaleDateString(state.prefs.lang === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: nextDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });

    return { nextDateStr: formattedDate, diffDays, badgeText, badgeClass };
  }

  const SUB_KNOWN_ICONS = {
    'netflix': '🎬', 'кино': '🎬', 'cinema': '🎬', 'movie': '🎬', 'film': '🎬',
    'spotify': '🎵', 'music': '🎵', 'музыка': '🎵', 'apple music': '🎵', 'sound': '🎵',
    'youtube': '📺', 'tv': '📺', 'кинопоиск': '🎬', 'okko': '🎬', 'иви': '🎬',
    'яндекс': '🟡', 'yandex': '🟡', 'plus': '🟡', 'плюс': '🟡',
    'icloud': '☁️', 'cloud': '☁️', 'google': '☁️', 'drive': '☁️', 'dropbox': '☁️',
    'gym': '🏋️', 'фитнес': '🏋️', 'спорт': '🏋️', 'fitness': '🏋️', 'зал': '🏋️',
    'chatgpt': '🤖', 'openai': '🤖', 'claude': '🤖', 'midjourney': '🎨',
    'telegram': '✈️', 'tg': '✈️', 'premium': '💎',
    'github': '💻', 'figma': '🎨', 'notion': '📝', 'adobe': '🎨',
    'playstation': '🎮', 'psn': '🎮', 'xbox': '🎮', 'steam': '🎮', 'game': '🎮',
    'vk': '🔵', 'вк': '🔵', 'сбер': '🟢', 'tinkoff': '🟡', 'т-банк': '🟡',
    'связь': '📱', 'мтс': '🔴', 'билайн': '🟡', 'мегафон': '🟢', 'tele2': '⚫',
    'интернет': '🌐', 'провайдер': '🌐'
  };

  function detectSubIcon(name) {
    const lower = (name || '').toLowerCase();
    for (const [key, icon] of Object.entries(SUB_KNOWN_ICONS)) {
      if (lower.includes(key)) return icon;
    }
    return '💳';
  }

  // ---- Transaction Modal ----
  function buildTxnCatChips(type) {
    const grid = document.getElementById('txnCatChips');
    if (!grid) return;
    grid.innerHTML = '';
    TXN_CATEGORIES[type].forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-chip';
      btn.dataset.catId = cat.id;
      btn.innerHTML = `<span class="chip-icon">${cat.icon}</span>${cat.label}`;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        document.getElementById('txnCategory').value = cat.id;
      });
      grid.appendChild(btn);
    });
    // Select first by default
    const first = grid.querySelector('.cat-chip');
    if (first) {
      first.classList.add('selected');
      document.getElementById('txnCategory').value = TXN_CATEGORIES[type][0].id;
    }
  }

  function openTxnModal(type) {
    const typeEl = document.getElementById('txnType');
    const editIdEl = document.getElementById('txnEditId');
    const amtEl = document.getElementById('txnAmount');
    const noteEl = document.getElementById('txnNote');
    const dateEl = document.getElementById('txnDate');
    const titleEl = document.getElementById('txnModalTitle');
    const submitEl = document.getElementById('txnSubmitBtn');

    if (typeEl) typeEl.value = type;
    if (editIdEl) editIdEl.value = '';
    if (amtEl) amtEl.value = '';
    if (noteEl) noteEl.value = '';
    if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);
    if (titleEl) titleEl.textContent = type === 'income' ? '➕ Добавить доход' : '➖ Добавить расход';
    if (submitEl) submitEl.textContent = type === 'income' ? 'Сохранить доход' : 'Сохранить расход';
    buildTxnCatChips(type);
    document.getElementById('txnModal').classList.add('active');
  }

  // ---- Subscription Modal ----
  function openSubscriptionModal(id = null) {
    const modal = document.getElementById('subscriptionModal');
    const form = document.getElementById('subscriptionForm');
    const titleEl = document.getElementById('subModalTitle');
    const editIdEl = document.getElementById('subEditId');
    const nameEl = document.getElementById('subName');
    const iconEl = document.getElementById('subIcon');
    const costEl = document.getElementById('subCost');
    const costLabel = document.getElementById('subCostLabel');
    const dateEl = document.getElementById('subNextBillingDate');
    const cycleMonthly = document.getElementById('subCycleMonthly');
    const cycleAnnual = document.getElementById('subCycleAnnual');
    const cycleInput = document.getElementById('subCycle');
    const submitBtn = document.getElementById('subSubmitBtn');

    form.reset();

    function setCycle(cycle) {
      cycleInput.value = cycle;
      if (cycle === 'annual') {
        cycleAnnual.classList.add('active');
        cycleMonthly.classList.remove('active');
        if (costLabel) costLabel.textContent = 'Сумма в год (₽)';
      } else {
        cycleMonthly.classList.add('active');
        cycleAnnual.classList.remove('active');
        if (costLabel) costLabel.textContent = 'Сумма в месяц (₽)';
      }
    }

    cycleMonthly.onclick = () => setCycle('monthly');
    cycleAnnual.onclick = () => setCycle('annual');

    // Emoji chips
    document.querySelectorAll('#subIconChips .preset-chip').forEach(chip => {
      chip.onclick = () => {
        iconEl.value = chip.dataset.icon;
      };
    });

    // Name auto-detect icon on typing
    nameEl.oninput = () => {
      if (!editIdEl.value) {
        iconEl.value = detectSubIcon(nameEl.value);
      }
    };

    if (id) {
      const sub = (state.finances.subscriptions || []).find(s => s.id === id);
      if (sub) {
        titleEl.textContent = '✏️ Редактировать подписку';
        editIdEl.value = sub.id;
        nameEl.value = sub.name;
        iconEl.value = sub.icon || detectSubIcon(sub.name);
        costEl.value = sub.cost;
        dateEl.value = sub.nextBillingDate || new Date().toISOString().slice(0, 10);
        setCycle(sub.cycle || 'monthly');
        submitBtn.textContent = 'Сохранить изменения';
      }
    } else {
      titleEl.textContent = '✨ Новая подписка';
      editIdEl.value = '';
      iconEl.value = '💳';
      dateEl.value = new Date().toISOString().slice(0, 10);
      setCycle('monthly');
      submitBtn.textContent = 'Сохранить подписку';
    }

    modal.classList.add('active');
  }

  function bindFinanceEvents() {
    // Delete transaction buttons
    document.querySelectorAll('.txn-delete-btn[data-id]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (confirm('Удалить эту операцию?')) {
          state.finances.transactions = (state.finances.transactions || []).filter(t => t.id !== id);
          saveFinance();
          renderFinance();
          showToast('Операция удалена', 'info');
        }
      };
    });

    // Edit subscription buttons
    document.querySelectorAll('.sub-edit-btn').forEach(btn => {
      btn.onclick = () => {
        openSubscriptionModal(btn.dataset.subId);
      };
    });

    // Delete subscription buttons
    document.querySelectorAll('.sub-del-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.subId;
        if (confirm('Удалить подписку?')) {
          state.finances.subscriptions = (state.finances.subscriptions || []).filter(s => s.id !== id);
          saveFinance();
          renderFinance();
          showToast('Подписка удалена', 'info');
        }
      };
    });
  }

  const addIncBtn = document.getElementById('addIncomeBtn');
  if (addIncBtn) addIncBtn.onclick = () => openTxnModal('income');

  const addExpBtn = document.getElementById('addExpenseBtn');
  if (addExpBtn) addExpBtn.onclick = () => openTxnModal('expense');

  const addSubBtn = document.getElementById('openAddSubscriptionBtn');
  if (addSubBtn) addSubBtn.onclick = () => openSubscriptionModal();

  const txnForm = document.getElementById('txnForm');
  if (txnForm) {
    txnForm.onsubmit = (e) => {
      e.preventDefault();
      const type = document.getElementById('txnType').value;
      const amount = parseFloat(document.getElementById('txnAmount').value) || 0;
      const category = document.getElementById('txnCategory').value;
      const note = document.getElementById('txnNote').value.trim();
      const date = document.getElementById('txnDate').value;

      if (!category) { showToast('Выберите категорию', 'warning'); return; }
      if (amount <= 0) { showToast('Введите сумму', 'warning'); return; }

      if (!state.finances.transactions) state.finances.transactions = [];
      state.finances.transactions.push({ id: 'txn-' + Date.now(), type, amount, category, note, date });
      saveFinance();
      renderFinance();
      document.getElementById('txnModal').classList.remove('active');
      showToast(type === 'income' ? 'Доход добавлен! 💚' : 'Расход записан!', 'success');
    };
  }

  const subForm = document.getElementById('subscriptionForm');
  if (subForm) {
    subForm.onsubmit = (e) => {
      e.preventDefault();
      const editId = document.getElementById('subEditId').value;
      const name = document.getElementById('subName').value.trim();
      const icon = document.getElementById('subIcon').value.trim() || detectSubIcon(name);
      const cycle = document.getElementById('subCycle').value || 'monthly';
      const cost = parseFloat(document.getElementById('subCost').value) || 0;
      const nextBillingDate = document.getElementById('subNextBillingDate').value || new Date().toISOString().slice(0, 10);

      if (!name) { showToast('Введите название сервиса', 'warning'); return; }
      if (cost <= 0) { showToast('Введите сумму подписки', 'warning'); return; }

      if (!state.finances.subscriptions) state.finances.subscriptions = [];

      if (editId) {
        const sub = state.finances.subscriptions.find(s => s.id === editId);
        if (sub) {
          Object.assign(sub, { name, icon, cycle, cost, nextBillingDate });
          showToast('Подписка обновлена!', 'success');
        }
      } else {
        state.finances.subscriptions.push({
          id: 'sub-' + Date.now(),
          name,
          icon,
          cycle,
          cost,
          nextBillingDate
        });
        showToast('Подписка добавлена! 💳', 'success');
      }

      saveFinance();
      renderFinance();
      document.getElementById('subscriptionModal').classList.remove('active');
    };
  }

  // ========================================================================
  // 8-STEP GUIDED SPOTLIGHT TOUR ENGINE (REAL-TIME ANCHORING)
  // ========================================================================
  const TOUR_STEPS = [
    {
      tab: 'habits',
      targetId: 'brandHeader',
      titleKey: 'tour_1_title',
      descKey: 'tour_1_desc'
    },
    {
      tab: 'habits',
      targetId: 'addHabitBtn',
      titleKey: 'tour_2_title',
      descKey: 'tour_2_desc'
    },
    {
      tab: 'habits',
      targetId: 'habitGridWrap',
      titleKey: 'tour_3_title',
      descKey: 'tour_3_desc'
    },
    {
      tab: 'habits',
      targetId: 'habitAnalyticsPanel',
      titleKey: 'tour_4_title',
      descKey: 'tour_4_desc'
    },
    {
      tab: 'habits',
      targetId: 'navTabs',
      titleKey: 'tour_5_title',
      descKey: 'tour_5_desc'
    },
    {
      tab: 'tasks',
      targetId: 'tasksSection',
      titleKey: 'tour_6_title',
      descKey: 'tour_6_desc'
    },
    {
      tab: 'finance',
      targetId: 'financeSection',
      titleKey: 'tour_7_title',
      descKey: 'tour_7_desc'
    },
    {
      tab: 'habits',
      targetId: 'settingsBtn',
      titleKey: 'tour_8_title',
      descKey: 'tour_8_desc'
    }
  ];

  let currentTourStep = 0;
  let tourActive = false;
  let tourRafId = null;
  let tourResizeObserver = null;

  function updateTourPosition() {
    if (!tourActive) return;
    const step = TOUR_STEPS[currentTourStep];
    if (!step) return;

    const targetEl = document.getElementById(step.targetId);
    const spotlight = document.getElementById('tourSpotlightBox');
    const popover = document.getElementById('tourPopoverCard');
    if (!spotlight || !popover) return;

    if (targetEl && targetEl.offsetParent !== null) {
      const rect = targetEl.getBoundingClientRect();

      // Spotlight positioning (fixed viewport coordinates)
      spotlight.style.display = 'block';
      spotlight.style.top = `${Math.round(rect.top - 6)}px`;
      spotlight.style.left = `${Math.round(rect.left - 6)}px`;
      spotlight.style.width = `${Math.round(rect.width + 12)}px`;
      spotlight.style.height = `${Math.round(rect.height + 12)}px`;

      // Popover size & clamped positioning
      const popWidth = Math.min(340, window.innerWidth - 32);
      const popHeight = popover.offsetHeight || 220;

      // Align horizontally to target center, clamp to screen boundaries
      let popLeft = rect.left + (rect.width / 2) - (popWidth / 2);
      popLeft = Math.max(16, Math.min(window.innerWidth - popWidth - 16, popLeft));

      // Align vertically: default below target
      let popTop = rect.bottom + 12;

      // If overflowing bottom, test placing above target
      if (popTop + popHeight > window.innerHeight - 16) {
        if (rect.top - 12 - popHeight >= 16) {
          popTop = rect.top - 12 - popHeight;
        } else {
          popTop = Math.max(16, Math.min(window.innerHeight - popHeight - 16, popTop));
        }
      }

      popover.style.top = `${Math.round(popTop)}px`;
      popover.style.left = `${Math.round(popLeft)}px`;
      popover.style.width = `${popWidth}px`;
    } else {
      spotlight.style.display = 'none';
      const popWidth = Math.min(340, window.innerWidth - 32);
      const popHeight = popover.offsetHeight || 220;
      popover.style.top = `${Math.round((window.innerHeight - popHeight) / 2)}px`;
      popover.style.left = `${Math.round((window.innerWidth - popWidth) / 2)}px`;
      popover.style.width = `${popWidth}px`;
    }
  }

  function onTourViewportChange() {
    if (!tourActive) return;
    if (tourRafId) cancelAnimationFrame(tourRafId);
    tourRafId = requestAnimationFrame(() => {
      updateTourPosition();
    });
  }

  function startTour() {
    tourActive = true;
    currentTourStep = 0;
    document.getElementById('tourOverlay').classList.add('active');

    window.addEventListener('resize', onTourViewportChange, { passive: true });
    window.addEventListener('scroll', onTourViewportChange, { passive: true, capture: true });

    if (window.ResizeObserver) {
      try {
        tourResizeObserver = new ResizeObserver(onTourViewportChange);
        tourResizeObserver.observe(document.body);
      } catch (e) { }
    }

    showTourStep(0);
  }

  function endTour() {
    tourActive = false;
    if (tourRafId) cancelAnimationFrame(tourRafId);
    window.removeEventListener('resize', onTourViewportChange);
    window.removeEventListener('scroll', onTourViewportChange, true);
    if (tourResizeObserver) {
      tourResizeObserver.disconnect();
      tourResizeObserver = null;
    }

    document.getElementById('tourOverlay').classList.remove('active');
    state.prefs.tourCompleted = true;
    savePrefs();
  }

  function showTourStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    currentTourStep = index;
    const step = TOUR_STEPS[index];

    switchTab(step.tab);

    const stepOf = state.prefs.lang === 'ru' ? 'Шаг' : 'Step';
    const ofLabel = state.prefs.lang === 'ru' ? 'из' : 'of';
    const finishLabel = state.prefs.lang === 'ru' ? 'Завершить' : 'Finish';
    const nextLabel = state.prefs.lang === 'ru' ? 'Далее' : 'Next';
    const prevLabel = state.prefs.lang === 'ru' ? 'Назад' : 'Previous';
    const skipLabel = state.prefs.lang === 'ru' ? 'Пропустить' : 'Skip';

    document.getElementById('tourStepBadge').textContent = `${stepOf} ${index + 1} ${ofLabel} ${TOUR_STEPS.length}`;
    document.getElementById('tourPopoverTitle').textContent = t(step.titleKey);
    document.getElementById('tourPopoverDesc').textContent = t(step.descKey);

    document.getElementById('tourPrevBtn').style.visibility = index === 0 ? 'hidden' : 'visible';
    document.getElementById('tourPrevBtn').textContent = prevLabel;
    document.getElementById('tourSkipBtn').textContent = skipLabel;
    document.getElementById('tourNextBtn').textContent = index === TOUR_STEPS.length - 1 ? finishLabel : nextLabel;

    setTimeout(() => {
      const targetEl = document.getElementById(step.targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      updateTourPosition();
      setTimeout(updateTourPosition, 80);
      setTimeout(updateTourPosition, 200);
    }, 80);
  }

  document.getElementById('tourNextBtn').onclick = () => {
    if (currentTourStep >= TOUR_STEPS.length - 1) {
      endTour();
      showToast(state.prefs.lang === 'ru' ? 'Обучение завершено!' : 'Tour completed! Welcome aboard.', 'success');
    } else {
      showTourStep(currentTourStep + 1);
    }
  };

  document.getElementById('tourPrevBtn').onclick = () => {
    if (currentTourStep > 0) showTourStep(currentTourStep - 1);
  };

  document.getElementById('tourSkipBtn').onclick = endTour;
  document.getElementById('tourCloseBtn').onclick = endTour;
  const openHelpTourBtn = document.getElementById('openHelpTourBtn');
  if (openHelpTourBtn) {
    let dynamicHelpActive = false;
    const HELP_MAP = {
      settingsBtn: {
        title: t('tour_8_title'),
        desc: t('tour_8_desc'),
        fn: 'openSettings',
        loc: 'app.js:4320'
      },
      addHabitBtn: {
        title: t('tour_2_title'),
        desc: t('tour_2_desc'),
        fn: 'openHabitModal',
        loc: 'app.js:2041'
      },
      aiAssistantBtn: {
        title: 'AI Assistant',
        desc: 'Opens AI chat drawer',
        fn: 'openAiDrawer',
        loc: 'app.js:4390'
      }
      // Add more mappings as needed
    };

    function createTooltip(target, help) {
      const tooltip = document.createElement('div');
      tooltip.className = 'dyn-tooltip';
      tooltip.innerHTML = `<div class="dyn-tooltip-title">${help.title}</div>` +
        `<div class="dyn-tooltip-desc">${help.desc}</div>` +
        `<div class="dyn-tooltip-fn">${help.fn} @ ${help.loc}</div>`;
      document.body.appendChild(tooltip);
      const rect = target.getBoundingClientRect();
      const top = rect.top + window.scrollY - tooltip.offsetHeight - 8;
      const left = rect.left + window.scrollX + (rect.width - tooltip.offsetWidth) / 2;
      tooltip.style.top = `${top < 0 ? rect.bottom + 8 + window.scrollY : top}px`;
      tooltip.style.left = `${Math.max(8, left)}px`;
      tooltip.classList.add('visible');
      return tooltip;
    }

    function enableDynamicHelp() {
      Object.keys(HELP_MAP).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('hint-target');
        let tooltipEl = null;
        el.addEventListener('mouseenter', () => {
          if (!tooltipEl) tooltipEl = createTooltip(el, HELP_MAP[id]);
        });
        el.addEventListener('mouseleave', () => {
          if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
        });
      });
    }

    function disableDynamicHelp() {
      Object.keys(HELP_MAP).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('hint-target');
      });
      // Remove any lingering tooltips
      document.querySelectorAll('.dyn-tooltip').forEach(t => t.remove());
    }

    openHelpTourBtn.onclick = () => {
      dynamicHelpActive = !dynamicHelpActive;
      if (dynamicHelpActive) {
        enableDynamicHelp();
        showToast(state.prefs.lang === 'ru' ? 'Подсказки включены' : 'Hints enabled', 'info');
      } else {
        disableDynamicHelp();
        showToast(state.prefs.lang === 'ru' ? 'Подсказки выключены' : 'Hints disabled', 'info');
      }
    };
  }



  // ========================================================================
  // NAVIGATION & SETTINGS
  // ========================================================================
  let activeTab = 'habits';
  let isSimulatedOffline = false;

  function switchTab(tabId) {
    if (tabId === 'developer') {
      ensureDevViewMounted();
    }
    activeTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.remove('active');
      view.style.removeProperty('display');
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.classList.add('active');
      targetView.style.removeProperty('display');
    }

    if (tabId === 'habits') renderHabitWaveChart();
    if (tabId === 'finance') renderFinance();
    if (tabId === 'developer') renderDevDashboard();
  }

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.getAttribute('data-tab'));
  });

  document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(btn => {
    btn.onclick = () => switchTab(btn.getAttribute('data-tab'));
  });

  const mobileNavSettingsBtn = document.getElementById('mobileNavSettingsBtn');
  if (mobileNavSettingsBtn) {
    mobileNavSettingsBtn.onclick = () => {
      document.getElementById('settingsModal').classList.add('active');
    };
  }

  // ========================================================================
  // DEVELOPER MODE & PASSCODE ACCESS ENGINE
  // ========================================================================
  const brandHeader = document.getElementById('brandHeader');
  if (brandHeader) {
    brandHeader.style.cursor = 'pointer';
    brandHeader.title = 'Habit';
    brandHeader.addEventListener('click', () => {
      switchTab('habits');
    });
  }

  const VALID_DEV_CODES = ['1337', 'DEV', 'DEVELOPER', 'ADMIN', '7777'];

  function updateDevSettingsButton(isUnlocked) {
    const label = document.getElementById('btnSettingsDevLabel');
    if (label) {
      label.textContent = isUnlocked ? t('dev_open_btn') : t('dev_activate_btn');
    }
  }

  function openDevPasscodeModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) settingsModal.classList.remove('active');

    const modal = document.getElementById('devPasscodeModal');
    const input = document.getElementById('devPasscodeInput');
    const err = document.getElementById('devPasscodeError');
    if (modal) {
      modal.classList.add('active');
    }
    if (err) {
      err.classList.add('hidden');
      err.textContent = '';
    }
    if (input) {
      input.value = '';
      input.classList.remove('input-error');
      setTimeout(() => input.focus(), 120);
    }
  }

  function handleDevPasscodeSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('devPasscodeInput');
    const err = document.getElementById('devPasscodeError');
    if (!input) return;

    const entered = input.value.trim().toUpperCase();
    if (VALID_DEV_CODES.includes(entered)) {
      const modal = document.getElementById('devPasscodeModal');
      if (modal) modal.classList.remove('active');
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal) settingsModal.classList.remove('active');

      unlockDevMode();
      input.value = '';
      if (err) err.classList.add('hidden');
    } else {
      input.classList.remove('input-error');
      void input.offsetWidth; // trigger reflow
      input.classList.add('input-error');
      if (err) {
        err.textContent = t('dev_code_error');
        err.classList.remove('hidden');
      }
      input.select();
    }
  }

  // Developer settings button click handler
  const btnSettingsOpenDev = document.getElementById('btnSettingsOpenDev');
  if (btnSettingsOpenDev) {
    btnSettingsOpenDev.onclick = () => {
      const isUnlocked = localStorage.getItem(STORAGE_KEYS.DEV_MODE) === 'true';
      if (isUnlocked) {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) settingsModal.classList.remove('active');
        ensureDevViewMounted();
        switchTab('developer');
      } else {
        openDevPasscodeModal();
      }
    };
  }

  const devPasscodeForm = document.getElementById('devPasscodeForm');
  if (devPasscodeForm) {
    devPasscodeForm.onsubmit = handleDevPasscodeSubmit;
  }

  function unlockDevMode() {
    localStorage.setItem(STORAGE_KEYS.DEV_MODE, 'true');
    const brand = document.getElementById('brandHeader');
    if (brand) {
      brand.classList.remove('dev-unlocked-pulse', 'dev-locked-pulse');
      void brand.offsetWidth; // trigger reflow
      brand.classList.add('dev-unlocked-pulse');
      setTimeout(() => brand.classList.remove('dev-unlocked-pulse'), 1200);
    }
    const navDevTab = document.getElementById('navTabDeveloper');
    if (navDevTab) {
      navDevTab.classList.remove('hidden');
      navDevTab.style.display = 'inline-flex';
    }
    updateDevSettingsButton(true);
    ensureDevViewMounted();
    showToast(state.prefs.lang === 'ru' ? 'Режим разработчика активирован 🛠️' : 'Developer Mode Unlocked 🛠️', 'success');
    switchTab('developer');
  }

  function lockDevMode(skipConfirm = false) {
    const confirmMsg = state.prefs.lang === 'ru'
      ? 'Заблокировать и скрыть панель разработчика?'
      : 'Lock and hide Developer Mode?';
    if (skipConfirm || confirm(confirmMsg)) {
      localStorage.removeItem(STORAGE_KEYS.DEV_MODE);
      const brand = document.getElementById('brandHeader');
      if (brand) {
        brand.classList.remove('dev-unlocked-pulse', 'dev-locked-pulse');
        void brand.offsetWidth; // trigger reflow
        brand.classList.add('dev-locked-pulse');
        setTimeout(() => brand.classList.remove('dev-locked-pulse'), 1000);
      }
      const navDevTab = document.getElementById('navTabDeveloper');
      if (navDevTab) {
        navDevTab.classList.add('hidden');
        navDevTab.style.display = 'none';
      }
      updateDevSettingsButton(false);
      const devView = document.getElementById('view-developer');
      if (devView) {
        devView.remove();
      }
      if (activeTab === 'developer') {
        switchTab('habits');
      }
      showToast(state.prefs.lang === 'ru' ? 'Режим разработчика отключён 🔒' : 'Developer Mode Disabled 🔒', 'info');
    }
  }

  function checkDevModePersisted() {
    const isUnlocked = localStorage.getItem(STORAGE_KEYS.DEV_MODE) === 'true';
    const navDevTab = document.getElementById('navTabDeveloper');
    if (navDevTab) {
      navDevTab.classList.toggle('hidden', !isUnlocked);
      navDevTab.style.display = isUnlocked ? 'inline-flex' : 'none';
    }
    updateDevSettingsButton(isUnlocked);
    if (isUnlocked) {
      ensureDevViewMounted();
    }
  }

  function renderDevStateJson() {
    const viewer = document.getElementById('devStateJsonViewer');
    if (viewer) {
      const debugPayload = {
        timestamp: getNow().toISOString(),
        isVirtualTime: virtualTimeOffsetMs !== 0,
        virtualDate: getTodayString(),
        simulatedOffline: isSimulatedOffline,
        firebase: {
          configured: isFirebaseConfigured(),
          projectId: firebaseConfig ? firebaseConfig.projectId : null,
          authDomain: firebaseConfig ? firebaseConfig.authDomain : null,
          user: currentAuthUser ? { uid: currentAuthUser.uid, email: currentAuthUser.email, displayName: currentAuthUser.displayName } : null,
          lastSync: lastSyncTimestamp ? lastSyncTimestamp.toISOString() : null
        },
        storageSummary: {
          habitsCount: (state.habits || []).length,
          tasksCount: (state.tasks || []).length,
          transactionsCount: ((state.finances && state.finances.transactions) || []).length,
          subscriptionsCount: ((state.finances && state.finances.subscriptions) || []).length
        },
        state: state
      };
      viewer.textContent = JSON.stringify(debugPayload, null, 2);
    }
  }

  function renderDevDashboard() {
    populateDevFbForm();
    updateDevFbStatus();
    renderDevStateJson();

    const txt = document.getElementById('devOfflineStatusText');
    if (txt) {
      txt.textContent = isSimulatedOffline
        ? (state.prefs.lang === 'ru' ? 'Офлайн симуляция: ВКЛ' : 'Offline Sim: ON')
        : (state.prefs.lang === 'ru' ? 'Офлайн симуляция: ВЫКЛ' : 'Offline Sim: OFF');
    }

    // Time-Travel status badge & date input
    const timeStatus = document.getElementById('devVirtualDateStatus');
    const dateInput = document.getElementById('devVirtualDateInput');
    const curNow = getNow();

    if (dateInput) {
      dateInput.value = getTodayString();
    }

    if (timeStatus) {
      if (virtualTimeOffsetMs === 0) {
        timeStatus.textContent = '🕒 Реальное время';
        timeStatus.style.background = 'rgba(16, 185, 129, 0.12)';
        timeStatus.style.color = 'var(--accent-emerald)';
        timeStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      } else {
        const dStr = curNow.toLocaleDateString(state.prefs.lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        timeStatus.textContent = `⏳ ${dStr} (Виртуальное)`;
        timeStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        timeStatus.style.color = 'var(--accent-amber)';
        timeStatus.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      }
    }
  }

  // --- QA Mock Data Generator ---
  function generateDemoData() {
    const now = getNow();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const monthKey = `${curYear}-${curMonth}`;
    const daysInMonth = getDaysInActiveMonth();
    const todayDay = now.getDate();

    // 1. Mock Habits
    const demoHabits = [
      {
        id: 'h-demo-1',
        title: 'Чтение профессиональной литературы',
        emoji: '📖',
        color: '#38bdf8',
        category: 'Learning',
        targetMin: 30,
        freq: 'daily',
        dow: [1, 2, 3, 4, 5, 6, 0],
        reminder: true,
        reminderTime: '21:00',
        checks: {}
      },
      {
        id: 'h-demo-2',
        title: 'Силовая тренировка / Зал',
        emoji: '🏋️',
        color: '#10b981',
        category: 'Health',
        targetMin: 60,
        freq: 'custom',
        dow: [1, 3, 5],
        reminder: true,
        reminderTime: '18:30',
        checks: {}
      },
      {
        id: 'h-demo-3',
        title: 'Норма воды 2.5 литра',
        emoji: '💧',
        color: '#06b6d4',
        category: 'Health',
        targetMin: 0,
        freq: 'daily',
        dow: [1, 2, 3, 4, 5, 6, 0],
        reminder: false,
        reminderTime: '10:00',
        checks: {}
      },
      {
        id: 'h-demo-4',
        title: 'Медитация и дыхание',
        emoji: '🧘',
        color: '#a855f7',
        category: 'Mindfulness',
        targetMin: 15,
        freq: 'daily',
        dow: [1, 2, 3, 4, 5, 6, 0],
        reminder: true,
        reminderTime: '08:00',
        checks: {}
      },
      {
        id: 'h-demo-5',
        title: 'Deep Work фокус-сессия',
        emoji: '💻',
        color: '#f59e0b',
        category: 'Productivity',
        targetMin: 90,
        freq: 'custom',
        dow: [1, 2, 3, 4, 5],
        reminder: true,
        reminderTime: '11:00',
        checks: {}
      },
      {
        id: 'h-demo-6',
        title: 'Английский язык (Anki)',
        emoji: '🇬🇧',
        color: '#ec4899',
        category: 'Learning',
        targetMin: 20,
        freq: 'daily',
        dow: [1, 2, 3, 4, 5, 6, 0],
        reminder: false,
        reminderTime: '19:00',
        checks: {}
      }
    ];

    demoHabits.forEach((habit, hIdx) => {
      habit.checks = {};
      habit.checks[monthKey] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        if (day <= todayDay) {
          const shouldCheck = Math.random() < (0.75 + (hIdx % 3) * 0.08);
          if (shouldCheck) {
            habit.checks[monthKey].push(day);
          }
        }
      }
    });

    // 2. Mock Tasks
    const formatDateOffset = (offsetDays) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const demoTasks = [
      {
        id: 't-demo-1',
        title: 'Завершить квартальный отчёт по проекту Habit',
        category: 'Productivity',
        priority: 'Urgent',
        dueDate: formatDateOffset(1),
        notes: 'Сверить финансовые графики и метрики продуктивности',
        completed: false
      },
      {
        id: 't-demo-2',
        title: 'Оплатить облачный хостинг и продлить домен',
        category: 'Finance',
        priority: 'High',
        dueDate: formatDateOffset(3),
        notes: 'Проверить автоматическое списание',
        completed: false
      },
      {
        id: 't-demo-3',
        title: 'Пройти модуль по TypeScript и Web Workers',
        category: 'Learning',
        priority: 'Medium',
        dueDate: formatDateOffset(7),
        notes: 'Конспект в Notion и практические упражнения',
        completed: false
      },
      {
        id: 't-demo-4',
        title: 'Записаться на плановый осмотр к стоматологу',
        category: 'Health',
        priority: 'Low',
        dueDate: formatDateOffset(12),
        notes: 'Клиника на Арбате',
        completed: false
      },
      {
        id: 't-demo-5',
        title: 'Купить спортивный инвентарь и витамины',
        category: 'Personal',
        priority: 'Medium',
        dueDate: formatDateOffset(-2),
        notes: 'Заказ в пункте выдачи',
        completed: true
      }
    ];

    // 3. Mock Finances (Income, Expenses & Subscriptions)
    const demoTransactions = [
      { id: 'txn-demo-1', type: 'income', amount: 180000, category: 'salary', note: 'Основная выплата за месяц', date: formatDateOffset(-5) },
      { id: 'txn-demo-2', type: 'income', amount: 35000, category: 'freelance', note: 'UI/UX дизайн мобильного приложения', date: formatDateOffset(-2) },
      { id: 'txn-demo-3', type: 'expense', amount: 45000, category: 'housing', note: 'Аренда квартиры и ЖКХ', date: formatDateOffset(-4) },
      { id: 'txn-demo-4', type: 'expense', amount: 14500, category: 'food', note: 'Супермаркет и доставка продуктов', date: formatDateOffset(-3) },
      { id: 'txn-demo-5', type: 'expense', amount: 6200, category: 'transport', note: 'Такси и проездной', date: formatDateOffset(-1) },
      { id: 'txn-demo-6', type: 'expense', amount: 8900, category: 'fun', note: 'Кино, ресторан с друзьями', date: formatDateOffset(0) },
      { id: 'txn-demo-7', type: 'expense', amount: 12000, category: 'health', note: 'Абонемент в фитнес-клуб и витамины', date: formatDateOffset(-6) }
    ];

    const demoSubscriptions = [
      { id: 'sub-demo-1', name: 'Netflix Premium 4K', cost: 990, nextBillingDate: formatDateOffset(4), icon: '🎬' },
      { id: 'sub-demo-2', name: 'Spotify Individual', cost: 399, nextBillingDate: formatDateOffset(9), icon: '🎵' },
      { id: 'sub-demo-3', name: 'iCloud 2TB Storage', cost: 599, nextBillingDate: formatDateOffset(14), icon: '☁️' },
      { id: 'sub-demo-4', name: 'ChatGPT Plus / Copilot', cost: 1990, nextBillingDate: formatDateOffset(1), icon: '🤖' }
    ];

    state.habits = demoHabits;
    state.tasks = demoTasks;
    state.finances = {
      transactions: demoTransactions,
      subscriptions: demoSubscriptions
    };

    saveAll();
    renderHabitTrackerFull();
    renderTasks();
    renderFinance();
    if (activeTab === 'developer') renderDevDashboard();
    showToast(state.prefs.lang === 'ru' ? 'Демо-данные успешно сгенерированы! 🚀' : 'Demo data populated successfully! 🚀', 'success');
  }

  // --- Wipe All Data (0-State) Protected with Keyword Confirmation ---
  function wipeAllDevData() {
    if (localStorage.getItem(STORAGE_KEYS.DEV_MODE) !== 'true') return;
    const isRu = state.prefs.lang === 'ru';
    const warningMsg = isRu
      ? '⚠️ ВНИМАНИЕ: Это действие БЕЗВОЗВРАТНО сотрёт ВСЕ привычки, задачи и финансы (0-state)!\n\nДля подтверждения введите слово "УДАЛИТЬ" (или "DELETE"):'
      : '⚠️ WARNING: This will PERMANENTLY ERASE ALL habits, tasks, and finances (0-state)!\n\nTo confirm, type "DELETE":';
    const input = prompt(warningMsg);
    if (!input) {
      showToast(isRu ? 'Операция отменена. Данные сохранены 🛡️' : 'Cancelled. Data preserved 🛡️', 'info');
      return;
    }
    const normalized = input.trim().toUpperCase();
    if (normalized !== 'УДАЛИТЬ' && normalized !== 'DELETE') {
      showToast(isRu ? 'Неверная фраза подтверждения. Сброс отменён 🛡️' : 'Incorrect phrase. Reset aborted 🛡️', 'warning');
      return;
    }
    state.habits = [];
    state.tasks = [];
    state.finances = {
      transactions: [],
      subscriptions: []
    };
    saveAll();
    renderHabitTrackerFull();
    renderTasks();
    renderFinance();
    if (activeTab === 'developer') renderDevDashboard();
    showToast(isRu ? 'Все данные очищены (0-State) 🧹' : 'All data wiped to clean slate! 🧹', 'info');
  }

  // --- Test Browser Web Notification ---
  async function testBrowserNotification() {
    if (!('Notification' in window)) {
      showToast(state.prefs.lang === 'ru' ? 'Браузер не поддерживает Web Notifications' : 'Browser does not support Web Notifications', 'warning');
      return;
    }
    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
    }
    if (perm === 'granted') {
      try {
        const notif = new Notification('🎯 Habit: Тестовое уведомление', {
          body: 'Система веб-уведомлений и напоминаний привычек работает исправно!',
          tag: 'habit-test-notif'
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        showToast(state.prefs.lang === 'ru' ? 'Уведомление успешно отправлено! 🔔' : 'Notification dispatched! 🔔', 'success');
      } catch (err) {
        showToast('Notification error: ' + err.message, 'error');
      }
    } else {
      showToast(state.prefs.lang === 'ru' ? 'Разрешение на уведомления отклонено' : 'Notification permission denied', 'warning');
    }
  }

  // --- Quick State Export & Import ---
  function quickCopyStateJson() {
    const stateStr = JSON.stringify(state, null, 2);
    navigator.clipboard.writeText(stateStr);
    showToast(state.prefs.lang === 'ru' ? 'Состояние (State JSON) скопировано! 📋' : 'State JSON copied! 📋', 'success');
  }

  function applyQuickStateImport(jsonText) {
    if (!jsonText || !jsonText.trim()) {
      showToast(state.prefs.lang === 'ru' ? 'Вставьте валидный JSON состояния' : 'Please paste valid State JSON', 'warning');
      return;
    }
    try {
      const parsed = JSON.parse(jsonText.trim());
      if (parsed && typeof parsed === 'object') {
        if (parsed.habits) state.habits = parsed.habits;
        if (parsed.tasks) state.tasks = parsed.tasks;
        if (parsed.finances) state.finances = parsed.finances;
        if (parsed.prefs) state.prefs = Object.assign({}, state.prefs, parsed.prefs);
        saveAll();
        renderHabitTrackerFull();
        renderTasks();
        renderFinance();
        if (activeTab === 'developer') renderDevDashboard();
        showToast(state.prefs.lang === 'ru' ? 'Состояние успешно импортировано! 📥' : 'State imported successfully! 📥', 'success');
      } else {
        showToast(state.prefs.lang === 'ru' ? 'Неверная структура JSON' : 'Invalid JSON structure', 'error');
      }
    } catch (e) {
      showToast(state.prefs.lang === 'ru' ? 'Ошибка парсинга JSON: ' + e.message : 'JSON parse error: ' + e.message, 'error');
    }
  }

  // ========================================================================
  // LAZY DEVELOPER VIEW INJECTION & EVENT LISTENERS
  // ========================================================================
  function getDevViewHtml() {
    return `<div class="dev-dashboard-layout">
        <div class="section-action-header">
          <div class="section-title-wrap">
            <div class="flex-row gap-sm">
              <h2>🛠️ Панель разработчика</h2>
              <span class="fb-status-pill connected font-mono-sm">DEV MODE</span>
            </div>
            <p>Прямой доступ к генераторам данных, симулятору времени, Firebase и инспекции состояния</p>
          </div>
          <button class="btn-secondary text-coral btn-sm" id="btnLockDevMode">
            <i data-lucide="lock" class="icon-xs"></i>
            <span>Отключить режим разработчика</span>
          </button>
        </div>

        <div class="dev-dashboard-grid">
          <div class="flex-col gap-lg">
            <div class="panel-card">
              <div class="panel-header-flex">
                <div class="panel-title">
                  <i data-lucide="flask-conical" class="icon-sm text-emerald"></i>
                  <span>Генератор демо-данных и тестирование QA</span>
                </div>
              </div>
              <div class="flex-col gap-sm">
                <div class="form-grid-2col gap-sm">
                  <button type="button" class="btn-primary btn-sm" id="btnDevSeedData">
                    <i data-lucide="sparkles" class="icon-sm"></i>
                    <span>Generate Demo Data</span>
                  </button>
                  <button type="button" class="btn-secondary text-coral btn-sm" id="btnDevWipeData">
                    <i data-lucide="trash-2" class="icon-sm"></i>
                    <span>Wipe All Data (0-State)</span>
                  </button>
                </div>

                <div class="dev-tools-grid">
                  <button type="button" class="btn-secondary btn-xs" id="btnDevQuickCopyState">
                    <i data-lucide="copy" class="icon-xs"></i>
                    <span>Export State</span>
                  </button>
                  <button type="button" class="btn-secondary btn-xs" id="btnDevOpenImportState">
                    <i data-lucide="file-input" class="icon-xs"></i>
                    <span>Import State</span>
                  </button>
                  <button type="button" class="btn-secondary btn-xs" id="btnDevTestNotification">
                    <i data-lucide="bell-ring" class="icon-xs text-amber"></i>
                    <span>Test Notif</span>
                  </button>
                </div>

                <div id="devStateImportArea" class="hidden panel-card">
                  <label class="form-label font-mono-sm">Вставьте JSON состояния (habits, tasks, finances):</label>
                  <textarea id="devStateImportInput" class="form-input font-mono-sm w-full" rows="3" placeholder='{"habits": [...], "tasks": [...], "finances": {...}}'></textarea>
                  <div class="flex-row gap-xs mt-sm justify-end">
                    <button type="button" class="btn-secondary btn-xs" id="btnDevCancelStateImport">Отмена</button>
                    <button type="button" class="btn-primary btn-xs" id="btnDevApplyStateImport">Применить State</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-header-flex">
                <div class="panel-title">
                  <i data-lucide="cloud" class="icon-sm text-accent"></i>
                  <span>Конфигурация Firebase Cloud</span>
                </div>
                <span class="fb-status-pill offline" id="devFbStatusPill">⚪ Офлайн</span>
              </div>

              <div class="fb-config-panel panel-card">
                <div class="fb-config-header-row">
                  <div class="settings-info">
                    <h4>API Ключи проекта</h4>
                    <p class="text-muted">Параметры подключения к Cloud Firestore & Auth</p>
                  </div>
                  <button type="button" class="btn-secondary btn-sm" id="btnDevPasteJsonConfig">
                    <i data-lucide="clipboard-paste" class="icon-xs"></i>
                    <span>Вставить JSON</span>
                  </button>
                </div>

                <div id="devFbJsonPasteArea" class="hidden">
                  <textarea id="devFbJsonInput" class="form-input font-mono-sm w-full" rows="3" placeholder="Вставьте const firebaseConfig = { ... } или JSON"></textarea>
                  <div class="flex-row gap-xs mt-sm justify-end">
                    <button type="button" class="btn-secondary btn-xs" id="btnDevCancelJsonPaste">Отмена</button>
                    <button type="button" class="btn-primary btn-xs" id="btnDevApplyJsonPaste">Применить JSON</button>
                  </div>
                </div>

                <form id="devFbConfigForm">
                  <div class="form-grid-2col gap-sm">
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">API Key</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbApiKey" placeholder="AIzaSy..." />
                    </div>
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">Auth Domain</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbAuthDomain" placeholder="app.firebaseapp.com" />
                    </div>
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">Project ID</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbProjectId" placeholder="my-habit-app" />
                    </div>
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">Storage Bucket</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbStorageBucket" placeholder="app.appspot.com" />
                    </div>
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">Messaging Sender ID</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbMessagingSenderId" placeholder="1234567890" />
                    </div>
                    <div class="form-group form-group-compact">
                      <label class="form-label font-mono-sm">App ID</label>
                      <input type="text" class="form-input font-mono-sm" id="devFbAppId" placeholder="1:123456:web:abcdef" />
                    </div>
                  </div>

                  <div class="flex-row justify-between gap-sm mt-sm">
                    <button type="button" class="btn-secondary text-coral btn-sm" id="btnDevResetFirebaseConfig">
                      <i data-lucide="trash-2" class="icon-xs"></i>
                      <span>Сбросить</span>
                    </button>
                    <button type="submit" class="btn-primary btn-sm" id="btnDevSaveFirebaseConfig">
                      <i data-lucide="save" class="icon-xs"></i>
                      <span>Сохранить и подключить</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="flex-col gap-lg">
            <div class="panel-card">
              <div class="panel-header-flex">
                <div class="panel-title">
                  <i data-lucide="clock" class="icon-sm text-amber"></i>
                  <span>Симулятор машины времени (Time-Travel)</span>
                </div>
                <span class="virtual-date-badge" id="devVirtualDateStatus">🕒 Реальное время</span>
              </div>
              <p class="text-muted font-mono-sm">Сдвигайте виртуальную дату приложения для мгновенной проверки дедлайнов, стриков и списания подписок.</p>

              <div class="time-travel-bar">
                <button type="button" class="time-shift-btn" id="btnDevTimeSub1M">-1 мес</button>
                <button type="button" class="time-shift-btn" id="btnDevTimeSub7D">-7 дн</button>
                <button type="button" class="time-shift-btn" id="btnDevTimeSub1D">-1 дн</button>
                <button type="button" class="time-shift-btn reset-btn" id="btnDevTimeReset">Сегодня (Reset)</button>
                <button type="button" class="time-shift-btn" id="btnDevTimeAdd1D">+1 дн</button>
                <button type="button" class="time-shift-btn" id="btnDevTimeAdd7D">+7 дн</button>
                <button type="button" class="time-shift-btn" id="btnDevTimeAdd1M">+1 мес</button>
              </div>

              <div class="flex-row gap-sm mt-sm">
                <input type="date" class="form-input dev-virtual-date-input" id="devVirtualDateInput" />
                <button type="button" class="btn-primary btn-sm" id="btnDevApplyVirtualDate">Установить дату</button>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-header-flex">
                <div class="panel-title">
                  <i data-lucide="activity" class="icon-sm text-amber"></i>
                  <span>Диагностика и прямое управление</span>
                </div>
              </div>
              <div class="dev-tools-grid">
                <button type="button" class="btn-secondary btn-sm" id="btnDevForcePush">
                  <i data-lucide="upload-cloud" class="icon-sm text-emerald"></i>
                  <span>Force Cloud Push</span>
                </button>
                <button type="button" class="btn-secondary btn-sm" id="btnDevForcePull">
                  <i data-lucide="download-cloud" class="icon-sm text-accent"></i>
                  <span>Force Cloud Pull</span>
                </button>
                <button type="button" class="btn-secondary btn-sm" id="btnDevToggleOffline">
                  <i data-lucide="wifi-off" class="icon-sm text-amber"></i>
                  <span id="devOfflineStatusText">Офлайн симуляция</span>
                </button>
                <button type="button" class="btn-secondary btn-sm" id="btnDevExportLogs">
                  <i data-lucide="file-text" class="icon-sm text-accent"></i>
                  <span>Экспорт Debug Logs</span>
                </button>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-header-flex">
                <div class="panel-title">
                  <i data-lucide="code" class="icon-sm text-accent"></i>
                  <span>Инспектор состояния (Live JSON)</span>
                </div>
                <div class="flex-row gap-xs">
                  <button class="btn-secondary btn-xs" id="btnDevRefreshJson" title="Обновить">
                    <i data-lucide="refresh-cw" class="icon-xs"></i>
                    <span>Обновить</span>
                  </button>
                  <button class="btn-secondary btn-xs" id="btnDevCopyJson" title="Копировать">
                    <i data-lucide="copy" class="icon-xs"></i>
                    <span>Копировать</span>
                  </button>
                </div>
              </div>
              <pre class="dev-json-viewer" id="devStateJsonViewer">{}</pre>
            </div>
          </div>
        </div>
      </div>`;
  }

  function ensureDevViewMounted() {
    let devView = document.getElementById('view-developer');
    if (devView) return devView;

    const main = document.querySelector('main.app-main') || document.querySelector('main');
    if (!main) return null;

    devView = document.createElement('section');
    devView.id = 'view-developer';
    devView.className = 'tab-view';
    devView.innerHTML = getDevViewHtml();
    main.appendChild(devView);

    safeRenderIcons();
    attachDevViewEventListeners();
    return devView;
  }

  function attachDevViewEventListeners() {
    // Developer Dashboard Event Listeners
    const btnLockDevMode = document.getElementById('btnLockDevMode');
    if (btnLockDevMode) {
      btnLockDevMode.onclick = lockDevMode;
    }
  
    // QA & Mock Data Generator
    const btnDevSeedData = document.getElementById('btnDevSeedData');
    if (btnDevSeedData) btnDevSeedData.onclick = generateDemoData;
  
    const btnDevWipeData = document.getElementById('btnDevWipeData');
    if (btnDevWipeData) btnDevWipeData.onclick = wipeAllDevData;
  
    const btnDevQuickCopyState = document.getElementById('btnDevQuickCopyState');
    if (btnDevQuickCopyState) btnDevQuickCopyState.onclick = quickCopyStateJson;
  
    const btnDevTestNotification = document.getElementById('btnDevTestNotification');
    if (btnDevTestNotification) btnDevTestNotification.onclick = testBrowserNotification;
  
    const btnDevOpenImportState = document.getElementById('btnDevOpenImportState');
    const devStateImportArea = document.getElementById('devStateImportArea');
    const btnDevCancelStateImport = document.getElementById('btnDevCancelStateImport');
    const btnDevApplyStateImport = document.getElementById('btnDevApplyStateImport');
    const devStateImportInput = document.getElementById('devStateImportInput');
  
    if (btnDevOpenImportState && devStateImportArea) {
      btnDevOpenImportState.onclick = () => {
        const isHidden = devStateImportArea.style.display === 'none';
        devStateImportArea.style.display = isHidden ? 'block' : 'none';
        if (isHidden && devStateImportInput) {
          devStateImportInput.value = '';
          devStateImportInput.focus();
        }
      };
    }
  
    if (btnDevCancelStateImport && devStateImportArea) {
      btnDevCancelStateImport.onclick = () => {
        devStateImportArea.style.display = 'none';
      };
    }
  
    if (btnDevApplyStateImport && devStateImportInput) {
      btnDevApplyStateImport.onclick = () => {
        applyQuickStateImport(devStateImportInput.value);
        if (devStateImportArea) devStateImportArea.style.display = 'none';
      };
    }
  
    // Time-Travel Shift Buttons
    const btnDevTimeSub1M = document.getElementById('btnDevTimeSub1M');
    if (btnDevTimeSub1M) btnDevTimeSub1M.onclick = () => shiftVirtualTime(0, -1);
  
    const btnDevTimeSub7D = document.getElementById('btnDevTimeSub7D');
    if (btnDevTimeSub7D) btnDevTimeSub7D.onclick = () => shiftVirtualTime(-7, 0);
  
    const btnDevTimeSub1D = document.getElementById('btnDevTimeSub1D');
    if (btnDevTimeSub1D) btnDevTimeSub1D.onclick = () => shiftVirtualTime(-1, 0);
  
    const btnDevTimeReset = document.getElementById('btnDevTimeReset');
    if (btnDevTimeReset) btnDevTimeReset.onclick = resetVirtualTime;
  
    const btnDevTimeAdd1D = document.getElementById('btnDevTimeAdd1D');
    if (btnDevTimeAdd1D) btnDevTimeAdd1D.onclick = () => shiftVirtualTime(1, 0);
  
    const btnDevTimeAdd7D = document.getElementById('btnDevTimeAdd7D');
    if (btnDevTimeAdd7D) btnDevTimeAdd7D.onclick = () => shiftVirtualTime(7, 0);
  
    const btnDevTimeAdd1M = document.getElementById('btnDevTimeAdd1M');
    if (btnDevTimeAdd1M) btnDevTimeAdd1M.onclick = () => shiftVirtualTime(0, 1);
  
    const btnDevApplyVirtualDate = document.getElementById('btnDevApplyVirtualDate');
    if (btnDevApplyVirtualDate) {
      btnDevApplyVirtualDate.onclick = () => {
        const dateVal = document.getElementById('devVirtualDateInput').value;
        if (dateVal) {
          const d = new Date(dateVal + 'T12:00:00');
          setVirtualDate(d);
          showToast(state.prefs.lang === 'ru' ? 'Виртуальная дата установлена! ⏳' : 'Virtual date set! ⏳', 'info');
        }
      };
    }
  
    const btnDevPasteJsonConfig = document.getElementById('btnDevPasteJsonConfig');
    const devFbJsonPasteArea = document.getElementById('devFbJsonPasteArea');
    const btnDevCancelJsonPaste = document.getElementById('btnDevCancelJsonPaste');
    const btnDevApplyJsonPaste = document.getElementById('btnDevApplyJsonPaste');
    const devFbJsonInput = document.getElementById('devFbJsonInput');
  
    if (btnDevPasteJsonConfig && devFbJsonPasteArea) {
      btnDevPasteJsonConfig.onclick = () => {
        const isHidden = devFbJsonPasteArea.style.display === 'none';
        devFbJsonPasteArea.style.display = isHidden ? 'block' : 'none';
        if (isHidden && devFbJsonInput) {
          devFbJsonInput.value = '';
          devFbJsonInput.focus();
        }
      };
    }
  
    if (btnDevCancelJsonPaste && devFbJsonPasteArea) {
      btnDevCancelJsonPaste.onclick = () => {
        devFbJsonPasteArea.style.display = 'none';
      };
    }
  
    if (btnDevApplyJsonPaste && devFbJsonInput) {
      btnDevApplyJsonPaste.onclick = () => {
        const text = devFbJsonInput.value.trim();
        if (!text) {
          showToast(state.prefs.lang === 'ru' ? 'Вставьте конфигурацию' : 'Please paste a config', 'warning');
          return;
        }
        const parsed = parseFirebaseConfigInput(text);
        if (parsed) {
          if (parsed.apiKey) document.getElementById('devFbApiKey').value = parsed.apiKey;
          if (parsed.authDomain) document.getElementById('devFbAuthDomain').value = parsed.authDomain;
          if (parsed.projectId) document.getElementById('devFbProjectId').value = parsed.projectId;
          if (parsed.storageBucket) document.getElementById('devFbStorageBucket').value = parsed.storageBucket;
          if (parsed.messagingSenderId) document.getElementById('devFbMessagingSenderId').value = parsed.messagingSenderId;
          if (parsed.appId) document.getElementById('devFbAppId').value = parsed.appId;
  
          if (devFbJsonPasteArea) devFbJsonPasteArea.style.display = 'none';
          showToast(state.prefs.lang === 'ru' ? 'Поля заполнены из JSON! Нажмите «Сохранить»' : 'Fields populated! Click "Save & Connect"', 'success');
        } else {
          showToast(state.prefs.lang === 'ru' ? 'Не удалось распознать формат конфига' : 'Could not parse Firebase config', 'error');
        }
      };
    }
  
    // Developer Firebase Config Form
    const devFbConfigForm = document.getElementById('devFbConfigForm');
    if (devFbConfigForm) {
      devFbConfigForm.onsubmit = async (e) => {
        e.preventDefault();
        const apiKey = (document.getElementById('devFbApiKey') || {}).value.trim();
        const authDomain = (document.getElementById('devFbAuthDomain') || {}).value.trim();
        const projectId = (document.getElementById('devFbProjectId') || {}).value.trim();
        const storageBucket = (document.getElementById('devFbStorageBucket') || {}).value.trim();
        const messagingSenderId = (document.getElementById('devFbMessagingSenderId') || {}).value.trim();
        const appId = (document.getElementById('devFbAppId') || {}).value.trim();
  
        const newCfg = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
        const success = await reinitFirebase(newCfg);
        if (success) {
          const isConnected = isFirebaseConfigured();
          showToast(
            isConnected
              ? (state.prefs.lang === 'ru' ? 'Firebase подключен и сохранён! 🟢' : 'Firebase connected & saved! 🟢')
              : (state.prefs.lang === 'ru' ? 'Конфигурация сохранена (Офлайн режим) ⚪' : 'Config saved (Offline mode) ⚪'),
            isConnected ? 'success' : 'info'
          );
          renderDevDashboard();
        } else {
          showToast(state.prefs.lang === 'ru' ? 'Ошибка подключения Firebase' : 'Error connecting to Firebase', 'error');
        }
      };
    }
  
    // Developer Reset Firebase Button
    const btnDevResetFirebaseConfig = document.getElementById('btnDevResetFirebaseConfig');
    if (btnDevResetFirebaseConfig) {
      btnDevResetFirebaseConfig.onclick = async () => {
        const confirmMsg = state.prefs.lang === 'ru'
          ? 'Сбросить настройки Firebase и вернуться к исходной конфигурации?'
          : 'Reset Firebase settings to default config?';
        if (confirm(confirmMsg)) {
          localStorage.removeItem('habit_app_fb_config');
          await reinitFirebase(DEFAULT_FIREBASE_CONFIG);
          showToast(state.prefs.lang === 'ru' ? 'Конфигурация сброшена' : 'Config reset to default', 'info');
          renderDevDashboard();
        }
      };
    }
  
    // Developer Diagnostics Controls
    const btnDevForcePush = document.getElementById('btnDevForcePush');
    if (btnDevForcePush) {
      btnDevForcePush.onclick = async () => {
        if (isSimulatedOffline) {
          showToast(state.prefs.lang === 'ru' ? 'Офлайн симуляция активна: синхронизация заблокирована' : 'Offline simulation active: sync blocked', 'warning');
          return;
        }
        if (currentAuthUser && firestoreDb) {
          await pushStateToCloud(currentAuthUser);
          renderDevDashboard();
          showToast(state.prefs.lang === 'ru' ? 'Принудительная синхронизация выполнена! ☁️' : 'Force cloud push complete! ☁️', 'success');
        } else {
          showToast(state.prefs.lang === 'ru' ? 'Firebase не авторизован (гостевой режим)' : 'Firebase not authenticated (guest mode)', 'warning');
        }
      };
    }
  
    const btnDevForcePull = document.getElementById('btnDevForcePull');
    if (btnDevForcePull) {
      btnDevForcePull.onclick = async () => {
        if (isSimulatedOffline) {
          showToast(state.prefs.lang === 'ru' ? 'Офлайн симуляция активна: загрузка заблокирована' : 'Offline simulation active: pull blocked', 'warning');
          return;
        }
        if (currentAuthUser && firestoreDb) {
          await pullStateFromCloud(currentAuthUser);
          renderDevDashboard();
          showToast(state.prefs.lang === 'ru' ? 'Данные загружены из облака! 📥' : 'Data pulled from cloud! 📥', 'success');
        } else {
          showToast(state.prefs.lang === 'ru' ? 'Firebase не авторизован (гостевой режим)' : 'Firebase not authenticated (guest mode)', 'warning');
        }
      };
    }
  
    const btnDevToggleOffline = document.getElementById('btnDevToggleOffline');
    if (btnDevToggleOffline) {
      btnDevToggleOffline.onclick = () => {
        isSimulatedOffline = !isSimulatedOffline;
        const txt = document.getElementById('devOfflineStatusText');
        if (txt) {
          txt.textContent = isSimulatedOffline
            ? (state.prefs.lang === 'ru' ? 'Офлайн симуляция: ВКЛ' : 'Offline Sim: ON')
            : (state.prefs.lang === 'ru' ? 'Офлайн симуляция: ВЫКЛ' : 'Offline Sim: OFF');
        }
        showToast(
          isSimulatedOffline
            ? (state.prefs.lang === 'ru' ? 'Офлайн симуляция ВКЛЮЧЕНА 🔌' : 'Offline simulation ENABLED 🔌')
            : (state.prefs.lang === 'ru' ? 'Офлайн симуляция ВЫКЛЮЧЕНА 🟢' : 'Offline simulation DISABLED 🟢'),
          isSimulatedOffline ? 'warning' : 'info'
        );
        renderDevDashboard();
      };
    }
  
    const btnDevExportLogs = document.getElementById('btnDevExportLogs');
    if (btnDevExportLogs) {
      btnDevExportLogs.onclick = () => {
        const debugLogs = {
          appName: 'Habit Tracker & Finance',
          exportedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          screen: { width: window.innerWidth, height: window.innerHeight },
          localStorageKeys: Object.keys(localStorage),
          simulatedOffline: isSimulatedOffline,
          firebaseConfigSummary: {
            configured: isFirebaseConfigured(),
            projectId: firebaseConfig ? firebaseConfig.projectId : null,
            authDomain: firebaseConfig ? firebaseConfig.authDomain : null
          },
          auth: currentAuthUser ? { uid: currentAuthUser.uid, email: currentAuthUser.email } : null,
          lastSync: lastSyncTimestamp,
          stateSnapshot: state
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(debugLogs, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `habit_debug_logs_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast(state.prefs.lang === 'ru' ? 'Debug Logs экспортированы!' : 'Debug logs exported!', 'success');
      };
    }
  
    const btnDevRefreshJson = document.getElementById('btnDevRefreshJson');
    if (btnDevRefreshJson) {
      btnDevRefreshJson.onclick = () => {
        renderDevStateJson();
        showToast(state.prefs.lang === 'ru' ? 'Состояние обновлено' : 'State refreshed', 'info');
      };
    }
  
    const btnDevCopyJson = document.getElementById('btnDevCopyJson');
    if (btnDevCopyJson) {
      btnDevCopyJson.onclick = () => {
        const viewer = document.getElementById('devStateJsonViewer');
        if (viewer && viewer.textContent) {
          navigator.clipboard.writeText(viewer.textContent);
          showToast(state.prefs.lang === 'ru' ? 'JSON скопирован в буфер! 📋' : 'JSON copied to clipboard! 📋', 'success');
        }
      };
    }
  }

  // Settings Modal Handlers
  document.getElementById('settingsBtn').onclick = () => {
    document.getElementById('settingsModal').classList.add('active');
  };

  document.querySelectorAll('#langSegmentControl .segment-btn').forEach(btn => {
    btn.onclick = () => applyLanguage(btn.getAttribute('data-lang'));
  });

  document.querySelectorAll('#themeSegmentControl .segment-btn').forEach(btn => {
    btn.onclick = () => applyTheme(btn.getAttribute('data-theme'));
  });

  document.querySelectorAll('#layoutSegmentControl .segment-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.getAttribute('data-layout');
      applyLayoutMode(mode);
      showToast(state.prefs.lang === 'ru' ? 'Режим интерфейса изменён 🔄' : 'Layout mode updated 🔄', 'info');
    };
  });

  // Onboarding Layout Selection Choices
  const choiceCardMobile = document.getElementById('choiceCardMobile');
  if (choiceCardMobile) {
    choiceCardMobile.onclick = () => selectLayoutFromOnboarding('mobile');
  }

  const choiceCardDesktop = document.getElementById('choiceCardDesktop');
  if (choiceCardDesktop) {
    choiceCardDesktop.onclick = () => selectLayoutFromOnboarding('desktop');
  }

  const btnOnboardingOpenLogin = document.getElementById('btnOnboardingOpenLogin');
  if (btnOnboardingOpenLogin) {
    btnOnboardingOpenLogin.onclick = () => {
      const onboardingModal = document.getElementById('onboardingLayoutModal');
      if (onboardingModal) onboardingModal.classList.remove('active');
      Storage.set(STORAGE_KEYS.UI_MODE, 'auto');
      applyLayoutMode('auto');
      document.getElementById('authModal').classList.add('active');
    };
  }

  // Mobile Floating Action Button (FAB) Handler
  const mobileFabBtn = document.getElementById('mobileFabBtn');
  if (mobileFabBtn) {
    mobileFabBtn.onclick = () => {
      if (activeTab === 'habits') {
        const addBtn = document.getElementById('addHabitBtn');
        if (addBtn) addBtn.click();
      } else if (activeTab === 'tasks') {
        const addBtn = document.getElementById('addTaskBtn');
        if (addBtn) addBtn.click();
      } else if (activeTab === 'finance') {
        openTxnModal('expense');
      } else if (activeTab === 'developer') {
        renderDevDashboard();
      }
    };
  }

  // AI Assistant Drawer
  const aiAssistantBtn = document.getElementById('aiAssistantBtn');
  const aiDrawer = document.getElementById('aiDrawer');
  const aiDrawerOverlay = document.getElementById('aiDrawerOverlay');
  const aiDrawerCloseBtn = document.getElementById('aiDrawerCloseBtn');
  const aiDrawerForm = document.getElementById('aiDrawerForm');
  const aiDrawerInput = document.getElementById('aiDrawerInput');
  const aiDrawerMessages = document.getElementById('aiDrawerMessages');

  function openAiDrawer() {
    aiDrawer.classList.add('active');
    aiDrawerOverlay.classList.add('active');
    setTimeout(() => aiDrawerInput && aiDrawerInput.focus(), 200);
  }
  function closeAiDrawer() {
    aiDrawer.classList.remove('active');
    aiDrawerOverlay.classList.remove('active');
  }
  function addAiMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ai-msg-${sender}`;
    msg.textContent = text;
    aiDrawerMessages.appendChild(msg);
    aiDrawerMessages.scrollTop = aiDrawerMessages.scrollHeight;
  }

  if (aiAssistantBtn) aiAssistantBtn.onclick = openAiDrawer;
  if (aiDrawerCloseBtn) aiDrawerCloseBtn.onclick = closeAiDrawer;
  if (aiDrawerOverlay) aiDrawerOverlay.onclick = closeAiDrawer;

  if (aiDrawerForm) {
    aiDrawerForm.onsubmit = (e) => {
      e.preventDefault();
      const text = aiDrawerInput.value.trim();
      if (!text) return;
      addAiMessage(text, 'user');
      aiDrawerInput.value = '';
      // TODO: замените этот блок на реальный вызов вашего ИИ-бэкенда/API
      setTimeout(() => {
        addAiMessage('Это заглушка ответа. Подключите сюда свой API.', 'bot');
      }, 400);
    };
  }

  // Export JSON from LocalStorage
  document.getElementById('exportDataBtn').onclick = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      prefs: state.prefs,
      habits: state.habits,
      tasks: state.tasks,
      finances: state.finances
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `habit_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(state.prefs.lang === 'ru' ? 'Резервная копия скачана!' : 'Backup exported successfully!', 'success');
  };

  // Import JSON into LocalStorage
  document.getElementById('importFileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.habits && imported.tasks && imported.finances) {
          state.prefs = imported.prefs || state.prefs;
          state.habits = imported.habits;
          state.tasks = imported.tasks;
          state.finances = imported.finances;

          saveAll();
          applyTheme(state.prefs.theme || 'dark');
          applyLanguage(state.prefs.lang || 'ru');
          applyLayoutMode(state.prefs.uiMode || 'auto');
          renderHabitTrackerFull();
          renderTasks();
          renderFinance();

          document.getElementById('settingsModal').classList.remove('active');
          showToast(state.prefs.lang === 'ru' ? 'Данные успешно восстановлены! 🎉' : 'Backup restored successfully! 🎉', 'success');
        } else {
          showToast(state.prefs.lang === 'ru' ? 'Неверный формат резервной копии' : 'Invalid backup file structure', 'error');
        }
      } catch (err) {
        showToast(state.prefs.lang === 'ru' ? 'Ошибка чтения файла' : 'Error reading JSON backup', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear All Data
  document.getElementById('clearAllDataBtn').onclick = () => {
    const confirmMsg = state.prefs.lang === 'ru'
      ? 'Вы уверены, что хотите удалить ВСЕ привычки, задачи и финансы? Это действие необратимо.'
      : 'Are you sure you want to delete ALL habits, tasks, and finances? This cannot be undone.';
    if (confirm(confirmMsg)) {
      state.habits = [];
      state.tasks = [];
      state.finances = { transactions: [], subscriptions: [] };
      saveAll();
      renderHabitTrackerFull();
      renderTasks();
      renderFinance();
      document.getElementById('settingsModal').classList.remove('active');
      showToast(state.prefs.lang === 'ru' ? 'Хранилище очищено (Чистый лист)' : 'Workspace cleared to fresh start', 'info');
    }
  };

  // Share Application
  const shareAppBtn = document.getElementById('shareAppBtn');
  if (shareAppBtn) {
    shareAppBtn.onclick = async () => {
      const shareData = {
        title: 'Habit — Трекер привычек, задач и личных финансов',
        text: 'Попробуй Habit для выработки ежедневных рутин, контроля задач и финансов!',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast(state.prefs.lang === 'ru' ? 'Спасибо, что делитесь! 🚀' : 'Thanks for sharing! 🚀', 'success');
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyShareUrlFallback();
          }
        }
      } else {
        copyShareUrlFallback();
      }
    };
  }

  function copyShareUrlFallback() {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast(state.prefs.lang === 'ru' ? 'Ссылка скопирована в буфер обмена! 📋' : 'Link copied to clipboard! 📋', 'success');
    } catch (e) {
      showToast(window.location.href, 'info');
    }
  }

  // ========================================================================
  // FAQ ACCORDION HANDLERS (SETTINGS MODAL)
  // ========================================================================
  const settingsFaqAccordion = document.getElementById('settingsFaqAccordion');
  if (settingsFaqAccordion) {
    settingsFaqAccordion.addEventListener('click', (e) => {
      const header = e.target.closest('.faq-header');
      if (!header) return;
      const item = header.closest('.faq-item');
      if (!item) return;

      const wasActive = item.classList.contains('active');
      // Close other open FAQ items for smooth single-accordion experience
      settingsFaqAccordion.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !wasActive);
    });

    settingsFaqAccordion.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const header = e.target.closest('.faq-header');
        if (header) {
          e.preventDefault();
          header.click();
        }
      }
    });
  }

  // Privacy & Terms Links
  const privacyLink = document.getElementById('privacyPolicyLink');
  if (privacyLink) {
    privacyLink.onclick = (e) => {
      e.preventDefault();
      showToast(state.prefs.lang === 'ru' ? 'Политика конфиденциальности: Все данные хранятся локально на вашем устройстве или в вашем личном Firebase аккаунте.' : 'Privacy: Your data is stored locally on your device or in your personal Firebase account.', 'info');
    };
  }

  const termsLink = document.getElementById('termsServiceLink');
  if (termsLink) {
    termsLink.onclick = (e) => {
      e.preventDefault();
      showToast(state.prefs.lang === 'ru' ? 'Условия: Habit предоставляется как бесплатный инструмент личной эффективности.' : 'Terms: Habit is provided as a personal productivity tool.', 'info');
    };
  }

  // Month & Year Selectors
  const monthSelector = document.getElementById('monthSelector');
  const yearSelector = document.getElementById('yearSelector');

  monthSelector.onchange = () => {
    state.prefs.selectedMonth = parseInt(monthSelector.value, 10);
    savePrefs();
    renderHabitTrackerFull();
  };

  yearSelector.onchange = () => {
    state.prefs.selectedYear = parseInt(yearSelector.value, 10);
    savePrefs();
    renderHabitTrackerFull();
  };

  // ========================================================================
  // CLOUD SYNC & AUTH MODAL EVENT HANDLERS
  // ========================================================================
  let currentAuthMode = 'signin'; // 'signin' | 'signup'

  const cloudSyncBtn = document.getElementById('cloudSyncBtn');
  if (cloudSyncBtn) {
    cloudSyncBtn.onclick = () => {
      updateCloudUI();
      document.getElementById('authModal').classList.add('active');
    };
  }

  // Auth tab buttons
  const authTabSignIn = document.getElementById('authTabSignIn');
  const authTabSignUp = document.getElementById('authTabSignUp');
  const authTabConfig = document.getElementById('authTabConfig');
  const authFormSection = document.getElementById('authFormSection');
  const authConfigSection = document.getElementById('authConfigSection');
  const btnEmailSubmit = document.getElementById('btnEmailSubmit');

  function setAuthTab(tab) {
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    if (tab === 'signin') {
      currentAuthMode = 'signin';
      if (authTabSignIn) authTabSignIn.classList.add('active');
      if (authFormSection) authFormSection.style.display = 'block';
      if (authConfigSection) authConfigSection.style.display = 'none';
      if (btnEmailSubmit) btnEmailSubmit.textContent = state.prefs.lang === 'ru' ? 'Войти' : 'Sign In';
    } else if (tab === 'signup') {
      currentAuthMode = 'signup';
      if (authTabSignUp) authTabSignUp.classList.add('active');
      if (authFormSection) authFormSection.style.display = 'block';
      if (authConfigSection) authConfigSection.style.display = 'none';
      if (btnEmailSubmit) btnEmailSubmit.textContent = state.prefs.lang === 'ru' ? 'Создать аккаунт' : 'Create Account';
    } else if (tab === 'config') {
      if (authTabConfig) authTabConfig.classList.add('active');
      if (authFormSection) authFormSection.style.display = 'none';
      if (authConfigSection) authConfigSection.style.display = 'block';
    }
  }

  if (authTabSignIn) authTabSignIn.onclick = () => setAuthTab('signin');
  if (authTabSignUp) authTabSignUp.onclick = () => setAuthTab('signup');
  if (authTabConfig) authTabConfig.onclick = () => setAuthTab('config');

  // Google Sign-In Button (Disabled State / Coming Soon)
  const btnGoogleAuth = document.getElementById('btnGoogleAuth');
  if (btnGoogleAuth) {
    btnGoogleAuth.onclick = (e) => {
      e.preventDefault();
      showToast(state.prefs.lang === 'ru' ? 'Вход через Google временно отключён (Скоро)' : 'Google Sign-In is temporarily disabled (Coming soon)', 'info');
    };
  }

  // Email/Password Form Submit
  const emailAuthForm = document.getElementById('emailAuthForm');
  if (emailAuthForm) {
    emailAuthForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;

      if (!isFirebaseConfigured()) {
        showToast(state.prefs.lang === 'ru' ? 'Укажите firebaseConfig в Настройках' : 'Configure firebaseConfig in Settings', 'warning');
        setAuthTab('config');
        return;
      }

      try {
        if (currentAuthMode === 'signin') {
          await firebaseAuth.signInWithEmailAndPassword(email, password);
        } else {
          await firebaseAuth.createUserWithEmailAndPassword(email, password);
        }
        document.getElementById('authModal').classList.remove('active');
        emailAuthForm.reset();
      } catch (err) {
        console.error('[Firebase] Email auth error:', err);
        showToast(err.message || 'Ошибка авторизации', 'error');
      }
    };
  }

  // Sync Now Button
  const btnSyncNow = document.getElementById('btnSyncNow');
  if (btnSyncNow) {
    btnSyncNow.onclick = async () => {
      if (currentAuthUser && firestoreDb) {
        await pushStateToCloud(currentAuthUser);
        showToast(state.prefs.lang === 'ru' ? 'Данные синхронизированы в облако! ☁️' : 'Synced to cloud!', 'success');
      } else {
        showToast('Облачная синхронизация не активна', 'warning');
      }
    };
  }

  // Pull Cloud Data Button
  const btnPullCloud = document.getElementById('btnPullCloud');
  if (btnPullCloud) {
    btnPullCloud.onclick = async () => {
      if (currentAuthUser && firestoreDb) {
        await pullStateFromCloud(currentAuthUser);
      }
    };
  }

  // Sign Out Button
  const btnSignOut = document.getElementById('btnSignOut');
  if (btnSignOut) {
    btnSignOut.onclick = async () => {
      if (firebaseAuth) {
        await firebaseAuth.signOut();
        currentAuthUser = null;
        updateCloudUI();
        document.getElementById('authModal').classList.remove('active');
        showToast(state.prefs.lang === 'ru' ? 'Вы вышли из аккаунта (Гостевой режим)' : 'Signed out (Guest Mode)', 'info');
      }
    };
  }

  // Modal Closers
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.onclick = () => {
      const m = document.getElementById(btn.getAttribute('data-modal'));
      if (m) m.classList.remove('active');
    };
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    };
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      if (document.getElementById('tourOverlay').classList.contains('active')) endTour();
      return;
    }

    // Fast keyboard shortcuts (when not typing inside form fields)
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    const hasOpenModal = document.querySelector('.modal-overlay.active');
    if (isTyping || hasOpenModal) return;

    if (e.key === '1') {
      switchTab('habits');
    } else if (e.key === '2') {
      switchTab('tasks');
    } else if (e.key === '3') {
      switchTab('finance');
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      if (activeTab === 'habits') {
        const btn = document.getElementById('addHabitBtn');
        if (btn) btn.click();
      } else if (activeTab === 'tasks') {
        const btn = document.getElementById('addTaskBtn');
        if (btn) btn.click();
      } else if (activeTab === 'finance') {
        openTxnModal('expense');
      }
    }
  });

  // --- Initialization ---
  window.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.prefs.theme || 'dark');
    applyLanguage(state.prefs.lang || 'ru');

    // Check if Developer Mode was unlocked previously
    checkDevModePersisted();

    // Check if Layout Mode Onboarding is required or apply saved mode
    checkLayoutOnboarding();

    // Initialize Firebase hybrid cloud sync (runs offline / guest mode if unconfigured)
    initFirebase();
    populateDevFbForm();
    updateDevFbStatus();

    // Schedule any saved habit reminders on page load
    scheduleHabitReminders();
  });

})();
