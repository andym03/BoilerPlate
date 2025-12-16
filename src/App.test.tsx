import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    const titleElement = screen.getByText(/React \+ Vite \+ TypeScript/i)
    expect(titleElement).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()
    
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })
})
