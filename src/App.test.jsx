import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('dir')
  document.documentElement.removeAttribute('lang')
})

describe('App', () => {
  it('affiche le formulaire complet en français', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Grille d’analyse tactique' })).toBeInTheDocument()
    expect(screen.getByText('Informations générales')).toBeInTheDocument()
    expect(screen.getByText('4) Organisation offensive')).toBeInTheDocument()
  })

  it('rend tous les champs du schéma', () => {
    render(<App />)

    expect(screen.getByLabelText('Match')).toBeInTheDocument()
    expect(screen.getByLabelText('Adversaire')).toBeInTheDocument()
    expect(screen.getByLabelText('Joueur qui déclenche')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Oui').length).toBeGreaterThan(1)
  })

  it('bascule en arabe et passe la page en RTL', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('language-toggle'))

    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(screen.getByRole('heading', { level: 1, name: 'شبكة التحليل التكتيكي' })).toBeInTheDocument()
    expect(screen.getByText('1) التموضع بدون الكرة')).toBeInTheDocument()

    await user.click(screen.getByTestId('language-toggle'))

    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('fr')
  })

  it('démarre en thème sombre et bascule en clair', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement).toHaveClass('dark')

    await user.click(screen.getByTestId('theme-toggle'))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(window.localStorage.getItem('tactical_theme')).toBe('"light"')
  })

  it('affiche l’aide pédagogique d’un champ dans la modale', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Aide : Bloc défensif' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveTextContent('DÉFINITION')

    await user.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('sauvegarde puis recharge les réponses', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Match'), 'U15 – J5')
    await user.click(screen.getAllByLabelText('Haut')[0])
    await user.click(screen.getByRole('button', { name: /Sauvegarder/ }))

    await user.click(screen.getByRole('button', { name: /Vider/ }))
    expect(screen.getByLabelText('Match')).toHaveValue('')

    await user.click(screen.getByRole('button', { name: /Charger/ }))
    expect(screen.getByLabelText('Match')).toHaveValue('U15 – J5')
    expect(screen.getAllByLabelText('Haut')[0]).toBeChecked()
  })

  it('signale l’absence de sauvegarde', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Charger/ }))

    expect(screen.getByRole('status')).toHaveTextContent('Aucune sauvegarde trouvée.')
  })
})
