# ⚽️ Grille d’analyse tactique

Formulaire d’analyse tactique football (mobile + web), avec mode sombre, **bilingue français / arabe (RTL)**, aide
pédagogique par champ, export JSON, sauvegarde locale et impression.

Application **React + Vite + Tailwind CSS**, testée avec **Vitest** et déployée automatiquement sur **GitHub Pages**.

## 🚀 Scripts

```bash
npm install
npm run dev        # serveur de développement
npm run build      # build de production (dist/)
npm run preview    # prévisualisation du build
npm test           # suite de tests (Vitest, 40 tests)
npm run test:watch # tests en continu
```

## 🧱 Architecture

Le code est découpé en petites unités : la logique métier est **pure et testable**, les composants restent
**présentationnels**.

```
src/
├── config/                 # configuration statique
│   ├── constants.js        #   clés localStorage, langues, direction
│   └── fields.js           #   schéma du formulaire (sans texte)
│
├── lib/                    # logique pure, sans React
│   ├── storage.js          #   accès localStorage tolérant aux erreurs
│   ├── form.js             #   (dé)sérialisation + nettoyage des sauvegardes
│   └── clipboard.js        #   copie presse-papiers
│
├── i18n/                   # internationalisation
│   ├── translate.js        #   résolution de clés, repli, collecte des clés
│   ├── dictionaries.js     #   registre des dictionnaires
│   ├── I18nProvider.jsx    #   contexte React + hook `useI18n`
│   └── locales/
│       ├── fr.js
│       └── ar.js
│
├── hooks/                  # état réutilisable, un hook = une responsabilité
│   ├── useLocalStorage.js
│   ├── useTheme.js
│   ├── useLanguage.js
│   ├── useModal.js
│   ├── useStatusMessage.js
│   └── useTacticalForm.js
│
├── components/
│   ├── ui/                 # primitives réutilisables (Button, Card, Modal, Toast…)
│   ├── fields/             # champs présentationnels (Radio, Text, Select) + FieldRenderer
│   ├── form/               # TacticalForm, SectionCard
│   └── Header.jsx, TipBanner.jsx, FormActions.jsx, Footer.jsx
│
├── App.jsx                 # orchestration uniquement
└── main.jsx                # bootstrap React
```

### Principes

- **Rien de métier dans les composants** : ils reçoivent des libellés déjà traduits et remontent des événements.
- **Un champ = un identifiant stable** (`block`, `pressZone`…) : les traductions sont résolues via
  `fields.<name>.label`, `fields.<name>.options.<value>` et `help.<name>`.
- **Erreurs explicites** : `parseForm` lève `EMPTY_SAVE` / `INVALID_JSON`, l’UI décide du message à afficher.

## 🌍 i18n (français / arabe)

- Toute la copie vit dans `src/i18n/locales/`. Aucune chaîne en dur dans les composants.
- La langue est persistée dans `localStorage` (`tactical_language`) et applique automatiquement `lang` + `dir` sur
  `<html>` : l’arabe passe la page en **RTL**.
- Les clés manquantes replient sur le français, puis sur la clé elle-même.
- Un test vérifie que **les deux langues exposent exactement les mêmes clés**.

**Ajouter une langue** : créer `src/i18n/locales/<code>.js`, l’enregistrer dans `dictionaries.js` et ajouter sa
direction dans `config/constants.js`.

## 🧪 Tests

```bash
npm test
```

| Fichier | Ce qui est couvert |
| --- | --- |
| `i18n/translate.test.js` | résolution de clés, repli, `t.has` |
| `i18n/locales.test.js` | parité des langues, schéma entièrement traduit |
| `lib/storage.test.js` | stockage indisponible, JSON corrompu |
| `lib/form.test.js` | nettoyage/normalisation, erreurs de sauvegarde |
| `components/fields/RadioField.test.jsx` | rendu, sélection, événements |
| `App.test.jsx` | parcours complet : langue/RTL, thème, aide, save/load |

## 🌐 Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` lance les tests puis le build, et publie `dist/` à chaque `push` sur
`main`.

1. Pousser sur `main`.
2. **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Site publié sur `https://<utilisateur>.github.io/tactik/`.

> Si le dépôt change de nom, adapter `base` dans `vite.config.js` (ou définir la variable `VITE_BASE`).

## Assistant de décision en direct

Le module **Décision immédiate** pose des questions adaptées au problème : couloir gauche,
présence offensive, pressing ou contres. Il distingue les informations inconnues des réponses
négatives. Les recommandations comportent une justification, une consigne, un risque et un
critère de réévaluation. Les boutons Sauvegarder/Charger conservent également ces réponses,
et les anciennes sauvegardes restent lisibles.

L’export JSON (presse-papiers ou téléchargement) utilise `schemaVersion: 2` :
`observations`, `analysis.candidates`, `analysis.decision`, `analysis.source`, `analysis.model`,
`language` et `exportedAt`. La sauvegarde interne conserve son format historique.
Toute modification des observations invalide la sélection IA précédente.

### IA locale facultative

- Moteur : [WebLLM](https://webllm.mlc.ai/docs/), chargé à la demande dans un Web Worker.
- Modèle : `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` (modèle existant, pas entraîné sur des matchs).
- Le bouton IA est actif lorsque plusieurs propositions sont admissibles. Le modèle choisit
  une priorité parmi ces propositions ; il ne génère pas librement des remplacements ou des consignes.
- La sortie JSON est contrainte et validée : seul un identifiant de décision admissible est accepté.
- WebGPU et une mémoire suffisante sont nécessaires. Le premier chargement télécharge les poids
  depuis l’hébergement du modèle et les ressources du moteur ; le cache navigateur accélère les suivants.
  Aucun appel à une API d’inférence distante, aucune transmission des observations à un serveur IA.
- Aucun téléchargement de poids automatique. Annulation, délai maximal de trois minutes et
  retour aux règles si le GPU, le chargement ou la sortie IA ne fonctionnent pas.
- Le site complet n’est pas une PWA hors ligne : le cache du modèle ne garantit pas que la page
  puisse être rouverte sans réseau.

### Périmètre de cette première version

Les règles sont des hypothèses tactiques explicites pour le 11 contre 11. Elles s’abstiennent
si une information nécessaire manque, si le problème n’est pas répété ou si une correction a
été tentée et demande une réévaluation. Les expulsions nécessitent une analyse spécifique.
Les changements supposent que l’utilisateur confirme la disponibilité et l’adéquation du
remplaçant, ainsi que l’autorisation de changer maintenant. Il n’y a pas encore de gestion complète
d’effectif, de chronologie des matchs ou d’analyse vidéo.

Le petit modèle local n’a pas été évalué comme un entraîneur expert. La pertinence et la latence
sur les appareils cibles doivent être mesurées avant de dépendre de ses choix pendant un match.

### Vérification

```bash
npm ci
npm test
npm run build
```

Les tests couvrent notamment les conditions des remplacements, le passage à deux attaquants,
les données manquantes, les résultats IA invalides ou périmés et l’indisponibilité de WebGPU.
Ils simulent l’inférence : une validation manuelle sur un navigateur avec un GPU compatible reste
nécessaire pour mesurer le téléchargement et l’exécution réelle du modèle.
