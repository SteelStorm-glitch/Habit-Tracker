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

async function waitForAiResponse(page, timeoutMs = 12000) {
  // Wait until typing indicator disappears (or max timeout)
  console.log('⏳ Waiting for AI response...');
  try {
    // Wait a brief moment for thinking indicator to appear
    await page.waitForTimeout(500);
    // If thinking indicator is visible, wait for it to detach
    const thinkingLocator = page.locator('text=Gemini думает');
    if (await thinkingLocator.isVisible({ timeout: 1500 }).catch(() => false)) {
      console.log('...Gemini is thinking...');
      await thinkingLocator.waitFor({ state: 'detached', timeout: timeoutMs });
    }
  } catch (e) {
    console.log('Thinking wait timeout/settled:', e.message);
  }
  await page.waitForTimeout(1000);
}

async function getLastBotMessage(page) {
  const messages = page.locator('[data-slot="sheet-content"] .whitespace-pre-wrap');
  const count = await messages.count();
  if (count > 0) {
    return await messages.nth(count - 1).textContent();
  }
  return '(no message found)';
}

async function run() {
  console.log('🚀 Starting AI Assistant Interactive Conversation Test...');
  console.log(`Target: ${TARGET_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`[Browser Error]: ${msg.text()}`);
    }
  });

  try {
    // 1. Load app
    console.log('1. Loading application...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 2. Open AI Drawer
    console.log('2. Opening AI Assistant drawer...');
    const aiBtn = page.locator('#btnSidebarAi');
    await aiBtn.waitFor({ state: 'visible' });
    await aiBtn.click();
    await page.waitForTimeout(800);
    await snap(page, 'ai_test_01_drawer_opened');

    // 3. Conversation 1: Water habit advice
    console.log('\n--- Test 1: Standard advice on habits ---');
    const input = page.locator('[data-slot="sheet-content"] input[type="text"]');
    await input.waitFor({ state: 'visible' });
    await input.fill('Привет! Как мне привить привычку пить воду каждый день и не забывать?');
    await page.locator('[data-slot="sheet-content"] button[title="Отправить сообщение"]').click();
    
    await waitForAiResponse(page);
    const resp1 = await getLastBotMessage(page);
    console.log('🤖 AI Response 1:\n', resp1);
    await snap(page, 'ai_test_02_water_habit_response');

    // 4. Conversation 2: Quick Chip with @yt mention
    console.log('\n--- Test 2: Quick suggestion chip @yt ---');
    const ytChip = page.locator('[data-slot="sheet-content"] button:has-text("@yt Видео")');
    if (await ytChip.isVisible()) {
      await ytChip.click();
      await waitForAiResponse(page);
      const resp2 = await getLastBotMessage(page);
      console.log('🤖 AI Response 2 (@yt):\n', resp2);
      await snap(page, 'ai_test_03_yt_chip_response');
    } else {
      console.log('⚠️ @yt chip not found');
    }

    // 5. Conversation 3: Context-aware query about user stats
    console.log('\n--- Test 3: Context awareness (habits count, discipline) ---');
    await input.fill('@habits сколько у меня активных привычек и как мне их распределить по дню?');
    await page.locator('[data-slot="sheet-content"] button[title="Отправить сообщение"]').click();
    await waitForAiResponse(page);
    const resp3 = await getLastBotMessage(page);
    console.log('🤖 AI Response 3 (@habits):\n', resp3);
    await snap(page, 'ai_test_04_habits_context_response');

    // 6. Conversation 4: Generate Task Action
    console.log('\n--- Test 4: Task generation button (+30 XP) ---');
    const genTaskBtn = page.locator('[data-slot="sheet-content"] button:has-text("Сгенерировать задачу")');
    if (await genTaskBtn.isVisible()) {
      await genTaskBtn.click();
      await page.waitForTimeout(1500);
      const resp4 = await getLastBotMessage(page);
      console.log('🤖 AI Response 4 (Task Gen):\n', resp4);
      await snap(page, 'ai_test_05_generate_task_response');
    }

    // 7. Conversation 5: What it CANNOT do (External actions / destructive commands)
    console.log('\n--- Test 5: Boundary test (what AI cannot do) ---');
    await input.fill('Можешь удалить все мои задачи в базе данных и позвонить мне на телефон?');
    await page.locator('[data-slot="sheet-content"] button[title="Отправить сообщение"]').click();
    await waitForAiResponse(page);
    const resp5 = await getLastBotMessage(page);
    console.log('🤖 AI Response 5 (Boundaries/Capabilities):\n', resp5);
    await snap(page, 'ai_test_06_boundary_test_response');

    console.log('\n✅ All AI test conversations completed successfully!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await snap(page, 'ai_test_error');
  } finally {
    await browser.close();
  }
}

run();
