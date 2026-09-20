import { describe, expect, it } from 'vitest'
import { analyzeMatch, buildReport, validateSelection } from './decisions.js'
import { parseForm, serializeForm } from '../lib/form.js'
import { COACH_INITIAL, visibleQuestions } from './questions.js'
export const attack = { ...COACH_INITIAL, liveMinute:'75', ourScore:'0', theirScore:'1', ourPlayers:'11', theirPlayers:'11', objective:'score', problem:'attack', repeated:'yes', tried:'no', delivery:'yes', strikerIsolated:'yes', formation:'433', opponentBlock:'low', cover:'yes', subsAvailable:'yes', benchReady:'yes', outgoing:'Relayeur 8', incoming:'Attaquant 12' }
describe('tactical decisions', () => {
  it('asks for information instead of inventing an action', () => {
    expect(analyzeMatch({}).status).toBe('needs_information')
    expect(analyzeMatch({ ...attack, cover:'unknown' }).candidates).toEqual([])
    expect(analyzeMatch({ ...attack, liveMinute:'-1' }).missing[0].id).toBe('liveMinute')
  })
  it('offers two strikers only with the required context', () => {
    expect(analyzeMatch(attack).candidates[0].id).toBe('two-strikers')
    for (const change of [{ subsAvailable:'no' }, { benchReady:'no' }, { formation:'442' }, { liveMinute:'20' }, { ourScore:'1' }, { objective:'protect' }, { cover:'no' }, { delivery:'no' }]) {
      expect(analyzeMatch({ ...attack, ...change }).candidates.some(c => c.id === 'two-strikers')).toBe(false)
    }
  })
  it('distinguishes lack of service from lack of attackers', () => {
    expect(analyzeMatch({ ...attack, delivery:'no' }).candidates.map(c => c.id)).toEqual(['connect'])
  })
  it('does not replace a left back exposed to an overload', () => {
    const f = { ...attack, problem:'left', leftDuel:'two', wingerTracks:'no', leftBeaten:'yes', leftTired:'yes' }
    expect(analyzeMatch(f).candidates.map(c => c.id)).toEqual(['cover-left'])
    expect(analyzeMatch({ ...f, leftDuel:'one', wingerTracks:'yes' }).candidates[0].id).toBe('replace-left')
    expect(analyzeMatch({ ...f, leftDuel:'one', wingerTracks:'yes', subsAvailable:'no' }).candidates.map(c => c.id)).toEqual(['protect-left'])
  })
  it('does not apply 11v11 rules after a dismissal or override an earlier adjustment', () => {
    expect(analyzeMatch({ ...attack, ourPlayers:'10' }).status).toBe('observe')
    expect(analyzeMatch({ ...attack, repeated:'no' }).status).toBe('observe')
    expect(analyzeMatch({ ...attack, tried:'yes', previousAdjustment:'Un relayeur se projette déjà' }).status).toBe('observe')
  })
  it('rejects impossible substitutions', () => {
    expect(analyzeMatch({ ...attack, incoming:attack.outgoing }).status).toBe('needs_information')
  })
  it('only exposes questions relevant to the current problem', () => {
    const ids = visibleQuestions({ ...attack, problem:'press' }).map(q => q.id)
    expect(ids).toContain('pressTogether')
    expect(ids).not.toContain('incoming')
    expect(ids).not.toContain('leftDuel')
  })
  it('rejects invented decisions and unvalidated AI prose', () => {
    const candidates = analyzeMatch(attack).candidates
    expect(validateSelection('{"decisionId":"support-nine"}', candidates)).toBe('support-nine')
    for (const text of ['garbage','{"decisionId":"invented"}','{"decisionId":"support-nine","action":"Invented player"}']) expect(() => validateSelection(text, candidates)).toThrow()
  })
  it('exports decisions and ignores stale AI results', () => {
    const ai = { fingerprint:JSON.stringify(attack), decisionId:'support-nine', model:'test' }
    expect(buildReport(attack, 'fr', ai).analysis.source).toBe('local-ai')
    expect(buildReport({ ...attack, ourScore:'2' }, 'fr', ai).analysis.source).toBe('rules')
    expect(buildReport(attack, 'ar', ai).analysis.decision.title).toBe('دعم المهاجم بلاعب وسط متقدم')
  })
  it('preserves coach answers through existing save/load and accepts old saves', () => {
    expect(parseForm(serializeForm(attack)).incoming).toBe(attack.incoming)
    expect(parseForm('{"match":"Old"}').problem).toBe('')
  })
})
