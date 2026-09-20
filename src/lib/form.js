import { INITIAL_FORM } from '../config/fields.js'

/**
 * Ne conserve que les champs connus du schéma et de type texte.
 * Protège contre un fichier de sauvegarde corrompu ou d'une ancienne version.
 */
export function sanitizeForm(data, base = INITIAL_FORM) {
  const result = { ...base }
  if (!data || typeof data !== 'object') return result

  for (const key of Object.keys(base)) {
    const value = data[key]
    if (typeof value === 'string') result[key] = value
  }
  return result
}

/** Sérialise le formulaire pour l'export / la sauvegarde. */
export function serializeForm(form) {
  return JSON.stringify(form, null, 2)
}

/**
 * Désérialise une sauvegarde.
 * @throws {Error} `EMPTY_SAVE` si la chaîne est vide, `INVALID_JSON` si le JSON est invalide.
 */
export function parseForm(raw, base = INITIAL_FORM) {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new Error('EMPTY_SAVE')
  }
  try {
    return sanitizeForm(JSON.parse(raw), base)
  } catch {
    throw new Error('INVALID_JSON')
  }
}
