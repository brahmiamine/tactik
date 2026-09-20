import { describe, expect, it, vi } from 'vitest'
import { readJson, readText, writeJson, writeText } from './storage.js'

describe('storage', () => {
  it('écrit puis relit une chaîne', () => {
    expect(writeText('key', 'value')).toBe(true)
    expect(readText('key')).toBe('value')
  })

  it('renvoie le fallback quand la clé est absente', () => {
    expect(readText('missing', 'default')).toBe('default')
    expect(readJson('missing', { a: 1 })).toEqual({ a: 1 })
  })

  it('sérialise et désérialise en JSON', () => {
    writeJson('object', { a: 1, b: ['x'] })

    expect(readText('object')).toBe('{"a":1,"b":["x"]}')
    expect(readJson('object')).toEqual({ a: 1, b: ['x'] })
  })

  it('tolère un JSON corrompu', () => {
    writeText('broken', '{oops')

    expect(readJson('broken', null)).toBeNull()
  })

  it('ne plante pas si le stockage lève une erreur', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('access denied')
    })

    expect(writeText('key', 'value')).toBe(false)
    expect(readText('key', 'default')).toBe('default')
  })

  it('renvoie false si la valeur n’est pas sérialisable', () => {
    const circular = {}
    circular.self = circular

    expect(writeJson('circular', circular)).toBe(false)
  })
})
