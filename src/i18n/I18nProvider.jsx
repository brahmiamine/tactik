import { createContext, useContext, useMemo } from 'react'
import { DIRECTIONS } from '../config/constants.js'
import { FALLBACK_LANGUAGE, dictionaries } from './dictionaries.js'
import { createTranslator } from './translate.js'

const I18nContext = createContext(null)

export function I18nProvider({ language, children }) {
  const value = useMemo(() => {
    const t = createTranslator(dictionaries, language, FALLBACK_LANGUAGE)
    return {
      language,
      t,
      dir: DIRECTIONS[language] ?? 'ltr',
      isRtl: DIRECTIONS[language] === 'rtl',
    }
  }, [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n doit être utilisé à l’intérieur d’un <I18nProvider>.')
  }
  return context
}
