import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RadioField from './RadioField.jsx'

const options = [
  { value: 'haut', label: 'Haut' },
  { value: 'bas', label: 'Bas' },
]

const setup = (props = {}) =>
  render(<RadioField name="block" label="Bloc défensif" options={options} value="" onChange={() => {}} {...props} />)

describe('RadioField', () => {
  it('affiche le libellé et toutes les options', () => {
    setup()

    expect(screen.getByText('Bloc défensif')).toBeInTheDocument()
    expect(screen.getByLabelText('Haut')).toBeInTheDocument()
    expect(screen.getByLabelText('Bas')).toBeInTheDocument()
  })

  it('coche uniquement la valeur sélectionnée', () => {
    setup({ value: 'haut' })

    expect(screen.getByLabelText('Haut')).toBeChecked()
    expect(screen.getByLabelText('Bas')).not.toBeChecked()
  })

  it('remonte le nom du champ et la valeur choisie', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    setup({ onChange })

    await user.click(screen.getByLabelText('Bas'))

    expect(onChange).toHaveBeenCalledWith('block', 'bas')
  })

  it('n’affiche le bouton d’aide que si `help` est vrai', async () => {
    const onOpenHelp = vi.fn()
    const user = userEvent.setup()

    const { unmount } = setup()
    expect(screen.queryByRole('button', { name: /Aide/ })).not.toBeInTheDocument()
    unmount()

    setup({ help: true, onOpenHelp })
    await user.click(screen.getByRole('button', { name: 'Aide : Bloc défensif' }))

    expect(onOpenHelp).toHaveBeenCalledTimes(1)
  })
})
