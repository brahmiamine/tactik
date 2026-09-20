import { HelpButton } from './HelpButton.jsx'

export default function SelectField({ name, label, options, value, onChange, help, onHelp }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium" htmlFor={name}>
        <span>{label}</span>
        {help && <HelpButton label={label} onOpen={onHelp} />}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:ring-slate-700"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
