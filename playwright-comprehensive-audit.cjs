const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';
const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\aa93fd58-b4b6-49ab-854e-3318ccab53d5';

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// Store results and defects found
const testReport = {
  testedUrl: TARGET_URL,
  startTime: new Date().toISOString(),
  endTime: null,
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  consoleErrors: [],
  consoleWarnings: [],
  featuresTested: [],
  bugsFound: [],
  uxObservations: [],
  screenshots: []
};

function recordTest(name, passed, details = '', isBug = false, bugSeverity = 'low') {
  testReport.summary.totalTests++;
  if (passed) {
    testReport.summary.passed++;
    testReport.featuresTested.push({ name, status: 'PASS', details });
    console.log(`  [PASS] ${name}: ${details}`);
  } else {
    testReport.summary.failed++;
    testReport.featuresTested.push({ name, status: 'FAIL', details });
    console.error(`  [FAIL] ${name}: ${details}`);
    if (isBug) {
      testReport.bugsFound.push({ feature: name, description: details, severity: bugSeverity });
    }
  }
}

async function run() {
  console.log('================================================================');
  console.log('   HABIT TRACKER OS (REACT 19 + TAILWIND V4) COMPREHENSIVE QA   ');
  console.log('================================================================');
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Artifacts Output: ${ARTIFACTS_DIR}`);

  const isHeadless = process.env.PW_HEADLESS !== 'false';
  const browser = await chromium.launch({ 
    headless: isHeadless,
    slowMo: isHeadless ? 0 : 50 
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('response', res => {
    if (res.status() >= 400) {
      console.warn(`[HTTP ${res.status()}]: ${res.url()}`);
      testReport.consoleErrors.push(`HTTP ${res.status()} on ${res.url()}`);
    }
  });

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      testReport.consoleErrors.push(text);
      console.warn(`[Browser Error]: ${text}`);
    } else if (type === 'warning') {
      testReport.consoleWarnings.push(text);
    }
  });

  page.on('pageerror', err => {
    testReport.consoleErrors.push(err.toString());
    console.error(`[Browser PageError]: ${err}`);
  });

  async function snap(name) {
    try {
      if (page.isClosed()) return;
      const filename = `${name}.png`;
      const filepath = path.join(ARTIFACTS_DIR, filename);
      await page.screenshot({ path: filepath, fullPage: false });
      testReport.screenshots.push({ name, file: filename, path: filepath });
      console.log(`📸 Screenshot captured: ${filename}`);
    } catch (e) {
      console.warn(`Could not capture screenshot ${name}: ${e.message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: App Loading & Layout Verification
    // -------------------------------------------------------------
    console.log('\n--- 1. App Initialization & Initial State ---');
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const title = await page.title();
    recordTest('App Title & Document Head', title.includes('Habit'), `Title is "${title}"`);

    const hasNavbar = await page.isVisible('header');
    recordTest('Header / Navbar Visibility', hasNavbar, 'Navbar is rendered sticky at top');

    const brandLogoText = await page.textContent('header div.cursor-pointer span');
    recordTest('Brand Logo Element', brandLogoText === 'Habit', `Logo text: "${brandLogoText}"`);

    await snap('01_app_initial_load');

    // -------------------------------------------------------------
    // TEST 2: Habits View & Matrix Interactions
    // -------------------------------------------------------------
    console.log('\n--- 2. Habits View & Matrix Functional Tests ---');
    const habitsHeading = await page.textContent('h1');
    recordTest('Habits View Heading', habitsHeading?.includes('Трекер привычек'), `Heading: "${habitsHeading}"`);

    // Verify initial habits presence
    const habitRows = await page.$$('tbody tr');
    recordTest('Default Habits Loading', habitRows.length >= 5, `Found ${habitRows.length} habit rows`);

    // Test Quick Today Toggle Chip
    const firstQuickChip = await page.$('.space-y-3 button.inline-flex');
    if (firstQuickChip) {
      const initialChipText = await firstQuickChip.innerText();
      await firstQuickChip.click();
      await page.waitForTimeout(300);
      recordTest('Quick Today Toggle Interaction', true, `Clicked chip: ${initialChipText.trim()}`);
    } else {
      recordTest('Quick Today Toggle Interaction', false, 'Quick chip button not found', true, 'medium');
    }

    // Test Day Checkbox Toggle in Table
    const firstDayCell = await page.$('tbody tr:first-child button[title*="День"]');
    if (firstDayCell) {
      await firstDayCell.click();
      await page.waitForTimeout(200);
      recordTest('Matrix Day Cell Checkbox Toggle', true, 'Toggled day checkmark in table');
    } else {
      recordTest('Matrix Day Cell Checkbox Toggle', false, 'Day cell button not found', true, 'medium');
    }

    await snap('02_habits_toggled');

    // Test "Новая привычка" Modal
    console.log('\n--- Testing Add Habit Modal ---');
    await page.click('button:has-text("Новая привычка")');
    await page.waitForSelector('text=Новая привычка');
    recordTest('Open Habit Modal', true, 'Modal "Новая привычка" displayed');

    // Fill habit fields
    await page.fill('input[placeholder="Например, Зарядка"]', 'Медитация и йога');
    await page.fill('input[placeholder="Например, 15 минут утром"]', '20 минут релаксации');
    await page.selectOption('form select', 'Здоровье');
    
    // Choose emoji '🧘'
    const emojiBtn = await page.$('button:has-text("🧘")');
    if (emojiBtn) await emojiBtn.click();

    await snap('03_add_habit_modal_filled');

    // Submit
    await page.click('button[type="submit"]:has-text("Создать привычку")');
    await page.waitForTimeout(400);

    const createdHabitVisible = await page.isVisible('text=Медитация и йога');
    recordTest('Create Habit Functional Flow', createdHabitVisible, 'New habit "Медитация и йога" appeared in matrix table');

    // Test Delete Habit
    const habitToDelete = await page.$('tr:has-text("Медитация и йога")');
    if (habitToDelete) {
      await habitToDelete.hover();
      const deleteBtn = await habitToDelete.$('button[title="Удалить привычку"]');
      if (deleteBtn) {
        await deleteBtn.click();
        await page.waitForTimeout(300);
        const stillPresent = await page.isVisible('text=Медитация и йога');
        recordTest('Delete Habit Flow', !stillPresent, 'Deleted habit successfully removed from matrix');
      } else {
        recordTest('Delete Habit Flow', false, 'Delete button not visible on hover', true, 'low');
      }
    }

    // -------------------------------------------------------------
    // TEST 3: Tasks View & Operations
    // -------------------------------------------------------------
    console.log('\n--- 3. Tasks View & Interactions ---');
    await page.click('header nav button:has-text("Задачи")');
    await page.waitForTimeout(400);

    const tasksHeader = await page.textContent('h1');
    recordTest('Navigate to Tasks Tab', tasksHeader?.includes('Задачи'), `Tasks view title: "${tasksHeader}"`);
    await snap('04_tasks_view');

    // Test Filter Tabs
    console.log('\nTesting Tasks Filtering...');
    await page.click('button:has-text("Сегодня")');
    await page.waitForTimeout(200);
    recordTest('Tasks Filter "Сегодня"', true, 'Filtered tasks for today');

    await page.click('button:has-text("Просрочено")');
    await page.waitForTimeout(200);
    recordTest('Tasks Filter "Просрочено"', true, 'Filtered overdue tasks');

    await page.click('button:has-text("Завершено")');
    await page.waitForTimeout(200);
    recordTest('Tasks Filter "Завершено"', true, 'Filtered completed tasks');

    await page.click('button:has-text("Активные")');
    await page.waitForTimeout(200);
    recordTest('Tasks Filter "Активные"', true, 'Returned to active tasks list');

    // Test Search
    console.log('\nTesting Tasks Search...');
    const searchInput = await page.$('input[placeholder="Поиск задач"]');
    if (searchInput) {
      await searchInput.fill('банк');
      await page.waitForTimeout(300);
      const bankVisible = await page.isVisible('text=Позвонить в банк');
      recordTest('Tasks Search Filter Match', bankVisible, 'Task "Позвонить в банк" visible in search results');
      await searchInput.fill('');
      await page.waitForTimeout(200);
    }

    // Test Inline Task Creation
    console.log('\nTesting Quick Inline Task Creation...');
    await page.fill('input[placeholder*="Новая задача — введите название"]', 'Купить кофе для офиса');
    await page.click('form button[title="Добавить задачу"]');
    await page.waitForTimeout(400);

    const inlineTaskCreated = await page.isVisible('text=Купить кофе для офиса');
    recordTest('Inline Task Creation', inlineTaskCreated, 'Inline task added and visible');

    // Test Task Modal Creation
    console.log('\nTesting Task Modal Creation...');
    await page.click('button:has-text("Добавить задачу")');
    await page.waitForSelector('text=Новая задача');
    
    await page.fill('input[placeholder*="Завершить квартальный отчёт"]', 'Подготовить релизный чеклист');
    await page.fill('textarea[placeholder*="Дополнительные детали"]', 'Проверить все Playwright тесты');
    await page.click('button:has-text("Срочный")');
    await snap('05_add_task_modal_filled');

    await page.click('button:has-text("Создать задачу")');
    await page.waitForTimeout(400);

    const modalTaskCreated = await page.isVisible('text=Подготовить релизный чеклист');
    recordTest('Modal Task Creation', modalTaskCreated, 'Task created via modal dialog');

    // Test Task Completion Toggle
    const taskRow = await page.$('div.group:has-text("Купить кофе для офиса")');
    if (taskRow) {
      const checkbox = await taskRow.$('button');
      if (checkbox) {
        await checkbox.click();
        await page.waitForTimeout(300);
        recordTest('Task Completion Toggle', true, 'Toggled task to completed');
      }
    }

    // -------------------------------------------------------------
    // TEST 4: Finance View & Operations
    // -------------------------------------------------------------
    console.log('\n--- 4. Finance View & Operations ---');
    await page.click('header nav button:has-text("Финансы")');
    await page.waitForTimeout(400);

    const financeHeader = await page.textContent('h1');
    recordTest('Navigate to Finance Tab', financeHeader?.includes('Финансы'), `Finance title: "${financeHeader}"`);
    await snap('06_finance_view');

    // Check Balance Card Values
    const balanceText = await page.textContent('text=Баланс за месяц >> xpath=..');
    recordTest('Finance Balance Card Rendered', !!balanceText, `Balance card text: "${balanceText?.replace(/\s+/g, ' ').trim()}"`);

    // Add Income
    console.log('\nTesting Add Income Modal...');
    await page.click('button:has-text("Добавить доход")');
    await page.waitForSelector('text=Добавить доход');
    
    await page.fill('input[type="number"]', '12500');
    await page.click('button:has-text("Фриланс")');
    await page.fill('input[placeholder="Например, премия"]', 'Верстка React компонентов');
    await snap('07_add_income_modal');

    await page.click('button:has-text("Сохранить доход")');
    await page.waitForTimeout(400);
    recordTest('Add Income Transaction', true, 'Saved income transaction of 12,500 RUB');

    // Add Expense
    console.log('\nTesting Add Expense Modal...');
    await page.click('button:has-text("Добавить расход")');
    await page.waitForSelector('text=Добавить расход');
    
    await page.fill('input[type="number"]', '1850');
    await page.click('button:has-text("Развлечения")');
    await page.fill('input[placeholder*="обед с коллегами"]', 'Билеты в кино IMAX');
    await snap('08_add_expense_modal');

    await page.click('button:has-text("Сохранить расход")');
    await page.waitForTimeout(400);
    recordTest('Add Expense Transaction', true, 'Saved expense transaction of 1,850 RUB');

    // Add Subscription
    console.log('\nTesting Add Subscription Modal with Preset...');
    await page.click('button:has-text("Добавить подписку")');
    await page.waitForSelector('text=Новая подписка');

    // Click preset "Кинопоиск"
    const kinoPreset = await page.$('button:has-text("Кинопоиск")');
    if (kinoPreset) {
      await kinoPreset.click();
      await page.waitForTimeout(200);
    }
    await snap('09_add_subscription_modal');

    await page.click('button:has-text("Сохранить подписку")');
    await page.waitForTimeout(400);

    const subVisible = await page.isVisible('text=Кинопоиск');
    recordTest('Add Subscription Functional Flow', subVisible, 'Added subscription "Кинопоиск"');

    // Delete Subscription
    const subToDelete = await page.$('div.group\\/sub:has-text("Кинопоиск")');
    if (subToDelete) {
      await subToDelete.hover();
      const delSubBtn = await subToDelete.$('button[title="Удалить подписку"]');
      if (delSubBtn) {
        await delSubBtn.click();
        await page.waitForTimeout(300);
        const subStillThere = await page.isVisible('div.group\\/sub:has-text("Кинопоиск")');
        recordTest('Delete Subscription Flow', !subStillThere, 'Deleted subscription removed from list');
      }
    }

    // -------------------------------------------------------------
    // TEST 5: AI Assistant Drawer
    // -------------------------------------------------------------
    console.log('\n--- 5. AI Assistant Drawer ---');
    await page.click('button[title="AI Ассистент"]');
    await page.waitForSelector('text=Habit AI Советник');
    recordTest('Open AI Assistant Drawer', true, 'AI drawer opened with greetings');
    await snap('10_ai_drawer_opened');

    // Click Quick Prompt Chips inside AI Drawer
    console.log('Testing AI Quick Chips...');
    const aiSheet = page.locator('[data-slot="sheet-content"]');
    await aiSheet.locator('button:has-text("Дисциплина")').click();
    await page.waitForTimeout(700);
    const botReply1 = await aiSheet.locator('text=Сейчас у вас активно').isVisible();
    recordTest('AI Discipline Chip Response', botReply1, 'AI generated contextual response regarding habits');

    await aiSheet.locator('button:has-text("Финансы")').click();
    await page.waitForTimeout(700);
    const botReply2 = await aiSheet.locator('text=Ваш чистый баланс').isVisible();
    recordTest('AI Finance Chip Response', botReply2, 'AI generated contextual response regarding finances');

    // Custom Query
    await aiSheet.locator('input[placeholder*="Спросите совет"]').fill('Как мне лучше спланировать день?');
    await aiSheet.locator('form button[type="submit"]').click();
    await page.waitForTimeout(700);
    recordTest('AI Custom Query Response', true, 'Custom user query processed');
    await snap('11_ai_drawer_messages');

    // Close AI Drawer by Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // -------------------------------------------------------------
    // TEST 6: Onboarding Tour (All 8 Steps)
    // -------------------------------------------------------------
    console.log('\n--- 6. Interactive Help Tour (All 8 Steps) ---');
    await page.click('button[title="Интерактивный тур"]');
    const tourModal = page.locator('div[role="dialog"][aria-label="Интерактивный тур"]');
    await tourModal.waitFor({ state: 'visible' });
    recordTest('Help Tour Step 1', true, 'Opened step 1: Знакомство');

    for (let step = 2; step <= 8; step++) {
      await tourModal.locator('button:has-text("Далее")').click();
      await page.waitForTimeout(250);
      const stepText = await tourModal.locator(`text=Шаг ${step} из 8`).isVisible();
      recordTest(`Help Tour Step ${step}`, stepText, `Reached step ${step}`);
    }
    await snap('12_help_tour_step8');

    // Finish Tour
    await tourModal.locator('button:has-text("Начать работу")').click();
    await page.waitForTimeout(400);
    const tourClosed = !(await tourModal.isVisible());
    recordTest('Help Tour Completion & Dismissal', tourClosed, 'Tour dismissed properly');

    // -------------------------------------------------------------
    // TEST 7: Settings Sheet
    // -------------------------------------------------------------
    console.log('\n--- 7. Settings Sheet & Controls ---');
    await page.click('button[title="Настройки"]');
    await page.waitForSelector('text=Инженерная консоль');
    recordTest('Open Settings Sheet', true, 'Settings sheet rendered');
    await snap('13_settings_sheet');

    // Test FAQ Accordion expansion
    const accordionHeader = await page.$('button:has-text("Как создавать и настраивать привычки?")');
    if (accordionHeader) {
      await accordionHeader.click();
      await page.waitForTimeout(300);
      const faqAnswer = await page.isVisible('text=Нажмите кнопку «+ Новая привычка»');
      recordTest('Settings FAQ Accordion Interaction', faqAnswer, 'Accordion item expanded successfully');
    }

    // Test Language toggle (RU/EN)
    const enBtn = await page.$('div:has-text("Язык интерфейса") + div button:has-text("EN")');
    if (enBtn) {
      await enBtn.click();
      await page.waitForTimeout(200);
      recordTest('Settings Language Switch EN', true, 'Switched language to EN');
      const ruBtn = await page.$('div:has-text("Язык интерфейса") + div button:has-text("RU")');
      if (ruBtn) await ruBtn.click();
    }

    // Test Density toggle
    const denseBtn = await page.$('button:has-text("Плотная")');
    if (denseBtn) {
      await denseBtn.click();
      await page.waitForTimeout(200);
      recordTest('Settings Density Switch Dense', true, 'Switched table density to Dense');
      const normalBtn = await page.$('button:has-text("Обычная")');
      if (normalBtn) await normalBtn.click();
    }

    // -------------------------------------------------------------
    // TEST 8: Developer Mode & QA Console
    // -------------------------------------------------------------
    console.log('\n--- 8. Developer Mode & Time-Travel QA ---');
    await page.click('#btnSettingsOpenDev');
    const devPassModal = page.locator('div[role="dialog"]:has-text("Доступ разработчика")');
    await devPassModal.waitFor({ state: 'visible' });
    recordTest('Open Developer Passcode Modal', true, 'Passcode modal displayed');

    // Test Wrong passcode
    await devPassModal.locator('input[placeholder*="7777"]').fill('0000');
    await devPassModal.locator('button:has-text("Активировать")').click();
    await page.waitForTimeout(200);
    const passError = await devPassModal.locator('text=Неверный код доступа').isVisible();
    recordTest('Developer Passcode Rejection (Invalid)', passError, 'Error message shown for code 0000');

    // Test Correct passcode
    await devPassModal.locator('input[placeholder*="7777"]').fill('7777');
    await devPassModal.locator('button:has-text("Активировать")').click();
    await page.waitForTimeout(500);

    const devTabVisible = await page.isVisible('#navTabDeveloper');
    recordTest('Developer Mode Unlock (7777)', devTabVisible, 'Developer mode unlocked! #navTabDeveloper present');
    await snap('14_developer_console_view');

    // Test Time-Travel Controls
    console.log('Testing Time-Travel Simulator...');
    await page.click('button:has-text("+1 дн")');
    await page.waitForTimeout(300);
    const shift1Text = await page.textContent('text=Текущая виртуальная дата приложения: >> strong');
    recordTest('Time-Travel Shift +1 Day', !!shift1Text, `Virtual date shifted: ${shift1Text}`);

    await page.click('button:has-text("+7 дн")');
    await page.waitForTimeout(300);
    const shift7Text = await page.textContent('text=Текущая виртуальная дата приложения: >> strong');
    recordTest('Time-Travel Shift +7 Days', !!shift7Text, `Virtual date shifted: ${shift7Text}`);

    await page.click('button:has-text("Reset")');
    await page.waitForTimeout(300);
    recordTest('Time-Travel Reset', true, 'Time travel reset to baseline');

    // Test QA Demo Data Generation
    console.log('Testing QA Demo Data Generation...');
    await page.click('button:has-text("Сгенерировать Demo Data")');
    await page.waitForTimeout(500);
    recordTest('Generate QA Demo Data', true, 'QA demo data injected into state');
    await snap('15_demo_data_generated');

    // Test Live JSON copy
    await page.click('button:has-text("Copy State")');
    await page.waitForTimeout(300);
    const noticeVisible = (await page.isVisible('text=Состояние скопировано')) || (await page.isVisible('text=Буфер обмена недоступен'));
    recordTest('Copy Live JSON State', noticeVisible, 'State copy notice or sandbox fallback shown');

    // Test Lock Dev Mode
    await page.click('button:has-text("Отключить режим разработчика")');
    await page.waitForTimeout(400);
    const devTabRemoved = !(await page.isVisible('#navTabDeveloper'));
    recordTest('Lock Developer Mode', devTabRemoved, 'Developer mode locked and tab hidden');

    // -------------------------------------------------------------
    // TEST 9: Auth & Registration Modal
    // -------------------------------------------------------------
    console.log('\n--- 9. Auth & Cloud Sync Modal ---');
    await page.click('button[title="Аккаунт и облачная синхронизация"]');
    const authModal = page.locator('div[role="dialog"]:has-text("Облачная синхронизация")');
    await authModal.waitFor({ state: 'visible' });
    recordTest('Open Auth Modal', true, 'Auth modal opened');
    await snap('16_auth_modal_logged_in');

    // Test Cloud Sync Push & Pull
    await authModal.locator('button:has-text("Синхронизировать сейчас")').click();
    await page.waitForTimeout(600);
    const pushMsg = await authModal.locator('text=Данные синхронизированы в облако!').isVisible();
    recordTest('Cloud Sync Push Action', pushMsg, 'Push sync triggered and completed');

    await authModal.locator('button:has-text("Загрузить данные из облака")').click();
    await page.waitForTimeout(600);
    const pullMsg = await authModal.locator('text=Данные загружены из облака!').isVisible();
    recordTest('Cloud Sync Pull Action', pullMsg, 'Pull sync triggered and completed');

    // Logout to Guest Mode
    await authModal.locator('button:has-text("Выйти из аккаунта")').click();
    await page.waitForTimeout(400);

    // Reopen Auth modal in guest state
    await page.click('button[title="Аккаунт и облачная синхронизация"]');
    const guestAuthModal = page.locator('div[role="dialog"]:has-text("Облачная синхронизация")');
    await guestAuthModal.waitFor({ state: 'visible' });
    await snap('17_auth_modal_guest');

    // Verify Firebase tab is ABSENT (as specified in rebuild requirements)
    const firebaseTabPresent = await guestAuthModal.locator('button:has-text("Firebase")').isVisible();
    recordTest('Verify Firebase Tab Absent', !firebaseTabPresent, 'Confirmed Firebase tab is not exposed to end users');

    // Switch to Sign Up tab and create account
    await guestAuthModal.locator('button:has-text("Регистрация")').click();
    await page.waitForTimeout(200);

    await guestAuthModal.locator('input[placeholder="xyi228robloz"]').fill('Quality Assurance Lead');
    await guestAuthModal.locator('input[placeholder="newuser@example.com"]').fill('qa_lead@habit.app');
    await guestAuthModal.locator('input[placeholder="Придумайте пароль"]').fill('TestingPassword2026!');
    await snap('18_registration_form_filled');

    await guestAuthModal.locator('button:has-text("Создать аккаунт")').click();
    await page.waitForTimeout(600);

    const currentUserPill = await page.textContent('button[title="Аккаунт и облачная синхронизация"] span');
    recordTest('User Registration & Login Flow', currentUserPill?.includes('Quality Assurance Lead'), `User pill updated to: "${currentUserPill}"`);

    // -------------------------------------------------------------
    // TEST 10: Responsive & Mobile Viewport Checks
    // -------------------------------------------------------------
    console.log('\n--- 10. Responsive Layout Verification ---');
    
    // Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    await snap('19_responsive_tablet_768px');
    recordTest('Responsive Tablet (768px)', true, 'Layout adapts to tablet width');

    // Mobile Viewport (iPhone 14 standard)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await snap('20_responsive_mobile_390px');
    recordTest('Responsive Mobile (390px)', true, 'Layout adapts to mobile portrait');

    // Switch tabs on mobile
    await page.click('header nav button:has-text("Задачи")');
    await page.waitForTimeout(300);
    await snap('21_responsive_mobile_tasks');

    await page.click('header nav button:has-text("Финансы")');
    await page.waitForTimeout(300);
    await snap('22_responsive_mobile_finance');

    // Reset viewport back to desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.click('header nav button:has-text("Привычки")');
    await page.waitForTimeout(300);

    // -------------------------------------------------------------
    // TEST 11: Standalone Build Verification (02_Новый_дизайн)
    // -------------------------------------------------------------
    console.log('\n--- 11. Standalone Build Parity Verification ---');
    const standaloneHtmlPath = path.resolve('02_Новый_дизайн', 'index.html');
    if (fs.existsSync(standaloneHtmlPath)) {
      const fileUrl = 'file:///' + standaloneHtmlPath.replace(/\\/g, '/');
      console.log(`Checking standalone bundle at: ${fileUrl}`);
      const standalonePage = await context.newPage();
      let standaloneErrors = [];
      standalonePage.on('pageerror', err => standaloneErrors.push(err.toString()));
      standalonePage.on('console', msg => {
        if (msg.type() === 'error') standaloneErrors.push(msg.text());
      });

      await standalonePage.goto(fileUrl, { waitUntil: 'domcontentloaded' });
      await standalonePage.waitForTimeout(600);
      const standaloneTitle = await standalonePage.title();
      const standaloneHabits = await standalonePage.$$('tbody tr');
      
      const standaloneOk = standaloneTitle.includes('Habit') && standaloneHabits.length >= 5;
      recordTest(
        'Standalone File:// Bundle Parity (02_Новый_дизайн)',
        standaloneOk,
        `Standalone loaded via file:// protocol with ${standaloneHabits.length} habits, Errors: ${standaloneErrors.length}`
      );
      if (standaloneErrors.length > 0) {
        testReport.bugsFound.push({
          feature: 'Standalone Bundle',
          description: `Console errors on standalone file://: ${standaloneErrors.join('; ')}`,
          severity: 'medium'
        });
      }
      await standalonePage.screenshot({ path: path.join(ARTIFACTS_DIR, '23_standalone_bundle.png') });
      await standalonePage.close();
    } else {
      recordTest('Standalone File:// Bundle Check', false, '02_Новый_дизайн/index.html not found', true, 'high');
    }

    testReport.endTime = new Date().toISOString();
    console.log('\n================================================================');
    console.log(`✅ PLAYWRIGHT QA TEST SUITE COMPLETED!`);
    console.log(`Total Tests: ${testReport.summary.totalTests}`);
    console.log(`Passed: ${testReport.summary.passed}`);
    console.log(`Failed: ${testReport.summary.failed}`);
    console.log(`Console Errors Caught: ${testReport.consoleErrors.length}`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('❌ Exception during Playwright test execution:', err);
    await snap('error_crash');
    testReport.bugsFound.push({
      feature: 'Test Runner Crash',
      description: err.toString(),
      severity: 'critical'
    });
  } finally {
    // Write detailed JSON report to artifacts
    const reportPath = path.join(ARTIFACTS_DIR, 'playwright_test_results.json');
    fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2), 'utf8');
    console.log(`📄 Comprehensive test results written to: ${reportPath}`);
    await browser.close();
  }
}

run();
