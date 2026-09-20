export default function Section({ title, subtitle, icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900/30 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
        <span className="rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {icon}
        </span>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
