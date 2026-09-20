import { useI18n } from '../i18n/index.js'
import Button from './ui/Button.jsx'

/** Barre d'actions du formulaire : export JSON, sauvegarde, chargement. */
export default function FormActions({ onExport, onSave, onLoad }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-2 print:hidden sm:flex-row sm:justify-end">
      <Button size="lg" icon="📤" onClick={onExport}>
        {t('actions.exportJson')}
      </Button>
      <Button size="lg" icon="💾" onClick={onSave}>
        {t('actions.save')}
      </Button>
      <Button size="lg" icon="📥" onClick={onLoad}>
        {t('actions.load')}
      </Button>
    </div>
  )
}
