import { ru } from './ru'
import { en } from './en'
import { useHabitStore } from '@/context/HabitContext'

export const translations = { ru, en } as const
export type TranslationDict = typeof ru

/**
 * Хук для получения текущего языка и словаря переводов.
 * Автоматически реагирует на смену языка в настройках (`prefs.lang`).
 */
export function useTranslation() {
  const { prefs } = useHabitStore()
  const lang = (prefs?.lang === 'en' ? 'en' : 'ru') as 'ru' | 'en'
  const t = translations[lang] || translations.ru

  return {
    t,
    lang,
    isRu: lang === 'ru',
    isEn: lang === 'en'
  }
}

/**
 * Получение словаря переводов по коду языка вне хуков (для утилит/тестов).
 */
export function getTranslation(lang: 'ru' | 'en' = 'ru'): TranslationDict {
  return (translations[lang] || translations.ru) as TranslationDict
}

export { ru, en }
