import { useI18n } from '../i18n/index.js'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-10 text-center text-xs text-slate-500 print:hidden dark:text-slate-500">
      <p>{t('footer')}</p>
    </footer>
  )
}
