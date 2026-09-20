import { useCallback, useEffect, useRef, useState } from 'react'
import { FIELD_HELP, INITIAL_FORM, SECTIONS, STORAGE_KEY, THEME_KEY, fallbackHelp } from './data.js'
import FieldRenderer from './components/FieldRenderer.jsx'
import Modal from './components/Modal.jsx'
import Section from './components/Section.jsx'
import StatusToast from './components/StatusToast.jsx'

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [form, setForm] = useState(INITIAL_FORM)
  const [modal, setModal] = useState(null)
  const [status, setStatus] = useState('')
  const statusTimer = useRef(null)

  /* Thème : applique la classe sur <html> et le bouton 🌙 / ☀️ */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  /* Nettoyage du timer du bandeau de statut */
  useEffect(() => () => window.clearTimeout(statusTimer.current), [])

  const notify = useCallback((message) => {
    setStatus(message)
    window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus(''), 2500)
  }, [])

  const setField = useCallback((name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }))
  }, [])

  const openHelp = useCallback((label) => {
    setModal({ title: label, content: FIELD_HELP[label] ?? fallbackHelp(label) })
  }, [])

  const handleClear = () => {
    setForm(INITIAL_FORM)
    notify('Formulaire vidé.')
  }

  const handlePrint = () => window.print()

  const handleExport = async () => {
    const json = JSON.stringify(form, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      notify('JSON copié dans le presse-papiers.')
    } catch {
      notify('Copie impossible : autorisation refusée.')
    }
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    notify('Sauvegardé (localStorage).')
  }

  const handleLoad = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return notify('Aucune sauvegarde trouvée.')
    try {
      const data = JSON.parse(raw)
      setForm({ ...INITIAL_FORM, ...data })
      notify('Chargé.')
    } catch {
      notify('Sauvegarde invalide.')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    notify('Validé ✅ (aucun envoi, juste confirmation).')
  }

  const isDark = theme === 'dark'

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur print:hidden dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-lg">⚽️</span>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight sm:text-lg">Grille d’analyse tactique</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Formulaire rapide (mobile + web) • Dark mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline">Mode</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <span aria-hidden="true">🧹</span>
              <span className="hidden sm:inline">Vider</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-950"
            >
              <span aria-hidden="true">🖨️</span>
              <span className="hidden sm:inline">Imprimer</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 print:hidden dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <p className="font-medium">Conseil d’utilisation</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Note des mots-clés, pas des paragraphes. Remplis à 15’, mi-temps, 70’. Une seule correction prioritaire.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2 print:hidden sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <span aria-hidden="true">📤</span> Export JSON
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <span aria-hidden="true">💾</span> Sauvegarder
            </button>
            <button
              type="button"
              onClick={handleLoad}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <span aria-hidden="true">📥</span> Charger
            </button>
          </div>

          {SECTIONS.map((section) => (
            <Section key={section.id} title={section.title} subtitle={section.subtitle} icon={section.icon}>
              {section.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={form[field.name] ?? ''}
                  onChange={setField}
                  onHelp={openHelp}
                  hasHelp={(label) => Boolean(FIELD_HELP[label])}
                />
              ))}
            </Section>
          ))}
        </form>

        <footer className="mt-10 text-center text-xs text-slate-500 print:hidden dark:text-slate-500">
          <p>
            © Grille d’analyse tactique • React + Vite + Tailwind • Données stockées localement (si tu utilises
            Sauvegarder).
          </p>
        </footer>
      </main>

      {modal && <Modal title={modal.title} content={modal.content} onClose={() => setModal(null)} />}
      <StatusToast message={status} />
    </>
  )
}
