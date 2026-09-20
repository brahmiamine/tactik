import { useCallback, useEffect, useRef, useState } from 'react'

/** Message éphémère (toast) affiché pendant `duration` millisecondes. */
export function useStatusMessage(duration = 2500) {
  const [message, setMessage] = useState('')
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const notify = useCallback(
    (next) => {
      window.clearTimeout(timer.current)
      setMessage(next)
      if (next) timer.current = window.setTimeout(() => setMessage(''), duration)
    },
    [duration],
  )

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current)
    setMessage('')
  }, [])

  return { message, notify, dismiss }
}
