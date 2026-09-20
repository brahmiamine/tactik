import { useCallback, useState } from 'react'

/** État d'ouverture d'une modale, avec un contenu libre `{ title, content }`. */
export function useModal() {
  const [modal, setModal] = useState(null)

  const openModal = useCallback((next) => setModal(next), [])
  const closeModal = useCallback(() => setModal(null), [])

  return { modal, openModal, closeModal, isOpen: modal !== null }
}
