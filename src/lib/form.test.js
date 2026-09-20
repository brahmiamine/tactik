import { describe, expect, it } from 'vitest'
import { INITIAL_FORM } from '../config/fields.js'
import { parseForm, sanitizeForm, serializeForm } from './form.js'

describe('sanitizeForm', () => {
  it('part toujours d’un formulaire complet', () => {
    expect(Object.keys(sanitizeForm({})).sort()).toEqual(Object.keys(INITIAL_FORM).sort())
  })

  it('ignore les clés inconnues et les valeurs non textuelles', () => {
    const result = sanitizeForm({ match: 'U15 – J5', inconnu: 'x', minute: 42 })

    expect(result.match).toBe('U15 – J5')
    expect(result.minute).toBe('')
    expect(result).not.toHaveProperty('inconnu')
  })

  it('tolère une entrée non-objet', () => {
    expect(sanitizeForm(null)).toEqual(INITIAL_FORM)
    expect(sanitizeForm('oops')).toEqual(INITIAL_FORM)
  })
})

describe('serializeForm et parseForm', () => {
  it('font un aller-retour fidèle', () => {
    const form = { ...INITIAL_FORM, match: 'U15 – J5', block: 'haut' }

    expect(parseForm(serializeForm(form))).toEqual(form)
  })

  it('rejette une sauvegarde absente ou vide', () => {
    expect(() => parseForm('')).toThrow('EMPTY_SAVE')
    expect(() => parseForm('   ')).toThrow('EMPTY_SAVE')
    expect(() => parseForm(null)).toThrow('EMPTY_SAVE')
  })

  it('rejette un JSON invalide', () => {
    expect(() => parseForm('{oops')).toThrow('INVALID_JSON')
  })

  it('nettoie une sauvegarde partielle d’une ancienne version', () => {
    const result = parseForm('{"match":"U15","legacy":true}')

    expect(result.match).toBe('U15')
    expect(result).not.toHaveProperty('legacy')
    expect(result.block).toBe('')
  })
})
