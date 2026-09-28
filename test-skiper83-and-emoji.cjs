const { chromium } = require('playwright');
const path = require('node:path');

const ARTIFACTS_DIR = 'C:\\Users\\Steel Storm\\.gemini\\antigravity\\brain\\00d48e29-5f33-4b56-a5e6-2cf4d2f47fca';
const TARGET_URL = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

async function run() {
  console.log('🚀 Running Verification for skiper83 (AI Mentions) & Watermelon Emoji Spree Choice Chips...');
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

  // 2. Test Watermelon Emoji Choice Chips in HabitModal
  console.log('Testing Watermelon Emoji Spree Choice Chips in HabitModal...');
  const addHabitBtn = page.locator('button:has-text("Новая привычка"), button:has-text("Создать привычку"), button:has-text("Добавить привычку")').first();
  if (await addHabitBtn.isVisible()) {
    await addHabitBtn.click();
    await page.waitForTimeout(500);

    // Look for category pill "Разум" or "Баланс" in emoji picker
    const mindCategoryPill = page.locator('button:has-text("Разум")').first();
    if (await mindCategoryPill.isVisible()) {
      await mindCategoryPill.click();
      await page.waitForTimeout(300);
    }

    // Click an emoji chip (e.g. 📚 or 🧘 or 💡)
    const emojiChip = page.locator('button:has-text("📚"), button:has-text("🧘"), button:has-text("💡")').first();
    if (await emojiChip.isVisible()) {
      await emojiChip.click();
      await page.waitForTimeout(350); // allow floating emoji animation to bloom
    }

    await snap('watermelon_emoji_spree_choice_chips');

    // Close habit modal
    const cancelModal = page.locator('button:has-text("Отмена")').first();
    if (await cancelModal.isVisible()) {
      await cancelModal.click();
      await page.waitForTimeout(300);
    }
  } else {
    console.warn('Could not find Add Habit button');
  }

  // 3. Test Skiper83 AI Chat & Mentions
  console.log('Testing Skiper-UI skiper83 AI Assistant & @mentions...');
  const aiButton = page.locator('button[title="AI Ассистент"], button[aria-label="AI Ассистент"], button:has-text("AI")').first();
  if (await aiButton.isVisible()) {
    await aiButton.click();
    await page.waitForTimeout(500);

    await snap('skiper83_ai_drawer_open');

    // Focus chat input and type '@'
    const chatInput = page.locator('input[placeholder*="интеграций"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.click();
      await chatInput.fill('@');
      await page.waitForTimeout(400);

      // Verify mention popover visible
      await snap('skiper83_mention_popover_dropdown');

      // Fill full query with @yt
      await chatInput.fill('@yt утренняя йога для начинающих 15 минут');
      await page.waitForTimeout(200);

      // Click Send button
      const sendBtn = page.locator('button[title="Отправить (Enter)"], button[aria-label="Отправить"]').first();
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      } else {
        await chatInput.press('Enter');
      }

      // Snapshot thinking animation while isAiThinking is active!
      await page.waitForTimeout(200);
      await snap('gemini_ai_thinking_animation');

      console.log('Waiting for AI response and YouTube mention card...');
      await page.waitForTimeout(1000);
      await snap('skiper83_mention_card_rendered');

      // Test second query with @notion
      console.log('Testing @notion template query...');
      await chatInput.fill('@notion трекер привычек на 30 дней');
      await page.waitForTimeout(200);
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      } else {
        await chatInput.press('Enter');
      }

      await page.waitForTimeout(1000);
      await snap('skiper83_interactive_cards_conversation');
    } else {
      console.warn('Chat input not found');
    }
  } else {
    console.warn('AI Assistant button not found');
  }

  // 4. Test Mobile Responsive View for AI Drawer
  console.log('Testing Skiper83 AI Drawer on Mobile (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await snap('skiper83_mobile_chat_view');

  console.log('🎉 Verification completed with', errors.length, 'errors.');
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
