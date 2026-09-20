const TONES = {
  surface: 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30',
  muted: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40',
}

const PADDINGS = {
  normal: 'p-4 sm:p-6',
  compact: 'p-4',
}

/** Conteneur arrondi bordé, décliné en plusieurs tons/espacements. */
export default function Card({ as: Tag = 'div', tone = 'surface', padding = 'normal', className = '', children, ...rest }) {
  return (
    <Tag className={`rounded-2xl border ${TONES[tone]} ${PADDINGS[padding]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
