const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\aa93fd58-b4b6-49ab-854e-3318ccab53d5';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Glassmorphism Verification Audit...');
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

  // 1. Initial Load (Habits View with Left Sidebar & Glass Cards)
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await snap('glass_01_habits_desktop');

  // Verify Sidebar presence
  const sidebarVisible = await page.isVisible('aside');
  console.log(`Sidebar visible: ${sidebarVisible}`);

  // Click on a habit chip to test toggle + XP
  const habitChip = await page.$('button:has-text("Пить воду")');
  if (habitChip) {
    await habitChip.click();
    await page.waitForTimeout(300);
    console.log('Toggled habit chip "Пить воду"');
  }

  // 2. Switch to Tasks View via Left Sidebar
  console.log('Navigating to Tasks via left sidebar...');
  await page.click('button[title="Задачи"]');
  await page.waitForTimeout(400);
  await snap('glass_02_tasks_view');

  // Test AI task generator button
  console.log('Generating AI task...');
  const aiTaskBtn = await page.$('button:has-text("AI задача")');
  if (aiTaskBtn) {
    await aiTaskBtn.click();
    await page.waitForTimeout(500);
    console.log('AI task generated successfully!');
  }
  await snap('glass_03_tasks_after_ai');

  // 3. Switch to Finance View via Left Sidebar
  console.log('Navigating to Finance via left sidebar...');
  await page.click('button[title="Финансы"]');
  await page.waitForTimeout(400);
  await snap('glass_04_finance_view');

  // 4. Open AI Drawer from Sidebar
  console.log('Opening AI Drawer...');
  await page.click('button[title="AI Ассистент"]');
  await page.waitForTimeout(500);
  await snap('glass_05_ai_drawer');

  // Open AI Settings
  console.log('Opening AI Model Settings...');
  const aiSettingsBtn = await page.$('button[title="Настройки AI модели"]');
  if (aiSettingsBtn) {
    await aiSettingsBtn.click();
    await page.waitForTimeout(300);
  }
  await snap('glass_06_ai_drawer_settings');

  // Close AI Drawer
  const closeDrawerBtn = await page.$('[data-slot="sheet-content"] [data-slot="sheet-close"]');
  if (closeDrawerBtn) {
    await closeDrawerBtn.click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 5. Open Settings Sheet
  console.log('Opening Settings Sheet...');
  await page.click('button[title="Настройки"]');
  await page.waitForTimeout(500);
  await snap('glass_07_settings_sheet_gamification');

  // Close Settings
  const closeSettingsBtn = await page.$('[data-slot="sheet-content"] [data-slot="sheet-close"]');
  if (closeSettingsBtn) {
    await closeSettingsBtn.click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 6. Test Mobile View (390x844 iPhone)
  console.log('Testing Mobile View (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await snap('glass_08_mobile_bottom_bar');

  // Switch tab on mobile
  await page.click('#navTabMobile-habits');
  await page.waitForTimeout(400);
  await snap('glass_09_mobile_habits');

  console.log('✅ Glassmorphism Verification Complete! Total console errors:', errors.length);
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
