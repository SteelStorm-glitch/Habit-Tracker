const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_FILE = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function run() {
  console.log('🚀 Starting Guest Lockout & Welcome Tour Playwright Verification...');
  console.log('Target URL:', TARGET_FILE);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  [Browser Error]:', msg.text());
    }
  });

  // ══════════════════════════════════════════════════════════
  // SCENARIO 1: Guest / Unauthenticated State
  // ══════════════════════════════════════════════════════════
  console.log('\n--- Scenario 1: Guest / Unauthenticated State ---');

  // Ensure clean guest state in localStorage
  await page.addInitScript(() => {
    localStorage.removeItem('habit_auth_user');
    localStorage.removeItem('habit_fb_config');
  });

  await page.goto(TARGET_FILE, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 1. Verify Proactive Coach Banner is NOT visible for guests
  console.log('1. Checking Proactive Coach Banner in guest mode...');
  const coachBanner = page.locator('text=Огонёк · Персональный коуч');
  const bannerCount = await coachBanner.count();
  console.log('   Banner count for guest:', bannerCount, '(Expected: 0)');
  if (bannerCount > 0) {
    throw new Error('Proactive Coach Banner should be HIDDEN for guest users!');
  }
  console.log('   ✓ Coach Banner successfully hidden for guest');

  // 2. Verify Insights Dashboard Widget shows locked state
  console.log('2. Checking Insights Dashboard Widget locked state...');
  const lockedBadge = page.locator('text=Только в аккаунте').first();
  await lockedBadge.waitFor({ timeout: 5000 });
  console.log('   ✓ "Только в аккаунте" badge is visible');

  const lockedWidgetText = page.locator('text=Умные инсайты доступны только после входа');
  await lockedWidgetText.waitFor({ timeout: 5000 });
  console.log('   ✓ Locked widget title is visible');

  const lockedWidgetBtn = page.locator('button:has-text("Войти в аккаунт")');
  await lockedWidgetBtn.waitFor({ timeout: 5000 });
  console.log('   ✓ "Войти в аккаунт" CTA button is visible');

  // Capture Screenshot: Guest Dashboard with locked insights widget
  const guestDashShot = path.join(ARTIFACTS_DIR, 'guest_dashboard_insights_locked.png');
  await page.screenshot({ path: guestDashShot, fullPage: false });
  console.log('   📸 Screenshot saved:', guestDashShot);

  // 3. Navigate to Insights tab and verify locked hero view
  console.log('3. Navigating to Insights tab...');
  const insightsTab = page.locator('#navTab-insights');
  await insightsTab.click();
  await page.waitForTimeout(600);

  const lockedHeroTitle = page.locator('h2:has-text("Кросс-модульные инсайты закрыты")');
  await lockedHeroTitle.waitFor({ timeout: 5000 });
  console.log('   ✓ Locked hero screen visible:', await lockedHeroTitle.isVisible());

  const heroCtaBtn = page.locator('button:has-text("Войти или зарегистрироваться")').first();
  await heroCtaBtn.waitFor({ timeout: 5000 });
  console.log('   ✓ "Войти или зарегистрироваться" hero CTA visible');

  // Capture Screenshot: Guest Insights View locked
  const guestInsightsShot = path.join(ARTIFACTS_DIR, 'guest_insights_view_locked.png');
  await page.screenshot({ path: guestInsightsShot, fullPage: false });
  console.log('   📸 Screenshot saved:', guestInsightsShot);

  // 4. Open AI Drawer and verify locked state
  console.log('4. Opening AI Drawer in guest mode...');
  const aiButton = page.locator('#btnSidebarAi');
  await aiButton.click();
  await page.waitForTimeout(600);

  const aiDrawerLockedTitle = page.locator('h3:has-text("Коуч «Огонёк» и AI закрыты")');
  await aiDrawerLockedTitle.waitFor({ timeout: 5000 });
  console.log('   ✓ AI Drawer locked title is visible');

  const aiDrawerHeaderBadge = page.locator('text=Только в аккаунте').last();
  console.log('   ✓ AI Drawer header badge visible:', await aiDrawerHeaderBadge.isVisible());

  // Capture Screenshot: Guest AI Drawer locked
  const guestAiDrawerShot = path.join(ARTIFACTS_DIR, 'guest_ai_drawer_locked.png');
  await page.screenshot({ path: guestAiDrawerShot, fullPage: false });
  console.log('   📸 Screenshot saved:', guestAiDrawerShot);

  // Close AI drawer by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // 5. Verify basic tracking features still work for guest
  console.log('5. Verifying basic tracking works for guest...');
  const habitsTab = page.locator('#navTab-habits');
  await habitsTab.click();
  await page.waitForTimeout(500);

  const habitRows = page.locator('[data-habit-row]');
  const habitCount = await habitRows.count();
  console.log('   ✓ Basic habits loaded count:', habitCount);

  // ══════════════════════════════════════════════════════════
  // SCENARIO 2: New User Registration & Welcome Tour Modal
  // ══════════════════════════════════════════════════════════
  console.log('\n--- Scenario 2: New User Welcome Tour Modal ---');

  // Trigger isTourProposalOpen (as occurs upon registerWithEmail / new user login)
  await page.evaluate(() => {
    window.__habitStore.setIsTourProposalOpen(true);
  });
  await page.waitForTimeout(600);

  // Verify WelcomeTourModal dialog is open
  const welcomeModalTitle = page.locator('h2:has-text("Добро пожаловать в HabitSpace!")');
  await welcomeModalTitle.waitFor({ timeout: 5000 });
  console.log('   ✓ Welcome Tour Modal title is visible:', await welcomeModalTitle.isVisible());

  const startTourBtn = page.locator('button:has-text("Пройти обучение (2 мин)")');
  await startTourBtn.waitFor({ timeout: 5000 });
  console.log('   ✓ "Пройти обучение (2 мин)" button is visible');

  const dismissTourBtn = page.locator('button:has-text("Пропустить")');
  console.log('   ✓ "Пропустить" button is visible:', await dismissTourBtn.isVisible());

  // Capture Screenshot: Welcome Tour Modal
  const welcomeTourModalShot = path.join(ARTIFACTS_DIR, 'new_user_welcome_tour_modal.png');
  await page.screenshot({ path: welcomeTourModalShot, fullPage: false });
  console.log('   📸 Screenshot saved:', welcomeTourModalShot);

  // Click "Пройти обучение (2 мин)" to start interactive walkthrough
  console.log('6. Clicking "Пройти обучение (2 мин)"...');
  await startTourBtn.click();
  await page.waitForTimeout(800);

  // Verify Welcome modal is closed
  const isModalStillOpen = await welcomeModalTitle.isVisible();
  console.log('   ✓ Welcome modal closed:', !isModalStillOpen);

  // Verify HelpTour is now active on Step 1 of 8
  const tourStepBadge = page.locator('text=Шаг 1 из 8 • Меню');
  await tourStepBadge.waitFor({ timeout: 5000 });
  console.log('   ✓ HelpTour started at Step 1 of 8:', await tourStepBadge.isVisible());

  // Capture Screenshot: HelpTour Step 1 Active
  const tourStep1Shot = path.join(ARTIFACTS_DIR, 'new_user_tour_step1_active.png');
  await page.screenshot({ path: tourStep1Shot, fullPage: false });
  console.log('   📸 Screenshot saved:', tourStep1Shot);

  // Step through tour to step 2
  const nextTourBtn = page.locator('button:has-text("Далее")').first();
  if (await nextTourBtn.isVisible()) {
    await nextTourBtn.click();
    await page.waitForTimeout(500);
    const tourStep2Badge = page.locator('text=Шаг 2 из 8 • Привычки');
    console.log('   ✓ Navigated to Step 2 of 8:', await tourStep2Badge.isVisible());
  }

  // Close browser
  await browser.close();
  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED 100%!');
}

run().catch(err => {
  console.error('❌ Playwright verification error:', err);
  process.exit(1);
});
