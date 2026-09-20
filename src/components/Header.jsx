import { useI18n } from '../i18n/index.js'
import Button from './ui/Button.jsx'

/** Barre supérieure : titre, sélecteur de langue, thème, vider, imprimer. */
export default function Header({ isDark, onToggleTheme, onToggleLanguage, onClear, onPrint }) {
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur print:hidden dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-lg">⚽️</span>
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight sm:text-lg">{t('app.title')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{t('app.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleLanguage}
            aria-label={t('app.languageLabel')}
            title={t('app.languageLabel')}
            data-testid="language-toggle"
          >
            <span aria-hidden="true">🌐</span>
            <span className="hidden sm:inline">{t('app.switchLanguage')}</span>
          </Button>

          <Button onClick={onToggleTheme} aria-label={t('app.theme')} title={t('app.theme')} data-testid="theme-toggle">
            <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline">{t('app.theme')}</span>
          </Button>

          <Button onClick={onClear} icon="🧹" aria-label={t('app.clear')} title={t('app.clear')}>
            <span className="hidden sm:inline">{t('app.clear')}</span>
          </Button>

          <Button
            variant="primary"
            onClick={onPrint}
            icon="🖨️"
            aria-label={t('app.print')}
            title={t('app.print')}
          >
            <span className="hidden sm:inline">{t('app.print')}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
