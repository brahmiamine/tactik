const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS = {
  outline: 'border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900',
  primary: 'bg-slate-900 text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-950',
}

const SIZES = {
  md: 'px-3 py-2',
  lg: 'px-4 py-2',
}

/** Bouton réutilisable : `variant` (outline | primary) et `size` (md | lg). */
export default function Button({
  variant = 'outline',
  size = 'md',
  icon,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button type={type} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
