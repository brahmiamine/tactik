import { useCallback, useEffect } from 'react'
import { DEFAULT_THEME, THEME_KEY } from '../config/constants.js'
import { useLocalStorage } from './useLocalStorage.js'

/** Gère le thème clair/sombre et la classe `.dark` sur <html>. */
export function useTheme(defaultTheme = DEFAULT_THEME) {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, defaultTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return { theme, isDark: theme === 'dark', setTheme, toggleTheme }
}
