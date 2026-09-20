export default {
  meta: {
    title: 'Grille d’analyse tactique – Formulaire',
    description: 'Grille d’analyse tactique football : formulaire rapide mobile + web.',
  },
  app: {
    title: 'Grille d’analyse tactique',
    subtitle: 'Formulaire rapide (mobile + web) • Dark mode',
    theme: 'Mode',
    switchLanguage: 'العربية',
    languageLabel: 'Changer de langue',
    clear: 'Vider',
    print: 'Imprimer',
  },
  tips: {
    title: 'Conseil d’utilisation',
    text: 'Note des mots-clés, pas des paragraphes. Remplis à 15’, mi-temps, 70’. Une seule correction prioritaire.',
  },
  actions: {
    exportJson: 'Export JSON',
    save: 'Sauvegarder',
    load: 'Charger',
  },
  status: {
    cleared: 'Formulaire vidé.',
    copied: 'JSON copié dans le presse-papiers.',
    copyFailed: 'Copie impossible : autorisation refusée.',
    saved: 'Sauvegardé (localStorage).',
    saveFailed: 'Sauvegarde impossible (stockage indisponible).',
    noSave: 'Aucune sauvegarde trouvée.',
    loaded: 'Chargé.',
    invalidSave: 'Sauvegarde invalide.',
  },
  modal: {
    close: 'Fermer',
  },
  common: {
    emptyOption: '—',
  },
  footer:
    '© Grille d’analyse tactique • React + Vite + Tailwind • Données stockées localement (si tu utilises Sauvegarder).',
  sections: {
    general: {
      title: 'Informations générales',
      subtitle: 'Contexte du match et système.',
    },
    placement: {
      title: '1) Placement sans ballon',
      subtitle: 'Bloc, forme, compacité.',
    },
    pressing: {
      title: '2) Pressing',
      subtitle: 'Déclenchement, coordination, ligne qui suit.',
    },
    transition: {
      title: '3) Transition offensive (après récupération)',
      subtitle: 'Premier choix, soutien, appels.',
    },
    offensive: {
      title: '4) Organisation offensive',
      subtitle: 'Zone dominante, type d’actions, présence surface.',
    },
  },
  fields: {
    match: { label: 'Match', placeholder: 'Ex: U15 – J5' },
    minute: {
      label: 'Minute d’observation',
      options: { 15: '15’', MT: 'Mi-temps', 70: '70’', autre: 'Autre' },
    },
    team: { label: 'Équipe observée', placeholder: 'Ton équipe' },
    opponent: { label: 'Adversaire', placeholder: 'Adversaire' },
    systemAnnounced: { label: 'Système annoncé', placeholder: 'Ex: 4-3-3' },
    systemNoBall: { label: 'Système réel sans ballon', placeholder: 'Ex: 4-4-2' },

    block: {
      label: 'Bloc défensif',
      options: { haut: 'Haut', median: 'Médian', bas: 'Bas' },
    },
    shapeNoBall: { label: 'Forme sans ballon', placeholder: 'Ex: 4-4-2, 5-4-1…' },
    distDM: {
      label: 'Distance défense ↔ milieu',
      options: { courte: 'Courte', moyenne: 'Moyenne', longue: 'Longue' },
    },
    distMA: {
      label: 'Distance milieu ↔ attaque',
      options: { courte: 'Courte', moyenne: 'Moyenne', longue: 'Longue' },
    },
    compactH: {
      label: 'Compacité horizontale',
      options: { bonne: 'Bonne', moyenne: 'Moyenne', mauvaise: 'Mauvaise' },
    },

    pressZone: {
      label: 'Zone de déclenchement',
      options: { haut: 'Haut', 'ligne-mediane': 'Ligne médiane', bas: 'Bas' },
    },
    pressTrigger: { label: 'Joueur qui déclenche', placeholder: 'Ex: #9, ailier gauche, #10…' },
    pressCoord: { label: 'Pressing coordonné', options: { oui: 'Oui', non: 'Non' } },
    backLineFollows: { label: 'La ligne défensive suit', options: { oui: 'Oui', non: 'Non' } },

    firstChoice: {
      label: 'Premier choix',
      options: { 'passe-securisee': 'Passe sécurisée', projection: 'Projection rapide', degagement: 'Dégagement' },
    },
    supportCarrier: { label: 'Soutien autour du porteur', options: { oui: 'Oui', non: 'Non' } },
    runs: {
      label: 'Appels offensifs',
      options: { axial: 'Axial', couloirs: 'Couloirs', aucun: 'Aucun' },
    },
    clearIntent: { label: 'Intention claire', options: { oui: 'Oui', non: 'Non' } },

    attackZone: {
      label: 'Zone d’attaque dominante',
      options: { gauche: 'Gauche', droite: 'Droite', axe: 'Axe' },
    },
    actionsType: {
      label: 'Type d’actions',
      options: { centres: 'Centres', combine: 'Jeu combiné', 'long-ballon': 'Long ballon' },
    },
    repeatPatterns: { label: 'Répétition des schémas', options: { oui: 'Oui', non: 'Non' } },
    boxPresence: {
      label: 'Présence dans la surface',
      options: { bonne: 'Bonne', faible: 'Faible' },
    },
  },
  help: {
    block: `DÉFINITION
Position globale de l’équipe par rapport à son but quand elle n’a pas le ballon.

COMMENT DÉTECTER
Observe la ligne défensive quand l’adversaire construit.

ASTUCE MATCH
Regarde où se situe la défense par rapport à la ligne médiane.

EXEMPLE
Défense proche de la ligne médiane = bloc haut. Défense dans les 30m = bloc bas.`,

    shapeNoBall: `DÉFINITION
Organisation réelle de l’équipe sans le ballon.

COMMENT DÉTECTER
Compte les lignes horizontales (défense, milieu, attaque).

ASTUCE MATCH
Ignore la compo annoncée, regarde le placement réel.

EXEMPLE
4 joueurs au milieu et 2 devant = 4-4-2 sans ballon.`,

    distDM: `DÉFINITION
Espace vertical entre la ligne défensive et le milieu.

COMMENT DÉTECTER
Observe si un milieu doit sprinter pour défendre.

ASTUCE MATCH
Plus de 2 passes possibles dans l’intervalle = distance longue.

EXEMPLE
Un 10 adverse reçoit librement entre les lignes = distance trop longue.`,

    distMA: `DÉFINITION
Espace entre milieux et attaquants.

COMMENT DÉTECTER
Regarde si l’attaquant est isolé.

ASTUCE MATCH
Un 9 seul = distance longue.

EXEMPLE
Le 9 reçoit dos au but sans soutien = problème de distance.`,

    compactH: `DÉFINITION
Largeur occupée par l’équipe sans ballon.

COMMENT DÉTECTER
Observe si l’adversaire change de côté facilement.

ASTUCE MATCH
Si les couloirs sont ouverts = compacité mauvaise.

EXEMPLE
Renversement gauche-droite sans opposition = équipe trop étirée.`,

    pressZone: `DÉFINITION
Zone du terrain où l’équipe commence à presser.

COMMENT DÉTECTER
Observe à quel moment les joueurs sortent sur le porteur.

ASTUCE MATCH
Si le pressing démarre dès la relance = haut.

EXEMPLE
Les attaquants pressent le gardien = pressing haut.`,

    pressCoord: `DÉFINITION
Pressing collectif avec déplacements synchronisés.

COMMENT DÉTECTER
Un joueur presse, les autres suivent immédiatement.

ASTUCE MATCH
Un pressing seul = pressing inefficace.

EXEMPLE
Le 9 presse mais les ailiers restent passifs = non coordonné.`,

    backLineFollows: `DÉFINITION
Capacité de la défense à monter avec le pressing.

COMMENT DÉTECTER
Observe si les défenseurs avancent quand on presse.

ASTUCE MATCH
Pressing sans ligne haute = danger.

EXEMPLE
Pressing des attaquants, défense basse = équipe coupée.`,

    firstChoice: `DÉFINITION
Première décision après récupération du ballon.

COMMENT DÉTECTER
Observe le premier geste du récupérateur.

ASTUCE MATCH
Le premier choix révèle l’intention de jeu.

EXEMPLE
Passe arrière immédiate = sécurisation.`,

    supportCarrier: `DÉFINITION
Présence de solutions proches après récupération.

COMMENT DÉTECTER
Compte les options à 5–10 mètres.

ASTUCE MATCH
Un porteur seul = problème tactique.

EXEMPLE
Le récupérateur est encerclé sans soutien = perte rapide.`,

    runs: `DÉFINITION
Déplacements des joueurs après récupération.

COMMENT DÉTECTER
Regarde la direction des courses.

ASTUCE MATCH
Appels répétés = intention claire.

EXEMPLE
Courses systématiques sur les côtés = jeu de largeur.`,

    clearIntent: `DÉFINITION
Lisibilité du plan offensif après récupération.

COMMENT DÉTECTER
Pose-toi la question : sais-tu ce qu’ils veulent faire ?

ASTUCE MATCH
Si tu hésites, l’équipe hésite aussi.

EXEMPLE
Une fois long, une fois court = pas d’intention.`,

    attackZone: `DÉFINITION
Zone du terrain la plus utilisée pour attaquer.

COMMENT DÉTECTER
Observe d’où viennent la majorité des attaques.

ASTUCE MATCH
70 % d’un côté = zone dominante.

EXEMPLE
Toutes les attaques passent à droite = côté droit dominant.`,

    actionsType: `DÉFINITION
Manière de créer des occasions.

COMMENT DÉTECTER
Observe la répétition des actions.

ASTUCE MATCH
La répétition définit le style.

EXEMPLE
Centres répétés = jeu direct.`,

    repeatPatterns: `DÉFINITION
Présence de circuits offensifs travaillés.

COMMENT DÉTECTER
Regarde si la même action revient.

ASTUCE MATCH
Répétition = travail tactique.

EXEMPLE
Même combinaison côté droit = schéma répété.`,

    boxPresence: `DÉFINITION
Nombre de joueurs attaquant la zone de finition.

COMMENT DÉTECTER
Compte les joueurs dans la surface au centre.

ASTUCE MATCH
Moins de 2 joueurs = présence faible.

EXEMPLE
Un seul attaquant dans la surface = danger limité.`,
  },
}
