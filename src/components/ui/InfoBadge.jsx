/** Pastille d'icône utilisée dans l'en-tête des sections. */
export default function InfoBadge({ icon }) {
  return (
    <span className="rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
      {icon}
    </span>
  )
}
