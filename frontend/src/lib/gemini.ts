// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini AI Client (Gemini 3.5 Flash-Lite)
// ─────────────────────────────────────────────────────────────────────────────

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite'

// Fallback cascade in case of temporary 503 high-demand spikes on Google's API
const MODEL_CASCADE = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
]

export interface GeminiContext {
  habitsCount?: number
  streakDays?: number
  level?: number
  xp?: number
  pendingTasksCount?: number
  balance?: number
}

/**
 * Builds system prompt with HabitSpace application context.
 */
function buildSystemInstruction(context?: GeminiContext): string {
  const parts: string[] = [
    'Ты — персональный AI-коуч и ассистент HabitSpace, работающий на модели Gemini 3.5 Flash-Lite.',
    'Твоя задача — помогать пользователю развивать дисциплину, внедрять полезные привычки, управлять задачами и личными финансами.',
    'Правила ответов:',
    '1. Отвечай кратко, ёмко, структурированно, дружелюбно и на русском языке.',
    '2. Используй эмодзи для акцентов и списки для лёгкого чтения.',
    '3. Не пиши гигантские «стены текста» — давай конкретные, применимые советы (1-3 пункта).',
    '4. Если пользователь использует теги интеграций:',
    '   - @yt — порекомендуй конкретное направление видеоролика или тренировки с тегом @yt.',
    '   - @google — кратко опиши научный факт или исследование с тегом @google.',
    '   - @notion — предложи структуру чек-листа или трекера с тегом @notion.',
    '   - @habits, @tasks, @finance — ссылайся на контекст приложения.',
  ]

  if (context) {
    parts.push('\nТекущий контекст пользователя:')
    if (typeof context.habitsCount === 'number') parts.push(`- Активных привычек: ${context.habitsCount}`)
    if (typeof context.streakDays === 'number') parts.push(`- Стрик дней без пропусков: ${context.streakDays} дн.`)
    if (typeof context.level === 'number') parts.push(`- Уровень в приложении: ${context.level} (XP: ${context.xp || 0})`)
    if (typeof context.pendingTasksCount === 'number') parts.push(`- Незавершённых задач: ${context.pendingTasksCount}`)
    if (typeof context.balance === 'number') parts.push(`- Баланс за месяц: ${context.balance} ₽`)
  }

  return parts.join('\n')
}

/**
 * Calls Google Gemini REST API with cascade fallback.
 */
export async function generateGeminiResponse(
  userPrompt: string,
  context?: GeminiContext,
  history?: { role: 'user' | 'model'; text: string }[]
): Promise<{ text: string; modelUsed: string }> {
  const systemInstruction = buildSystemInstruction(context)

  // Construct conversation contents (must start with 'user' role for Gemini API)
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

  if (history && history.length > 0) {
    const firstUserIdx = history.findIndex(m => m.role === 'user')
    const validHistory = firstUserIdx !== -1 ? history.slice(firstUserIdx).slice(-6) : []
    for (const msg of validHistory) {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })
    }
  }

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }],
  })

  let lastError: Error | null = null

  for (const model of MODEL_CASCADE) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          text: data.candidates[0].content.parts[0].text.trim(),
          modelUsed: model,
        }
      }

      if (response.status === 429) {
        lastError = new Error(`429: Лимит запросов бесплатного тарифа Gemini исчерпан. Пожалуйста, подождите 20 секунд.`)
      } else if (response.status === 403) {
        lastError = new Error(`403: Доступ заблокирован Google (в РФ требуется включить VPN).`)
      } else if (response.status === 503) {
        lastError = new Error(`503: Высокая нагрузка на сервера Google. Подождите 10-15 секунд.`)
      } else {
        const errMsg = data.error?.message || `HTTP ${response.status}`
        console.warn(`[Gemini API] Model ${model} returned: ${errMsg}`)
        lastError = new Error(errMsg)
      }
    } catch (err: unknown) {
      const netMsg = err instanceof Error ? err.message : String(err)
      console.warn(`[Gemini API] Network error on ${model}:`, netMsg)
      if (netMsg.includes('Failed to fetch') || netMsg.includes('Network') || netMsg.includes('load resource')) {
        lastError = new Error(`NET: Ошибка соединения с Google API. Включите VPN или проверьте сеть.`)
      } else {
        lastError = err instanceof Error ? err : new Error(String(err))
      }
    }
  }

  throw lastError || new Error('Google Gemini API временно недоступен. Проверьте VPN или повторите чуть позже.')
}
