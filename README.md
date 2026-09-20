# ⚽️ Grille d’analyse tactique

Formulaire d’analyse tactique football (mobile + web), avec mode sombre, aide pédagogique par champ, export JSON,
sauvegarde locale et impression.

Application **React + Vite + Tailwind CSS**, déployée automatiquement sur **GitHub Pages**.

## 🚀 Développement

```bash
npm install
npm run dev
```

## 🏗️ Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build en local
```

## 📦 Structure

```
├── index.html                 # point d'entrée Vite
├── vite.config.js             # base = /tactik/ pour GitHub Pages
├── src/
│   ├── main.jsx               # bootstrap React
│   ├── App.jsx                # écran principal + actions
│   ├── index.css              # Tailwind + styles d'impression
│   ├── data.js                # sections, champs et aide pédagogique
│   └── components/            # UI réutilisable
└── .github/workflows/deploy.yml
```

## 🌍 Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque `push` sur `main`.

1. Pousser le code sur la branche `main`.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Le site est publié sur `https://<utilisateur>.github.io/tactik/`.

> Si le dépôt change de nom, adapter le `base` dans `vite.config.js` (ou définir `VITE_BASE` au moment du build).
