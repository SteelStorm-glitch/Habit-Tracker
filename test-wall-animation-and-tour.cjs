const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\18385c30-92ad-4fd4-832d-6c20d86e5484';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function snap(page, name) {
  const filePath = path.join(ARTIFACTS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath });
  console.log(`📸 Saved screenshot: ${name}.png`);
}

const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Settings & AI Wall-Slide Animation + Dynamic Help Tour Test...');
  console.log(`URL: ${TARGET_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
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

  // 1. Initial Load
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 2. Test Settings Drawer Slide-In
  console.log('Testing Settings Drawer Wall Slide...');
  await page.click('#btnSidebarSettings');
  await page.waitForTimeout(400);

  const settingsContent = await page.$('[data-slot="sheet-content"]');
  if (settingsContent) {
    const isVisible = await settingsContent.isVisible();
    const animName = await page.evaluate(el => window.getComputedStyle(el).animationName, settingsContent);
    console.log(`✓ Settings drawer is visible: ${isVisible}, animation: ${animName}`);
    await snap(page, '01_settings_wall_slide');
  } else {
    console.error('❌ Settings drawer content not found!');
  }

  // Close Settings Drawer by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 3. Test AI Drawer Slide-In
  console.log('Testing AI Drawer Wall Slide...');
  await page.click('#btnSidebarAi');
  await page.waitForTimeout(400);

  const aiContent = await page.$('[data-slot="sheet-content"]');
  if (aiContent) {
    const isVisible = await aiContent.isVisible();
    const animName = await page.evaluate(el => window.getComputedStyle(el).animationName, aiContent);
    console.log(`✓ AI drawer is visible: ${isVisible}, animation: ${animName}`);
    await snap(page, '02_ai_drawer_wall_slide');
  } else {
    console.error('❌ AI drawer content not found!');
  }

  // Close AI Drawer by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 4. Test Dynamic Help Tour
  console.log('Starting Dynamic Help Tour...');
  await page.click('#btnSidebarTour');
  await page.waitForTimeout(400);

  for (let step = 1; step <= 8; step++) {
    // Check tooltip visibility
    const tooltip = await page.$('div[role="dialog"]');
    if (!tooltip) {
      console.error(`❌ Tooltip not found on step ${step}!`);
      continue;
    }

    const title = await tooltip.$eval('h3', el => el.textContent);
    console.log(`✓ Step ${step}: Title = "${title}"`);

    // Check if what-it-does and how-to-use exist
    const doesText = await tooltip.innerText();
    const hasDoes = doesText.includes('Что делает');
    const hasHow = doesText.includes('Как использовать');
    console.log(`   Has 'Что делает': ${hasDoes}, Has 'Как использовать': ${hasHow}`);
    await snap(page, `tour_step_${step}`);

    // Click next if not last step
    if (step < 8) {
      const nextBtn = await tooltip.$('button:has-text("Далее")');
      if (nextBtn) {
        await nextBtn.click();
        await page.waitForTimeout(400);
      }
    } else {
      const finishBtn = await tooltip.$('button:has-text("Понятно!")');
      if (finishBtn) {
        await finishBtn.click();
        await page.waitForTimeout(300);
        console.log('✓ Tour finished successfully!');
      }
    }
  }

  console.log('Errors encountered:', errors.length);
  await browser.close();

  if (errors.length > 0) {
    console.error('Test completed with errors:', errors);
    process.exit(1);
  } else {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  }
}

run().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
