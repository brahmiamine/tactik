import { COACH_INITIAL } from '../coach/questions.js'

/**
 * Schéma du formulaire d'analyse tactique.
 *
 * Volontairement sans texte : uniquement des identifiants stables.
 * Les libellés, placeholders et options sont résolus via i18n
 * (`fields.<name>.label`, `fields.<name>.placeholder`, `fields.<name>.options.<value>`).
 *
 * kind: 'text' | 'select' | 'radio'
 */

const OUI_NON = ['oui', 'non']
const DISTANCES = ['courte', 'moyenne', 'longue']

export const SECTIONS = [
  {
    id: 'general',
    icon: '📋',
    fields: [
      { kind: 'text', name: 'match' },
      { kind: 'select', name: 'minute', options: ['15', 'MT', '70', 'autre'] },
      { kind: 'text', name: 'team' },
      { kind: 'text', name: 'opponent' },
      { kind: 'text', name: 'systemAnnounced' },
      { kind: 'text', name: 'systemNoBall' },
    ],
  },
  {
    id: 'placement',
    icon: '🛡️',
    fields: [
      { kind: 'radio', name: 'block', options: ['haut', 'median', 'bas'] },
      { kind: 'text', name: 'shapeNoBall' },
      { kind: 'radio', name: 'distDM', options: DISTANCES },
      { kind: 'radio', name: 'distMA', options: DISTANCES },
      { kind: 'radio', name: 'compactH', options: ['bonne', 'moyenne', 'mauvaise'] },
    ],
  },
  {
    id: 'pressing',
    icon: '🔥',
    fields: [
      { kind: 'radio', name: 'pressZone', options: ['haut', 'ligne-mediane', 'bas'] },
      { kind: 'text', name: 'pressTrigger' },
      { kind: 'radio', name: 'pressCoord', options: OUI_NON },
      { kind: 'radio', name: 'backLineFollows', options: OUI_NON },
    ],
  },
  {
    id: 'transition',
    icon: '⚡',
    fields: [
      { kind: 'radio', name: 'firstChoice', options: ['passe-securisee', 'projection', 'degagement'] },
      { kind: 'radio', name: 'supportCarrier', options: OUI_NON },
      { kind: 'radio', name: 'runs', options: ['axial', 'couloirs', 'aucun'] },
      { kind: 'radio', name: 'clearIntent', options: OUI_NON },
    ],
  },
  {
    id: 'offensive',
    icon: '🎯',
    fields: [
      { kind: 'radio', name: 'attackZone', options: ['gauche', 'droite', 'axe'] },
      { kind: 'radio', name: 'actionsType', options: ['centres', 'combine', 'long-ballon'] },
      { kind: 'radio', name: 'repeatPatterns', options: OUI_NON },
      { kind: 'radio', name: 'boxPresence', options: ['bonne', 'faible'] },
    ],
  },
]

/** Noms de tous les champs, dans l'ordre d'affichage. */
export const FIELD_NAMES = SECTIONS.flatMap((section) => section.fields.map((field) => field.name))

/** État initial : tous les champs vides. */
export const INITIAL_FORM = { ...Object.fromEntries(FIELD_NAMES.map((name) => [name, ''])), ...COACH_INITIAL }
