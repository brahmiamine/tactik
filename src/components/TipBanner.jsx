import { useI18n } from '../i18n/index.js'
import Card from './ui/Card.jsx'

/** Bandeau « Conseil d'utilisation ». */
export default function TipBanner() {
  const { t } = useI18n()

  return (
    <Card
      tone="muted"
      padding="compact"
      className="mb-6 text-sm text-slate-700 print:hidden dark:text-slate-200"
    >
      <p className="font-medium">{t('tips.title')}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{t('tips.text')}</p>
    </Card>
  )
}
