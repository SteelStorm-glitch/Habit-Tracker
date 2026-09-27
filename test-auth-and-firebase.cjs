const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\aa93fd58-b4b6-49ab-854e-3318ccab53d5';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Firebase Auth & Account-bound Gamification Verification...');
  console.log(`URL: ${TARGET_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error(`[Browser Error]: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
    console.error(`[Page Error]: ${err}`);
  });

  async function snap(name) {
    const file = path.join(ARTIFACTS_DIR, `${name}.png`);
    await page.screenshot({ path: file });
    console.log(`📸 Saved screenshot: ${name}.png`);
  }

  // 1. Initial Load (Guest Mode)
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // Check localStorage: habit_app_gamification must NOT exist for guests
  const lsGamification = await page.evaluate(() => localStorage.getItem('habit_app_gamification'));
  console.log('LocalStorage gamification for guest:', lsGamification, '(Expected: null)');

  // 2. Open Profile Tab as Guest -> Should render HabitSpace Auth Design
  console.log('Opening Profile Tab as Guest...');
  await page.click('#btnSidebarUser');
  await page.waitForTimeout(600);
  await snap('firebase_auth_01_desktop');

  // Verify elements on Desktop Auth screen
  const heroTitle = await page.textContent('h1');
  console.log(`Hero Title: "${heroTitle}"`);

  // Switch to "Вход" tab
  console.log('Testing Tab switch to "Вход"...');
  await page.click('button:has-text("Вход")');
  await page.waitForTimeout(300);
  await snap('firebase_auth_02_signin_tab');

  // Switch back to "Регистрация"
  await page.click('button:has-text("Регистрация")');
  await page.waitForTimeout(300);

  // 3. Test Mobile Auth Layout (390x844 iPhone)
  console.log('Testing Mobile Layout (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await snap('firebase_auth_03_mobile');

  // 4. Reset to Desktop and test Modal Dialog
  console.log('Testing Modal Dialog Auth...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('#navTab-habits');
  await page.waitForTimeout(400);

  // Click flame in sidebar as guest to open modal
  await page.click('aside button[title*="Войдите"]');
  await page.waitForTimeout(500);
  await snap('firebase_auth_04_dialog_modal');

  // Close modal via close button
  await page.click('button[title="Закрыть"]');
  await page.waitForTimeout(400);

  // 5. Test Live Registration with Firebase
  console.log('Testing Live Registration with Firebase...');
  await page.click('#btnSidebarUser');
  await page.waitForTimeout(400);

  const testEmail = `user_${Date.now()}@habitspace.app`;
  console.log(`Registering new test user: ${testEmail}`);

  await page.fill('input[placeholder="Артём"]', 'Артем');
  await page.fill('input[placeholder="artyom@mail.ru"]', testEmail);
  await page.fill('input[placeholder="Минимум 8 символов"]', 'SecurePass123!');
  await page.waitForTimeout(300);

  // Click submit
  await page.click('button[type="submit"]:has-text("Создать аккаунт")');
  
  // Wait for Firebase response and sync (up to 4s)
  await page.waitForTimeout(3500);
  await snap('firebase_auth_05_registered_profile');

  // Verify that profile now shows real user and cloud streak
  const currentUrl = page.url();
  const pageText = await page.textContent('body');
  const hasUserHandle = pageText.includes('@артем') || pageText.includes(testEmail);
  console.log(`Profile rendered for registered user: ${hasUserHandle}`);

  console.log('✅ Audit Complete! Browser errors:', errors.length);
  await browser.close();
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
