export default function StatusToast({ message }) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 print:hidden"
    >
      <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
        {message}
      </div>
    </div>
  )
}
