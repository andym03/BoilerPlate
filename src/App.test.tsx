import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders toolbar', () => {
    render(<App />)
    const toolbar = screen.getByRole('toolbar', { name: /drawing tools/i })
    expect(toolbar).toBeInTheDocument()
  })

  it('renders canvas', () => {
    render(<App />)
    const canvas = screen.getByTestId('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('allows selecting tools from toolbar', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const rectangleButton = screen.getByRole('button', { name: /rectangle/i })
    expect(rectangleButton).toBeInTheDocument()
    
    await user.click(rectangleButton)
    expect(rectangleButton).toHaveAttribute('aria-pressed', 'true')
  })
})
