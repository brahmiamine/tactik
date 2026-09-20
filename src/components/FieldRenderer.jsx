import RadioField from './RadioField.jsx'
import SelectField from './SelectField.jsx'
import TextField from './TextField.jsx'

export default function FieldRenderer({ field, value, onChange, onHelp, hasHelp }) {
  const props = {
    name: field.name,
    label: field.label,
    options: field.options,
    placeholder: field.placeholder,
    value,
    onChange,
    help: hasHelp(field.label),
    onHelp,
  }

  switch (field.kind) {
    case 'radio':
      return <RadioField {...props} />
    case 'select':
      return <SelectField {...props} />
    default:
      return <TextField {...props} />
  }
}
