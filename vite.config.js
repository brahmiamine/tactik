import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages sert le site depuis https://<user>.github.io/<repo>/
// le `base` doit donc correspondre au nom du dépôt.
// Surchageable via la variable d'environnement VITE_BASE si besoin.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/tactik/',
  plugins: [react(), tailwindcss()],
})
