// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini AI Client (Gemini 3.5 Flash-Lite)
// ─────────────────────────────────────────────────────────────────────────────

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite'

export interface ModelOption {
  id: string
  name: string
  badge: string
  description: string
  isFlagship?: boolean
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite',
    badge: 'Быстрая',
    description: 'Ультра-быстрые советы и микро-задачи',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: 'Флагман 3.8',
    description: 'Новейшая флагманская Flash-модель Google',
    isFlagship: true,
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    badge: 'Pro Анализ',
    description: 'Глубокий анализ дисциплины и сложных планов',
    isFlagship: true,
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B (Безотказная)',
    badge: 'Авто-резерв',
    description: 'Работает всегда, даже при перегрузке серверов Google',
  },
]

// Fallback cascade when a model encounters 503/429/404
const BASE_FALLBACK_CASCADE = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-pro-preview',
  'gemma-4-26b-a4b-it',
  'gemini-3.6-flash',
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
    '5. СТРОЖАЙШИЙ ЗАПРЕТ НА ВЫВОД МЫСЛЕЙ (NO CHAIN OF THOUGHT): Отвечай СРАЗУ готовым текстом для пользователя на русском. Категорически ЗАПРЕЩЕНО выводить внутренние черновики, системные промпты, шаги мышления, фразы вроде "User says:", "Role:", "Goal:", "Drafting", "Self-correction", "Constraints:". Только чистый, вежливый ответ.',
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
 * Strips model internal reasoning, thinking tokens, and self-correction leaks.
 */
export function cleanAiResponse(text: string): string {
  if (!text) return ''
  let cleaned = text.trim()

  // 1. If text contains explicit drafting marker, take everything after it
  const draftRegex = /(?:\*+Drafting final response:\*+|\*+Final response:\*+|\*+Response:\*+|\*+Actual response:\*+)([\s\S]+)/i
  const draftMatch = cleaned.match(draftRegex)
  if (draftMatch && draftMatch[1] && draftMatch[1].trim()) {
    cleaned = draftMatch[1].trim()
  }

  // 2. Remove parenthetical model inner monologues like (Wait, the previous...)
  cleaned = cleaned.replace(/^\s*\((?:Wait|Note|Self-correction|Thinking)[\s\S]*?\)\s*$/gmi, '')

  // 3. If response starts with English meta reasoning bullets (* User, * Role, * Goal, * Current context, etc.),
  // find where the real Russian/conversational response actually starts
  if (cleaned.startsWith('*') || cleaned.startsWith('-') || cleaned.startsWith('(')) {
    const conversationalStartRegex = /(?:\n\s*(?:Привет|Здравствуйте|Рад |Давай |Отличн|Вот |Как |Твой |Приветствую|Добр)[\s\S]*)/i
    const convMatch = cleaned.match(conversationalStartRegex)
    if (convMatch && convMatch[0]) {
      cleaned = convMatch[0].trim()
    }
  }

  // 4. Remove any residual meta bullets (*Greeting:*, *Status Summary:*, *Engagement:*, etc.)
  cleaned = cleaned.replace(/^\s*\*\s*\*(?:Greeting|Status Summary|Engagement|Call to action|Status Check):\*\s*/gmi, '')

  // 5. Clean up trailing meta verification check marks like * Brief? Yes. * Structured? Yes.
  cleaned = cleaned.replace(/\n\s*\*\s*(?:Brief\?|Structured\?|Friendly\?|Russian\?|Tags used correctly\?)[\s\S]*$/gi, '')

  return cleaned.trim()
}

/**
 * Calls Google Gemini REST API with cascade fallback.
 */
export async function generateGeminiResponse(
  userPrompt: string,
  context?: GeminiContext,
  history?: { role: 'user' | 'model'; text: string }[],
  preferredModel?: string,
  customSystemInstruction?: string
): Promise<{ text: string; modelUsed: string; fallbackOccurred?: boolean }> {
  const systemInstruction = customSystemInstruction || buildSystemInstruction(context)

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

  // Start with preferred model, then follow with other fallback models in cascade
  const modelsToTry: string[] = []
  if (preferredModel) {
    modelsToTry.push(preferredModel)
  }
  for (const m of BASE_FALLBACK_CASCADE) {
    if (!modelsToTry.includes(m)) {
      modelsToTry.push(m)
    }
  }

  let lastError: Error | null = null

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i]
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
            maxOutputTokens: 2048,
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.candidates && data.candidates[0]?.content?.parts) {
        const parts = data.candidates[0].content.parts
        const answerPart = parts.find((p: { thought?: boolean; text?: string }) => !p.thought && p.text)
        const rawText = answerPart?.text || (parts.length > 0 ? parts[parts.length - 1]?.text : '') || ''
        const cleanedText = cleanAiResponse(rawText)

        if (cleanedText) {
          return {
            text: cleanedText,
            modelUsed: model,
            fallbackOccurred: preferredModel ? model !== preferredModel : i > 0,
          }
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
