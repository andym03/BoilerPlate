import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FontInput, type FontInputProps } from './FontInput'

describe('FontInput', () => {
  const defaultProps: FontInputProps = {
    value: '',
    onChange: jest.fn(),
    loadStatus: 'idle',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders input element', () => {
      render(<FontInput {...defaultProps} />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('renders with initial value', () => {
      render(<FontInput {...defaultProps} value="https://example.com/font.woff2" />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('https://example.com/font.woff2')
    })

    it('renders with placeholder', () => {
      render(<FontInput {...defaultProps} placeholder="Enter font URL" />)
      const input = screen.getByPlaceholderText('Enter font URL')
      expect(input).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<FontInput {...defaultProps} className="custom-class" />)
      const container = screen.getByRole('textbox').closest('.font-input')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<FontInput {...defaultProps} data-testid="test-font-input" />)
      expect(screen.getByTestId('test-font-input')).toBeInTheDocument()
    })
  })

  describe('Loading status indicator', () => {
    it('shows idle state', () => {
      render(<FontInput {...defaultProps} loadStatus="idle" />)
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/loaded/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('shows loading state', () => {
      render(<FontInput {...defaultProps} loadStatus="loading" />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('shows loaded state', () => {
      render(<FontInput {...defaultProps} loadStatus="loaded" />)
      expect(screen.getByText(/loaded/i)).toBeInTheDocument()
    })

    it('shows error state with error message', () => {
      render(
        <FontInput
          {...defaultProps}
          loadStatus="error"
          error="Failed to load font"
        />
      )
      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText('Failed to load font')).toBeInTheDocument()
    })

    it('shows error state without error message', () => {
      render(<FontInput {...defaultProps} loadStatus="error" />)
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onChange when URL changes', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<FontInput {...defaultProps} onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'https://example.com/font.woff2')
      
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenLastCalledWith('https://example.com/font.woff2')
    })
  })

  describe('Disabled state', () => {
    it('renders disabled input', () => {
      render(<FontInput {...defaultProps} disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('does not call onChange when disabled', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<FontInput {...defaultProps} onChange={handleChange} disabled />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'https://example.com/font.woff2')
      
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Validation feedback', () => {
    it('shows validation error when URL is invalid and status is error', () => {
      render(
        <FontInput
          {...defaultProps}
          value="invalid-url"
          loadStatus="error"
          error="Invalid URL format"
        />
      )
      expect(screen.getByText('Invalid URL format')).toBeInTheDocument()
    })

    it('shows success indicator when font is loaded', () => {
      render(
        <FontInput
          {...defaultProps}
          value="https://example.com/font.woff2"
          loadStatus="loaded"
        />
      )
      expect(screen.getByText(/loaded/i)).toBeInTheDocument()
    })
  })
})

