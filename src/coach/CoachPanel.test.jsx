import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CoachPanel from './CoachPanel.jsx'
import { I18nProvider } from '../i18n/index.js'
import { buildReport } from './decisions.js'
const { select, dispose } = vi.hoisted(() => ({ select:vi.fn(), dispose:vi.fn() }))
vi.mock('./local-ai.js', () => ({ MODEL:'test', createLocalSession:() => ({ select, dispose }) }))
const form = { liveMinute:'75', ourScore:'0', theirScore:'1', ourPlayers:'11', theirPlayers:'11', objective:'score', problem:'attack', repeated:'yes', tried:'no', delivery:'yes', strikerIsolated:'yes', formation:'433', opponentBlock:'low', cover:'yes', subsAvailable:'yes', benchReady:'yes', outgoing:'8', incoming:'12' }
const panel = (f, onAI = vi.fn()) => <I18nProvider language="fr"><CoachPanel form={f} report={buildReport(f,'fr')} onChange={vi.fn()} onAI={onAI} /></I18nProvider>
beforeEach(() => vi.clearAllMocks())
describe('local AI interface', () => {
  it('does not download a model automatically and retains rules after GPU failure', async () => {
    select.mockRejectedValue(new Error('NO_WEBGPU'))
    render(panel(form))
    expect(select).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name:'Analyser avec l’IA locale' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('WebGPU indisponible')
    expect(screen.getByRole('heading', { name:'Passer du 4-3-3 au 4-4-2' })).toBeInTheDocument()
  })
  it('discards an old response after observations change', async () => {
    let resolve
    select.mockImplementation(() => new Promise(r => { resolve = r }))
    const onAI = vi.fn()
    const view = render(panel(form,onAI))
    await userEvent.click(screen.getByRole('button', { name:'Analyser avec l’IA locale' }))
    view.rerender(panel({ ...form, ourScore:'1' },onAI))
    await act(async () => resolve('two-strikers'))
    expect(onAI).not.toHaveBeenCalled()
    expect(dispose).toHaveBeenCalled()
  })
  it('uses a local selection for this exact observation snapshot', async () => {
    select.mockResolvedValue('support-nine')
    const onAI = vi.fn()
    render(panel(form,onAI))
    await userEvent.click(screen.getByRole('button', { name:'Analyser avec l’IA locale' }))
    await waitFor(() => expect(onAI).toHaveBeenCalledWith({ decisionId:'support-nine', model:'test', fingerprint:JSON.stringify(form) }))
  })
})
