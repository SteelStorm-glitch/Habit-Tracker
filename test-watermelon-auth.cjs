const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Watermelon Auth-08 Black & Purple Verification...');
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

  // 1. Initial Load (Guest Mode)
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 2. Open Profile Tab -> Renders Watermelon Auth-08 in guest mode
  console.log('Navigating to Profile tab to view AuthFormView...');
  const userButton = page.locator('#btnSidebarUser, button:has-text("Войти в аккаунт"), button:has-text("Профиль")').first();
  if (await userButton.isVisible()) {
    await userButton.click();
  } else {
    // If not found by selector, look for sidebar button
    await page.click('nav button:last-child');
  }
  await page.waitForTimeout(800);
  await snap('auth_08_signup_desktop');

  // 3. Switch to "Вход" (Sign In) tab
  console.log('Switching to "Вход" tab...');
  await page.click('button:has-text("Вход")');
  await page.waitForTimeout(400);
  await snap('auth_08_signin_desktop');

  // 4. Test typing password and toggling show/hide password
  console.log('Testing password input and eye toggle...');
  await page.fill('#auth-password', 'secretPass123!');
  await page.waitForTimeout(200);
  await snap('auth_08_password_hidden');

  const eyeButton = page.locator('button[aria-label="Переключить видимость пароля"]');
  await eyeButton.click();
  await page.waitForTimeout(200);
  await snap('auth_08_password_visible');

  // 5. Switch back to "Регистрация"
  console.log('Switching to "Регистрация" tab...');
  await page.click('button:has-text("Регистрация")');
  await page.waitForTimeout(300);
  await page.fill('#auth-username', 'Alex');
  await page.fill('#auth-email', 'alex@example.com');
  await page.waitForTimeout(200);
  await snap('auth_08_signup_filled');

  // 6. Test Mobile Viewport (iPhone 14 style: 390x844)
  console.log('Testing mobile responsive layout...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await snap('auth_08_mobile_view');

  // 6b. Test Tablet Viewport (iPad / Tablet style: 768x1024 & 820x1180)
  console.log('Testing tablet responsive layout...');
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.waitForTimeout(400);
  await snap('auth_08_tablet_view');

  // 7. Test Auth Modal in desktop mode
  console.log('Testing AuthModal in desktop mode...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Open Settings Sheet by clicking settings button in sidebar
  const settingsBtn = page.locator('button[title="Настройки"]').first();
  if (await settingsBtn.isVisible()) {
    await settingsBtn.click();
    await page.waitForTimeout(400);

    const loginInSettings = page.locator('[data-slot="sheet-content"] button:has-text("Войти")').first();
    if (await loginInSettings.isVisible()) {
      await loginInSettings.click();
      await page.waitForTimeout(600);
      await snap('auth_08_modal_desktop');

      // Close modal using close button
      const closeBtn = page.locator('button[title="Закрыть"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }

      // Also test mobile modal view
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);
      const settingsBtnMobile = page.locator('button[title="Настройки"]').first();
      if (await settingsBtnMobile.isVisible()) {
        await settingsBtnMobile.click();
        await page.waitForTimeout(400);
        const loginMobile = page.locator('[data-slot="sheet-content"] button:has-text("Войти")').first();
        if (await loginMobile.isVisible()) {
          await loginMobile.click();
          await page.waitForTimeout(600);
          await snap('auth_08_modal_mobile');
        }
      }
    }
  }

  console.log('🎉 Verification completed with', errors.length, 'errors.');
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
