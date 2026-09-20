import { describe, expect, it } from 'vitest'
import { SECTIONS } from '../config/fields.js'
import { dictionaries, FALLBACK_LANGUAGE } from './dictionaries.js'
import { collectKeyPaths } from './translate.js'

const languages = Object.keys(dictionaries)

describe('dictionnaires i18n', () => {
  it('contient au moins le français et l’arabe', () => {
    expect(languages).toEqual(expect.arrayContaining(['fr', 'ar']))
  })

  it.each(languages)('la langue « %s » expose exactement les mêmes clés que la langue de repli', (language) => {
    const expected = collectKeyPaths(dictionaries[FALLBACK_LANGUAGE]).sort()
    const actual = collectKeyPaths(dictionaries[language]).sort()

    expect(actual).toEqual(expected)
  })

  it.each(languages)('aucune valeur de « %s » n’est vide', (language) => {
    const paths = collectKeyPaths(dictionaries[language])
    const empty = paths.filter((path) => {
      const value = path.split('.').reduce((acc, key) => acc?.[key], dictionaries[language])
      return typeof value !== 'string' || value.trim() === ''
    })

    expect(empty).toEqual([])
  })

  it('chaque section et chaque champ du schéma possède un libellé traduit', () => {
    for (const language of languages) {
      const dictionary = dictionaries[language]

      for (const section of SECTIONS) {
        expect(dictionary.sections?.[section.id]?.title, `${language} → sections.${section.id}.title`).toBeTruthy()
        expect(dictionary.sections?.[section.id]?.subtitle, `${language} → sections.${section.id}.subtitle`).toBeTruthy()

        for (const field of section.fields) {
          const entry = dictionary.fields?.[field.name]
          expect(entry?.label, `${language} → fields.${field.name}.label`).toBeTruthy()

          for (const option of field.options ?? []) {
            expect(entry?.options?.[option], `${language} → fields.${field.name}.options.${option}`).toBeTruthy()
          }
        }
      }
    }
  })

  it('chaque aide du schéma est disponible dans toutes les langues', () => {
    const helpFields = SECTIONS.flatMap((section) => section.fields.map((field) => field.name))

    for (const language of languages) {
      const missing = helpFields.filter((name) => {
        const help = dictionaries[language]?.help?.[name]
        return help !== undefined && (typeof help !== 'string' || help.trim() === '')
      })
      expect(missing, `aide vide pour ${language}`).toEqual([])
    }
  })
})
