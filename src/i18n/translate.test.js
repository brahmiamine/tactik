import { describe, expect, it } from 'vitest'
import { collectKeyPaths, createTranslator, getValue, hasTranslation, translate } from './translate.js'

const dictionaries = {
  fr: {
    app: { title: 'Titre', nested: { deep: 'Profond' } },
    fields: { minute: { options: { 15: '15’' } } },
  },
  ar: {
    app: { title: 'عنوان' },
  },
}

describe('getValue', () => {
  it('résout un chemin pointé', () => {
    expect(getValue(dictionaries.fr, 'app.nested.deep')).toBe('Profond')
  })

  it('gère les clés numériques (options de select)', () => {
    expect(getValue(dictionaries.fr, 'fields.minute.options.15')).toBe('15’')
  })

  it('renvoie undefined pour un chemin inconnu', () => {
    expect(getValue(dictionaries.fr, 'app.missing')).toBeUndefined()
    expect(getValue(null, 'app.title')).toBeUndefined()
  })
})

describe('translate', () => {
  it('traduit dans la langue demandée', () => {
    expect(translate(dictionaries, 'ar', 'app.title')).toBe('عنوان')
  })

  it('replie sur la langue par défaut quand la clé manque', () => {
    expect(translate(dictionaries, 'ar', 'app.nested.deep')).toBe('Profond')
  })

  it('renvoie la clé si aucune traduction n’existe', () => {
    expect(translate(dictionaries, 'ar', 'unknown.key')).toBe('unknown.key')
  })
})

describe('createTranslator', () => {
  it('expose t.has pour tester l’existence d’une clé', () => {
    const t = createTranslator(dictionaries, 'ar')

    expect(t('app.title')).toBe('عنوان')
    expect(t.has('app.title')).toBe(true)
    expect(t.has('help.block')).toBe(false)
    expect(t.language).toBe('ar')
  })
})

describe('hasTranslation', () => {
  it('ne considère valides que les chaînes', () => {
    expect(hasTranslation(dictionaries, 'fr', 'app.title')).toBe(true)
    expect(hasTranslation(dictionaries, 'fr', 'app')).toBe(false)
  })
})

describe('collectKeyPaths', () => {
  it('liste récursivement les chemins de clés', () => {
    expect(collectKeyPaths(dictionaries.fr).sort()).toEqual([
      'app.nested.deep',
      'app.title',
      'fields.minute.options.15',
    ])
  })
})
