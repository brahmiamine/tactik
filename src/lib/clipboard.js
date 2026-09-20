/** Copie un texte dans le presse-papiers. Renvoie `true` en cas de succès. */
export async function copyText(text) {
  try {
    if (!globalThis.navigator?.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
