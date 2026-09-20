import { INITIAL_FORM } from '../config/fields.js'

/** Accès défensif à window.localStorage (indisponible en SSR / navigation privée). */
function safeStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

/** Lit une chaîne brute. Renvoie `fallback` si absente ou inaccessible. */
export function readText(key, fallback = null) {
  const storage = safeStorage()
  if (!storage) return fallback
  try {
    const value = storage.getItem(key)
    return value === null ? fallback : value
  } catch {
    return fallback
  }
}

/** Écrit une chaîne brute. Renvoie `true` si l'écriture a réussi. */
export function writeText(key, value) {
  const storage = safeStorage()
  if (!storage) return false
  try {
    storage.setItem(key, String(value))
    return true
  } catch {
    return false
  }
}

/** Lit et désérialise une valeur JSON. Renvoie `fallback` en cas d'absence/erreur. */
export function readJson(key, fallback = null) {
  const raw = readText(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** Sérialise puis écrit une valeur JSON. Renvoie `true` si l'écriture a réussi. */
export function writeJson(key, value) {
  try {
    return writeText(key, JSON.stringify(value))
  } catch {
    return false
  }
}
