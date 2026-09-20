export function HelpButton({ label, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(label)}
      aria-label={`Aide : ${label}`}
      title={`Aide : ${label}`}
      className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
    >
      ⓘ
    </button>
  )
}
