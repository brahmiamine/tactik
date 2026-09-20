import { useI18n } from '../../i18n/index.js'
import RadioField from './RadioField.jsx'
import SelectField from './SelectField.jsx'
import TextField from './TextField.jsx'

const COMPONENTS = {
  radio: RadioField,
  select: SelectField,
  text: TextField,
}

/**
 * Résout la traduction d'un champ du schéma puis délègue le rendu
 * au composant présentational correspondant (radio / select / text).
 */
export default function FieldRenderer({ field, value, onChange, onHelp }) {
  const { t } = useI18n()
  const Component = COMPONENTS[field.kind] ?? TextField

  const label = t(`fields.${field.name}.label`)
  const helpKey = `help.${field.name}`

  const options = (field.options ?? []).map((option) => ({
    value: option,
    label: t(`fields.${field.name}.options.${option}`),
  }))

  return (
    <Component
      name={field.name}
      label={label}
      placeholder={t(`fields.${field.name}.placeholder`)}
      options={options}
      value={value}
      onChange={onChange}
      help={t.has(helpKey)}
      onOpenHelp={() => onHelp({ title: label, content: t(helpKey) })}
      emptyOption={t('common.emptyOption')}
    />
  )
}
