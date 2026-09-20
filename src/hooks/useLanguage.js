import { useCallback, useEffect } from 'react'
import { DEFAULT_LANGUAGE, DIRECTIONS, LANGUAGE_KEY } from '../config/constants.js'
import { useLocalStorage } from './useLocalStorage.js'

/** Gère la langue active et les attributs `lang` / `dir` sur <html>. */
export function useLanguage(defaultLanguage = DEFAULT_LANGUAGE) {
  const [language, setLanguage] = useLocalStorage(LANGUAGE_KEY, defaultLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = DIRECTIONS[language] ?? 'ltr'
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'fr' ? 'ar' : 'fr'))
  }, [setLanguage])

  return {
    language,
    dir: DIRECTIONS[language] ?? 'ltr',
    isRtl: DIRECTIONS[language] === 'rtl',
    setLanguage,
    toggleLanguage,
  }
}
