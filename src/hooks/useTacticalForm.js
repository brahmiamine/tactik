import { useCallback, useState } from 'react'
import { STORAGE_KEY } from '../config/constants.js'
import { INITIAL_FORM } from '../config/fields.js'
import { parseForm, serializeForm } from '../lib/form.js'
import { readText, writeText } from '../lib/storage.js'

/**
 * État du formulaire tactique + persistance locale.
 * La logique pure (sérialisation, validation) vit dans `lib/form.js`.
 */
export function useTacticalForm({ storageKey = STORAGE_KEY, initialForm = INITIAL_FORM } = {}) {
  const [form, setForm] = useState(initialForm)

  const setField = useCallback((name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
  }, [])

  const reset = useCallback(() => setForm(initialForm), [initialForm])

  const toJson = useCallback(() => serializeForm(form), [form])

  /** @returns {boolean} `true` si l'écriture a réussi. */
  const save = useCallback(() => writeText(storageKey, serializeForm(form)), [form, storageKey])

  /**
   * Recharge le formulaire depuis `localStorage`.
   * @throws {Error} `EMPTY_SAVE` ou `INVALID_JSON`.
   */
  const load = useCallback(() => {
    const next = parseForm(readText(storageKey), initialForm)
    setForm(next)
    return next
  }, [initialForm, storageKey])

  return { form, setField, reset, toJson, save, load }
}
