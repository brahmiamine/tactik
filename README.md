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
