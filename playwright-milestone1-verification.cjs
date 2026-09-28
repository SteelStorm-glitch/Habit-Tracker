const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_FILE = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function run() {
  console.log('🚀 Starting Milestone 1 Playwright Verification...');
  console.log('Target URL:', TARGET_FILE);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Listen to console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  [Browser Error]:', msg.text());
    }
  });

  await page.goto(TARGET_FILE, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 1. Verify Proactive Coach Banner
  console.log('Checking Proactive Coach Banner...');
  const banner = page.locator('text=Огонёк · Персональный коуч');
  await banner.waitFor({ timeout: 5000 });
  const hasBanner = await banner.isVisible();
  console.log('  ✓ Proactive banner visible:', hasBanner);

  // 2. Verify Insights Dashboard Widget
  console.log('Checking Insights Dashboard Widget...');
  const widget = page.locator('text=Кросс-модульные инсайты');
  await widget.waitFor({ timeout: 5000 });
  const hasWidget = await widget.isVisible();
  console.log('  ✓ Insights dashboard widget visible:', hasWidget);

  // Take Dashboard Screenshot
  const dashboardShot = path.join(ARTIFACTS_DIR, 'milestone1_dashboard_insights.png');
  await page.screenshot({ path: dashboardShot, fullPage: false });
  console.log('  📸 Screenshot saved:', dashboardShot);

  // 3. Navigate to "Инсайты" view via widget button or sidebar
  console.log('Navigating to Insights view...');
  const viewAllBtn = page.locator('button:has-text("Все инсайты")');
  if (await viewAllBtn.isVisible()) {
    await viewAllBtn.click();
  } else {
    await page.locator('text=Инсайты').first().click();
  }
  await page.waitForTimeout(800);

  const insightsHeading = page.locator('h1:has-text("Инсайты и закономерности")');
  await insightsHeading.waitFor({ timeout: 5000 });
  console.log('  ✓ Insights view title visible:', await insightsHeading.isVisible());

  // Check category filter pills
  const prodTab = page.locator('button:has-text("Продуктивность")');
  console.log('  ✓ Category filter tab visible:', await prodTab.isVisible());

  // Take Insights View Screenshot
  const insightsShot = path.join(ARTIFACTS_DIR, 'milestone1_insights_view.png');
  await page.screenshot({ path: insightsShot, fullPage: false });
  console.log('  📸 Screenshot saved:', insightsShot);

  // 4. Test Coach Ogonyok AI Drawer
  console.log('Testing Coach Ogonyok AI Drawer...');
  await page.locator('#navTab-habits').click();
  await page.waitForTimeout(500);

  // Click "Обсудить с Огоньком" on the proactive banner
  const discussBtn = page.locator('button:has-text("Обсудить с Огоньком")').first();
  if (await discussBtn.isVisible()) {
    await discussBtn.click();
  } else {
    await page.locator('#btnSidebarAi').click();
  }
  await page.waitForTimeout(1000);

  const ogonyokTitle = page.locator('text=Коуч «Огонёк»');
  await ogonyokTitle.waitFor({ timeout: 5000 });
  console.log('  ✓ Coach Ogonyok drawer open:', await ogonyokTitle.isVisible());

  // Take Ogonyok Drawer Screenshot
  const drawerShot = path.join(ARTIFACTS_DIR, 'milestone1_ogonyok_drawer.png');
  await page.screenshot({ path: drawerShot, fullPage: false });
  console.log('  📸 Screenshot saved:', drawerShot);

  await browser.close();
  console.log('✅ Milestone 1 Playwright Verification Completed Successfully!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
