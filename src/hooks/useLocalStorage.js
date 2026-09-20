import { useEffect, useState } from 'react'
import { readJson, writeJson } from '../lib/storage.js'

/**
 * État synchronisé avec `localStorage` (sérialisé en JSON).
 * Robuste : si le stockage est indisponible, l'état reste purement en mémoire.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJson(key, initialValue))

  useEffect(() => {
    writeJson(key, value)
  }, [key, value])

  return [value, setValue]
}
