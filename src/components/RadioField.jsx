import { HelpButton } from './HelpButton.jsx'

export default function RadioField({ name, label, options, value, onChange, help, onHelp }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <legend className="flex items-center gap-2 px-2 text-sm font-medium">
        <span>{label}</span>
        {help && <HelpButton label={label} onOpen={onHelp} />}
      </legend>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(name, option.value)}
              className="h-4 w-4"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
