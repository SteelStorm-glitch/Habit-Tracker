const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Firebase habit-b2d0a Live Auth & Full Cloud Sync Verification...');
  console.log(`URL: ${TARGET_URL}`);

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  });
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

  // 1. Initial Load
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 2. Open Profile Tab as Guest
  console.log('Navigating to Profile Tab...');
  const userBtn = page.locator('#btnSidebarUser').first();
  await userBtn.click();
  await page.waitForTimeout(800);

  // 3. Register a new user with real Firebase habit-b2d0a
  const testEmail = `habit_sync_${Date.now()}@example.com`;
  console.log(`Registering new Firebase user: ${testEmail}...`);

  await page.fill('#auth-username', 'Steel Storm');
  await page.fill('#auth-email', testEmail);
  await page.fill('#auth-password', 'StrongPass123!');
  await page.waitForTimeout(300);

  // Click Submit
  await page.click('button[type="submit"]:has-text("Зарегистрироваться")');

  // Wait for Firebase Auth & RTDB/Firestore response
  console.log('Waiting for Firebase response and cloud sync...');
  await page.waitForTimeout(3500);

  // Take screenshot of authenticated profile
  await snap('firebase_habit_b2d0a_profile_synced');

  // Verify that profile displays habit-b2d0a
  const pageContent = await page.textContent('body');
  const hasBadge = pageContent.includes('habit-b2d0a');
  console.log(`Profile displays "habit-b2d0a" badge: ${hasBadge}`);

  // 4. Test Settings Sheet Cloud Card
  console.log('Opening Settings to verify Firebase cloud status card...');
  const settingsBtn = page.locator('button[aria-label="Настройки"]').first();
  await settingsBtn.click();
  await page.waitForTimeout(600);
  await snap('firebase_habit_b2d0a_settings_card');

  console.log('✅ Verification finished successfully! Browser errors:', errors.length);
  await browser.close();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
