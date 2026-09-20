import ar from './locales/ar.js'
import fr from './locales/fr.js'

/** Dictionnaires disponibles, indexés par code langue. */
export const dictionaries = { fr, ar }

/** Langue de repli si une clé manque dans la langue active. */
export const FALLBACK_LANGUAGE = 'fr'
