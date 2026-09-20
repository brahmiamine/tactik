/**
 * Données de la grille d'analyse tactique.
 * Chaque section décrit les champs affichés dans le formulaire.
 *
 * kind: 'text'   -> { name, label, placeholder, help? }
 *       'select' -> { name, label, options: [{ value, label }] }
 *       'radio'  -> { name, label, options: [{ value, label }], help? }
 */

export const STORAGE_KEY = 'tactical_grid_v1'
export const THEME_KEY = 'tactical_theme'

const OUI_NON = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
]

const DISTANCES = [
  { value: 'courte', label: 'Courte' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'longue', label: 'Longue' },
]

export const SECTIONS = [
  {
    id: 'general',
    title: 'Informations générales',
    subtitle: 'Contexte du match et système.',
    icon: '📋',
    fields: [
      { kind: 'text', name: 'match', label: 'Match', placeholder: 'Ex: U15 – J5' },
      {
        kind: 'select',
        name: 'minute',
        label: 'Minute d’observation',
        options: [
          { value: '15', label: '15’' },
          { value: 'MT', label: 'Mi-temps' },
          { value: '70', label: '70’' },
          { value: 'autre', label: 'Autre' },
        ],
      },
      { kind: 'text', name: 'team', label: 'Équipe observée', placeholder: 'Ton équipe' },
      { kind: 'text', name: 'opponent', label: 'Adversaire', placeholder: 'Adversaire' },
      { kind: 'text', name: 'systemAnnounced', label: 'Système annoncé', placeholder: 'Ex: 4-3-3' },
      { kind: 'text', name: 'systemNoBall', label: 'Système réel sans ballon', placeholder: 'Ex: 4-4-2' },
    ],
  },
  {
    id: 'placement',
    title: '1) Placement sans ballon',
    subtitle: 'Bloc, forme, compacité.',
    icon: '🛡️',
    fields: [
      {
        kind: 'radio',
        name: 'block',
        label: 'Bloc défensif',
        options: [
          { value: 'haut', label: 'Haut' },
          { value: 'median', label: 'Médian' },
          { value: 'bas', label: 'Bas' },
        ],
      },
      { kind: 'text', name: 'shapeNoBall', label: 'Forme sans ballon', placeholder: 'Ex: 4-4-2, 5-4-1…' },
      { kind: 'radio', name: 'distDM', label: 'Distance défense ↔ milieu', options: DISTANCES },
      { kind: 'radio', name: 'distMA', label: 'Distance milieu ↔ attaque', options: DISTANCES },
      {
        kind: 'radio',
        name: 'compactH',
        label: 'Compacité horizontale',
        options: [
          { value: 'bonne', label: 'Bonne' },
          { value: 'moyenne', label: 'Moyenne' },
          { value: 'mauvaise', label: 'Mauvaise' },
        ],
      },
    ],
  },
  {
    id: 'pressing',
    title: '2) Pressing',
    subtitle: 'Déclenchement, coordination, ligne qui suit.',
    icon: '🔥',
    fields: [
      {
        kind: 'radio',
        name: 'pressZone',
        label: 'Zone de déclenchement',
        options: [
          { value: 'haut', label: 'Haut' },
          { value: 'ligne-mediane', label: 'Ligne médiane' },
          { value: 'bas', label: 'Bas' },
        ],
      },
      { kind: 'text', name: 'pressTrigger', label: 'Joueur qui déclenche', placeholder: 'Ex: #9, ailier gauche, #10…' },
      { kind: 'radio', name: 'pressCoord', label: 'Pressing coordonné', options: OUI_NON },
      { kind: 'radio', name: 'backLineFollows', label: 'La ligne défensive suit', options: OUI_NON },
    ],
  },
  {
    id: 'transition',
    title: '3) Transition offensive (après récupération)',
    subtitle: 'Premier choix, soutien, appels.',
    icon: '⚡',
    fields: [
      {
        kind: 'radio',
        name: 'firstChoice',
        label: 'Premier choix',
        options: [
          { value: 'passe-securisee', label: 'Passe sécurisée' },
          { value: 'projection', label: 'Projection rapide' },
          { value: 'degagement', label: 'Dégagement' },
        ],
      },
      { kind: 'radio', name: 'supportCarrier', label: 'Soutien autour du porteur', options: OUI_NON },
      {
        kind: 'radio',
        name: 'runs',
        label: 'Appels offensifs',
        options: [
          { value: 'axial', label: 'Axial' },
          { value: 'couloirs', label: 'Couloirs' },
          { value: 'aucun', label: 'Aucun' },
        ],
      },
      { kind: 'radio', name: 'clearIntent', label: 'Intention claire', options: OUI_NON },
    ],
  },
  {
    id: 'offensive',
    title: '4) Organisation offensive',
    subtitle: 'Zone dominante, type d’actions, présence surface.',
    icon: '🎯',
    fields: [
      {
        kind: 'radio',
        name: 'attackZone',
        label: 'Zone d’attaque dominante',
        options: [
          { value: 'gauche', label: 'Gauche' },
          { value: 'droite', label: 'Droite' },
          { value: 'axe', label: 'Axe' },
        ],
      },
      {
        kind: 'radio',
        name: 'actionsType',
        label: 'Type d’actions',
        options: [
          { value: 'centres', label: 'Centres' },
          { value: 'combine', label: 'Jeu combiné' },
          { value: 'long-ballon', label: 'Long ballon' },
        ],
      },
      { kind: 'radio', name: 'repeatPatterns', label: 'Répétition des schémas', options: OUI_NON },
      {
        kind: 'radio',
        name: 'boxPresence',
        label: 'Présence dans la surface',
        options: [
          { value: 'bonne', label: 'Bonne' },
          { value: 'faible', label: 'Faible' },
        ],
      },
    ],
  },
]

