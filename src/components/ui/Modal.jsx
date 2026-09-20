import { useEffect } from 'react'
import Button from './Button.jsx'

/** Modale accessible : fermeture par Échap, clic sur le fond ou bouton. */
export default function Modal({ title, content, onClose, closeLabel = 'Fermer' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="modalTitle" className="text-lg font-semibold">
          {title}
        </h3>
        <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{content}</p>
        <div className="mt-4 text-end">
          <Button variant="primary" size="lg" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
