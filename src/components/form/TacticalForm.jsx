import { SECTIONS } from '../../config/fields.js'
import { useI18n } from '../../i18n/index.js'
import FieldRenderer from '../fields/FieldRenderer.jsx'
import SectionCard from './SectionCard.jsx'

/** Formulaire complet : itère sur le schéma `SECTIONS`. */
export default function TacticalForm({ form, onChange, onHelp, onSubmit, actions }) {
  const { t } = useI18n()

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {actions}

      {SECTIONS.map((section) => (
        <SectionCard
          key={section.id}
          title={t(`sections.${section.id}.title`)}
          subtitle={t(`sections.${section.id}.subtitle`)}
          icon={section.icon}
        >
          {section.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={form[field.name] ?? ''}
              onChange={onChange}
              onHelp={onHelp}
            />
          ))}
        </SectionCard>
      ))}
    </form>
  )
}