/** Valeurs initiales : tous les champs vides. */
export const INITIAL_FORM = Object.fromEntries(
  SECTIONS.flatMap((section) => section.fields.map((field) => [field.name, ''])),
)

/** Aide pédagogique affichée dans la modale (par libellé de champ). */
export const FIELD_HELP = {
  'Bloc défensif': `DÉFINITION
Position globale de l’équipe par rapport à son but quand elle n’a pas le ballon.

COMMENT DÉTECTER
Observe la ligne défensive quand l’adversaire construit.

ASTUCE MATCH
Regarde où se situe la défense par rapport à la ligne médiane.

EXEMPLE
Défense proche de la ligne médiane = bloc haut. Défense dans les 30m = bloc bas.`,

  'Forme sans ballon': `DÉFINITION
Organisation réelle de l’équipe sans le ballon.

COMMENT DÉTECTER
Compte les lignes horizontales (défense, milieu, attaque).

ASTUCE MATCH
Ignore la compo annoncée, regarde le placement réel.

EXEMPLE
4 joueurs au milieu et 2 devant = 4-4-2 sans ballon.`,

  'Distance défense ↔ milieu': `DÉFINITION
Espace vertical entre la ligne défensive et le milieu.

COMMENT DÉTECTER
Observe si un milieu doit sprinter pour défendre.

ASTUCE MATCH
Plus de 2 passes possibles dans l’intervalle = distance longue.

EXEMPLE
Un 10 adverse reçoit librement entre les lignes = distance trop longue.`,

  'Distance milieu ↔ attaque': `DÉFINITION
Espace entre milieux et attaquants.

COMMENT DÉTECTER
Regarde si l’attaquant est isolé.

ASTUCE MATCH
Un 9 seul = distance longue.

EXEMPLE
Le 9 reçoit dos au but sans soutien = problème de distance.`,

  'Compacité horizontale': `DÉFINITION
Largeur occupée par l’équipe sans ballon.

COMMENT DÉTECTER
Observe si l’adversaire change de côté facilement.

ASTUCE MATCH
Si les couloirs sont ouverts = compacité mauvaise.

EXEMPLE
Renversement gauche-droite sans opposition = équipe trop étirée.`,

  'Zone de déclenchement': `DÉFINITION
Zone du terrain où l’équipe commence à presser.

COMMENT DÉTECTER
Observe à quel moment les joueurs sortent sur le porteur.

ASTUCE MATCH
Si le pressing démarre dès la relance = haut.

EXEMPLE
Les attaquants pressent le gardien = pressing haut.`,

  'Pressing coordonné': `DÉFINITION
Pressing collectif avec déplacements synchronisés.

COMMENT DÉTECTER
Un joueur presse, les autres suivent immédiatement.

ASTUCE MATCH
Un pressing seul = pressing inefficace.

EXEMPLE
Le 9 presse mais les ailiers restent passifs = non coordonné.`,

  'La ligne défensive suit': `DÉFINITION
Capacité de la défense à monter avec le pressing.

COMMENT DÉTECTER
Observe si les défenseurs avancent quand on presse.

ASTUCE MATCH
Pressing sans ligne haute = danger.

EXEMPLE
Pressing des attaquants, défense basse = équipe coupée.`,

  'Premier choix': `DÉFINITION
Première décision après récupération du ballon.

COMMENT DÉTECTER
Observe le premier geste du récupérateur.

ASTUCE MATCH
Le premier choix révèle l’intention de jeu.

EXEMPLE
Passe arrière immédiate = sécurisation.`,

  'Soutien autour du porteur': `DÉFINITION
Présence de solutions proches après récupération.

COMMENT DÉTECTER
Compte les options à 5–10 mètres.

ASTUCE MATCH
Un porteur seul = problème tactique.

EXEMPLE
Le récupérateur est encerclé sans soutien = perte rapide.`,

  'Appels offensifs': `DÉFINITION
Déplacements des joueurs après récupération.

COMMENT DÉTECTER
Regarde la direction des courses.

ASTUCE MATCH
Appels répétés = intention claire.

EXEMPLE
Courses systématiques sur les côtés = jeu de largeur.`,

  'Intention claire': `DÉFINITION
Lisibilité du plan offensif après récupération.

COMMENT DÉTECTER
Pose-toi la question : sais-tu ce qu’ils veulent faire ?

ASTUCE MATCH
Si tu hésites, l’équipe hésite aussi.

EXEMPLE
Une fois long, une fois court = pas d’intention.`,

  'Zone d’attaque dominante': `DÉFINITION
Zone du terrain la plus utilisée pour attaquer.

COMMENT DÉTECTER
Observe d’où viennent la majorité des attaques.

ASTUCE MATCH
70 % d’un côté = zone dominante.

EXEMPLE
Toutes les attaques passent à droite = côté droit dominant.`,

  'Type d’actions': `DÉFINITION
Manière de créer des occasions.

COMMENT DÉTECTER
Observe la répétition des actions.

ASTUCE MATCH
La répétition définit le style.

EXEMPLE
Centres répétés = jeu direct.`,

  'Répétition des schémas': `DÉFINITION
Présence de circuits offensifs travaillés.

COMMENT DÉTECTER
Regarde si la même action revient.

ASTUCE MATCH
Répétition = travail tactique.

EXEMPLE
Même combinaison côté droit = schéma répété.`,

  'Présence dans la surface': `DÉFINITION
Nombre de joueurs attaquant la zone de finition.

COMMENT DÉTECTER
Compte les joueurs dans la surface au centre.

ASTUCE MATCH
Moins de 2 joueurs = présence faible.

EXEMPLE
Un seul attaquant dans la surface = danger limité.`,
}

/** Contenu de repli si un champ n’a pas d’aide dédiée. */
export function fallbackHelp(title) {
  return `Définition et astuce terrain pour ${title}.

Définition : indicateur tactique observé sans ballon ou avec ballon selon la phase.
Astuce match : observe les comportements répétés sur au moins 3 séquences, pas une action isolée.`
}
