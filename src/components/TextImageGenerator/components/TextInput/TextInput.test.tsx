import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextInput, type TextInputProps } from './TextInput'

describe('TextInput', () => {
  const defaultProps: TextInputProps = {
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders accessible text input', () => {
      render(<TextInput {...defaultProps} ariaLabel="Enter your message" />)
      const textarea = screen.getByRole('textbox', { name: 'Enter your message' })
      expect(textarea).toBeInTheDocument()
    })

    it('renders with initial value that user can see', () => {
      render(<TextInput {...defaultProps} value="Hello World" ariaLabel="Text input" />)
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      expect(textarea).toHaveValue('Hello World')
    })

    it('renders with placeholder that guides the user', () => {
      render(<TextInput {...defaultProps} placeholder="Enter text here" ariaLabel="Text input" />)
      const textarea = screen.getByPlaceholderText('Enter text here')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveAttribute('aria-label', 'Text input')
    })

    it('renders accessible character count when maxLength is provided', () => {
      render(<TextInput {...defaultProps} value="Hello" maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toBeInTheDocument()
      expect(countElement).toHaveTextContent('5/100')
      expect(countElement).toHaveAttribute('aria-live', 'polite')
      expect(countElement).toHaveAttribute('aria-atomic', 'true')
    })

    it('does not render character count when maxLength is not provided', () => {
      render(<TextInput {...defaultProps} value="Hello" ariaLabel="Text input" />)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('associates character count with textarea via aria-describedby', () => {
      render(<TextInput {...defaultProps} value="Hello" maxLength={100} data-testid="test-input" ariaLabel="Text input" />)
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      const countElement = screen.getByRole('status')
      expect(textarea).toHaveAttribute('aria-describedby', 'test-input-count')
      expect(countElement).toHaveAttribute('id', 'test-input-count')
    })

    it('applies custom className', () => {
      render(<TextInput {...defaultProps} className="custom-class" ariaLabel="Text input" />)
      const container = screen.getByRole('textbox', { name: 'Text input' }).closest('.text-input')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<TextInput {...defaultProps} data-testid="test-text-input" />)
      expect(screen.getByTestId('test-text-input')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('allows user to type and calls onChange', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<TextInput {...defaultProps} onChange={handleChange} ariaLabel="Text input" />)
      
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      await user.type(textarea, 'Hello')
      
      expect(handleChange).toHaveBeenCalledTimes(5)
      expect(handleChange).toHaveBeenLastCalledWith('Hello')
    })

    it('updates character count as user types', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<TextInput {...defaultProps} onChange={handleChange} maxLength={100} ariaLabel="Text input" />)
      
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      await user.type(textarea, 'Hello')
      
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('5/100')
    })

    it('prevents user from exceeding maxLength', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<TextInput {...defaultProps} onChange={handleChange} maxLength={5} ariaLabel="Text input" />)
      
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      await user.type(textarea, 'Hello World')
      
      expect(textarea).toHaveValue('Hello')
      expect(textarea).toHaveAttribute('aria-valuemax', '5')
    })
  })

  describe('Disabled state', () => {
    it('renders disabled input that user cannot interact with', () => {
      render(<TextInput {...defaultProps} disabled ariaLabel="Text input" />)
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      expect(textarea).toBeDisabled()
    })

    it('prevents user input when disabled', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<TextInput {...defaultProps} onChange={handleChange} disabled ariaLabel="Text input" />)
      
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      await user.type(textarea, 'Hello')
      
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Multi-line support', () => {
    it('allows user to enter multi-line text', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<TextInput {...defaultProps} onChange={handleChange} ariaLabel="Text input" />)
      
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      await user.type(textarea, 'Line 1{Enter}Line 2')
      
      expect(handleChange).toHaveBeenCalled()
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0]
      expect(lastCall).toContain('Line 1')
      expect(lastCall).toContain('Line 2')
    })
  })

  describe('Character count display', () => {
    it('shows accessible count for empty text', () => {
      render(<TextInput {...defaultProps} value="" maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('0/100')
    })

    it('shows accessible count for text input', () => {
      const longText = 'A'.repeat(50)
      render(<TextInput {...defaultProps} value={longText} maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('50/100')
    })

    it('warns user when approaching character limit (80%+)', () => {
      const longText = 'A'.repeat(85)
      render(<TextInput {...defaultProps} value={longText} maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('85/100')
      expect(countElement).toHaveAttribute('data-warning', 'true')
    })

    it('alerts user when at character limit', () => {
      const longText = 'A'.repeat(100)
      render(<TextInput {...defaultProps} value={longText} maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('100/100')
      expect(countElement).toHaveAttribute('data-error', 'true')
    })

    it('alerts user when over character limit', () => {
      const longText = 'A'.repeat(105)
      render(<TextInput {...defaultProps} value={longText} maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('105/100')
      expect(countElement).toHaveAttribute('data-error', 'true')
    })

    it('shows normal state when below warning threshold', () => {
      const longText = 'A'.repeat(50)
      render(<TextInput {...defaultProps} value={longText} maxLength={100} ariaLabel="Text input" />)
      const countElement = screen.getByRole('status')
      expect(countElement).toHaveTextContent('50/100')
      expect(countElement).not.toHaveAttribute('data-warning')
      expect(countElement).not.toHaveAttribute('data-error')
    })

    it('provides aria-valuenow and aria-valuemax for assistive technologies', () => {
      render(<TextInput {...defaultProps} value="Hello" maxLength={100} ariaLabel="Text input" />)
      const textarea = screen.getByRole('textbox', { name: 'Text input' })
      expect(textarea).toHaveAttribute('aria-valuenow', '5')
      expect(textarea).toHaveAttribute('aria-valuemax', '100')
      expect(textarea).toHaveAttribute('aria-valuemin', '0')
    })
  })
})

