const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Skiper-UI (skiper98 + skiper106) Verification...');
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

  // 1. Initial Load (Desktop)
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await snap('skiper98_desktop_initial');

  // 2. Hover over navigation tabs to trigger skiper98 clip-path tooltips
  console.log('Testing Skiper98 hover tooltip on "Задачи"...');
  const tasksTab = page.locator('#navTab-tasks');
  if (await tasksTab.isVisible()) {
    await tasksTab.hover();
    await page.waitForTimeout(400);
    await snap('skiper98_tooltip_tasks_hover');
  }

  console.log('Testing Skiper98 hover tooltip on "Финансы"...');
  const financeTab = page.locator('#navTab-finance');
  if (await financeTab.isVisible()) {
    await financeTab.hover();
    await page.waitForTimeout(400);
    await snap('skiper98_tooltip_finance_hover');
  }

  // 3. Test Skiper106 SmoothInput in HabitModal
  console.log('Testing Skiper106 SmoothInput in HabitModal...');
  const addHabitBtn = page.locator('button:has-text("Создать привычку"), button:has-text("Добавить привычку"), button[title*="привычк"]').first();
  if (await addHabitBtn.isVisible()) {
    await addHabitBtn.click();
    await page.waitForTimeout(400);

    // Find title input and type
    const habitTitleInput = page.locator('input[placeholder*="Зарядка"]').first();
    if (await habitTitleInput.isVisible()) {
      await habitTitleInput.click();
      await page.waitForTimeout(200);
      await habitTitleInput.fill('Утренняя медитация');
      await page.waitForTimeout(300);
      await snap('skiper106_smooth_input_habit_title');
    }

    // Close modal
    const cancelBtn = page.locator('button:has-text("Отмена")').first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // 4. Test Skiper106 SmoothInput in TransactionModals (Number and text)
  console.log('Switching to Finance tab to test SmoothInput number inputs...');
  await financeTab.click();
  await page.waitForTimeout(500);

  const addIncomeBtn = page.locator('button:has-text("Добавить доход"), button:has-text("Доход")').first();
  if (await addIncomeBtn.isVisible()) {
    await addIncomeBtn.click();
    await page.waitForTimeout(400);

    const amountInput = page.locator('input[type="number"]').first();
    if (await amountInput.isVisible()) {
      await amountInput.click();
      await page.waitForTimeout(200);
      await amountInput.fill('75000');
      await page.waitForTimeout(300);
      await snap('skiper106_smooth_input_number_income');
    }

    const cancelModal = page.locator('button:has-text("Отмена")').first();
    if (await cancelModal.isVisible()) {
      await cancelModal.click();
      await page.waitForTimeout(300);
    }
  }

  // 5. Test Mobile Bottom Bar spring active indicator
  console.log('Testing Skiper98 mobile bottom bar on 390x844...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await snap('skiper98_mobile_bottom_bar');

  console.log('🎉 Verification completed with', errors.length, 'errors.');
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
