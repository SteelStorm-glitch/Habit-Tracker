const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\aa93fd58-b4b6-49ab-854e-3318ccab53d5';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Profile & Wall Animation Audit...');
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

  // 1. Initial Load
  await page.goto(TARGET_URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 2. Verify Level Badge is removed from sidebar button panel
  console.log('Verifying level badge is removed from sidebar...');
  const sidebarHtml = await page.innerHTML('aside.glass-sidebar');
  const hasLevelBadgeInSidebar = sidebarHtml.includes('Уровень 3 •') || sidebarHtml.includes('strokeDasharray');
  console.log(`Level badge in sidebar: ${hasLevelBadgeInSidebar} (Expected: false)`);

  // 3. Open Profile View via Sidebar User Avatar
  console.log('Navigating to Profile via User Avatar button...');
  await page.click('#btnSidebarUser');
  await page.waitForTimeout(500);
  await snap('profile_01_desktop');

  // Verify Profile elements
  const profileHeading = await page.textContent('h1');
  console.log(`Profile heading: "${profileHeading}"`);

  // 4. Test AI Drawer Wall Slide Animation
  console.log('Opening AI Drawer (Wall Slide)...');
  await page.click('#btnSidebarAi');
  await page.waitForTimeout(400); // Capture mid-to-end of animation
  await snap('wall_slide_01_ai_drawer');

  // Close AI Drawer
  const closeAiBtn = await page.$('[data-slot="sheet-content"] [data-slot="sheet-close"]');
  if (closeAiBtn) {
    await closeAiBtn.click();
    await page.waitForTimeout(400);
  }

  // 5. Test Settings Sheet Wall Slide Animation
  console.log('Opening Settings Sheet (Wall Slide)...');
  await page.click('#btnSidebarSettings');
  await page.waitForTimeout(400);
  await snap('wall_slide_02_settings_sheet');

  // Close Settings
  const closeSettingsBtn = await page.$('[data-slot="sheet-content"] [data-slot="sheet-close"]');
  if (closeSettingsBtn) {
    await closeSettingsBtn.click();
    await page.waitForTimeout(400);
  }

  // 6. Test Mobile Profile View (390x844 iPhone)
  console.log('Testing Mobile Profile View (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);

  await page.click('#navTabMobile-profile');
  await page.waitForTimeout(400);
  await snap('profile_02_mobile');

  console.log('✅ Audit Complete! Errors:', errors.length);
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
