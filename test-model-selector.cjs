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

const TARGET_URL = 'http://127.0.0.1:5173/';

async function run() {
  console.log('🚀 Testing Model Selector in AI Drawer...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Open AI Drawer
    await page.locator('#btnSidebarAi').click();
    await page.waitForTimeout(600);
    await snap(page, 'ai_model_selector_01_drawer');

    // Click on Model Selector pill to open dropdown
    const modelPill = page.locator('[data-slot="sheet-header"] button:has-text("Gemini")');
    await modelPill.waitFor({ state: 'visible' });
    await modelPill.click();
    await page.waitForTimeout(400);
    await snap(page, 'ai_model_selector_02_dropdown_open');

    // Select Gemini 3.8 Flash
    const flash38Btn = page.locator('button:has-text("Gemini 3.8 Flash")');
    await flash38Btn.click();
    await page.waitForTimeout(400);
    await snap(page, 'ai_model_selector_03_flash_38_selected');

    // Test sending message with Gemini 3.8 Flash
    const input = page.locator('[data-slot="sheet-content"] input[type="text"]');
    await input.fill('Привет! Какая модель сейчас мне отвечает и какие у тебя возможности?');
    await page.locator('[data-slot="sheet-content"] button[title="Отправить сообщение"]').click();

    // Wait for response
    await page.waitForTimeout(4000);
    const thinkingLocator = page.locator('text=Gemini думает');
    if (await thinkingLocator.isVisible().catch(() => false)) {
      await thinkingLocator.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1000);
    await snap(page, 'ai_model_selector_04_message_response');

    console.log('✅ Model selector test completed successfully!');
  } catch (err) {
    console.error('❌ Error during model selector test:', err);
    await snap(page, 'ai_model_selector_error');
  } finally {
    await browser.close();
  }
}

run();
