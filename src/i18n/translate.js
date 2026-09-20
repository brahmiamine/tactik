/**
 * Coeur i18n : fonctions pures, sans React, donc directement testables.
 * Les traductions sont des objets imbriqués et les clés sont des chemins pointés
 * (`sections.general.title`).
 */

/** Résout un chemin pointé dans un objet. Renvoie `undefined` si introuvable. */
export function getValue(source, path) {
  if (!source) return undefined
  return String(path)
    .split('.')
    .reduce((current, key) => (current == null ? undefined : current[key]), source)
}

/** Indique si une traduction existe (et est bien une chaîne) pour une langue. */
export function hasTranslation(dictionaries, language, key) {
  return typeof getValue(dictionaries[language], key) === 'string'
}

/** Traduit une clé, avec repli sur la langue par défaut puis sur la clé elle-même. */
export function translate(dictionaries, language, key, fallbackLanguage = 'fr') {
  const value = getValue(dictionaries[language], key)
  if (typeof value === 'string') return value

  const fallback = getValue(dictionaries[fallbackLanguage], key)
  if (typeof fallback === 'string') return fallback

  return key
}

/** Construit une fonction `t` liée à une langue (et un testeur `t.has`). */
export function createTranslator(dictionaries, language, fallbackLanguage = 'fr') {
  const t = (key) => translate(dictionaries, language, key, fallbackLanguage)
  t.has = (key) => hasTranslation(dictionaries, language, key)
  t.language = language
  return t
}

/** Liste récursive de tous les chemins de clés d'un dictionnaire. */
export function collectKeyPaths(source, prefix = '') {
  if (!source || typeof source !== 'object') return []

  return Object.entries(source).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') return collectKeyPaths(value, path)
    return [path]
  })
}
