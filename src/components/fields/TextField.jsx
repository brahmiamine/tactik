import HelpButton from './HelpButton.jsx'

const INPUT_CLASS =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:ring-slate-700'

/** Champ texte avec libellé optionnellement accompagné d'une aide. */
export default function TextField({ name, label, placeholder, value = '', onChange, help, onOpenHelp }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium" htmlFor={name}>
        <span>{label}</span>
        {help && <HelpButton label={label} onOpen={onOpenHelp} />}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  )
}
