import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StyleControls, type StyleControlsProps } from './StyleControls'

describe('StyleControls', () => {
  const defaultProps: StyleControlsProps = {
    fontSize: 24,
    onFontSizeChange: jest.fn(),
    textColor: '#000000',
    onTextColorChange: jest.fn(),
    backgroundColor: '#ffffff',
    onBackgroundColorChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all control elements', () => {
      render(<StyleControls {...defaultProps} />)
      expect(screen.getByLabelText(/font size/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/text color/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/background color/i)).toBeInTheDocument()
    })

    it('renders font size input with correct value', () => {
      render(<StyleControls {...defaultProps} fontSize={32} />)
      const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement
      expect(fontSizeInput.value).toBe('32')
    })

    it('renders text color input with correct value', () => {
      render(<StyleControls {...defaultProps} textColor="#ff0000" />)
      const textColorInput = screen.getByLabelText(/text color/i) as HTMLInputElement
      expect(textColorInput.value).toBe('#ff0000')
    })

    it('renders background color input with correct value', () => {
      render(<StyleControls {...defaultProps} backgroundColor="#00ff00" />)
      const bgColorInput = screen.getByLabelText(/background color/i) as HTMLInputElement
      expect(bgColorInput.value).toBe('#00ff00')
    })

    it('applies custom className', () => {
      render(<StyleControls {...defaultProps} className="custom-class" />)
      const container = screen.getByTestId('style-controls')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<StyleControls {...defaultProps} data-testid="test-style-controls" />)
      expect(screen.getByTestId('test-style-controls')).toBeInTheDocument()
    })

    it('uses default testid when not provided', () => {
      render(<StyleControls {...defaultProps} />)
      expect(screen.getByTestId('style-controls')).toBeInTheDocument()
    })
  })

  describe('Font size control', () => {
    it('calls onFontSizeChange when font size changes', async () => {
      const handleFontSizeChange = jest.fn()
      const user = userEvent.setup()
      render(
        <StyleControls
          {...defaultProps}
          onFontSizeChange={handleFontSizeChange}
        />
      )
      
      const fontSizeInput = screen.getByLabelText(/font size/i)
      await user.clear(fontSizeInput)
      await user.type(fontSizeInput, '48')
      
      expect(handleFontSizeChange).toHaveBeenCalled()
    })

    it('respects minFontSize', () => {
      render(<StyleControls {...defaultProps} minFontSize={8} />)
      const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement
      expect(fontSizeInput).toHaveAttribute('min', '8')
    })

    it('respects maxFontSize', () => {
      render(<StyleControls {...defaultProps} maxFontSize={200} />)
      const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement
      expect(fontSizeInput).toHaveAttribute('max', '200')
    })

    it('uses default min/max when not provided', () => {
      render(<StyleControls {...defaultProps} />)
      const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement
      expect(fontSizeInput).toHaveAttribute('min')
      expect(fontSizeInput).toHaveAttribute('max')
    })
  })

  describe('Text color control', () => {
    it('calls onTextColorChange when text color changes', async () => {
      const handleTextColorChange = jest.fn()
      const user = userEvent.setup()
      render(
        <StyleControls
          {...defaultProps}
          onTextColorChange={handleTextColorChange}
        />
      )
      
      const textColorInput = screen.getByLabelText(/text color/i)
      await user.clear(textColorInput)
      await user.type(textColorInput, '#ff0000')
      
      expect(handleTextColorChange).toHaveBeenCalled()
    })

    it('handles hex color input', async () => {
      const handleTextColorChange = jest.fn()
      const user = userEvent.setup()
      render(
        <StyleControls
          {...defaultProps}
          onTextColorChange={handleTextColorChange}
        />
      )
      
      const textColorInput = screen.getByLabelText(/text color/i)
      await user.clear(textColorInput)
      await user.type(textColorInput, '#abcdef')
      
      expect(handleTextColorChange).toHaveBeenCalledWith('#abcdef')
    })
  })

  describe('Background color control', () => {
    it('calls onBackgroundColorChange when background color changes', async () => {
      const handleBackgroundColorChange = jest.fn()
      const user = userEvent.setup()
      render(
        <StyleControls
          {...defaultProps}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
      )
      
      const bgColorInput = screen.getByLabelText(/background color/i)
      await user.clear(bgColorInput)
      await user.type(bgColorInput, '#00ff00')
      
      expect(handleBackgroundColorChange).toHaveBeenCalled()
    })

    it('handles rgba color input', async () => {
      const handleBackgroundColorChange = jest.fn()
      const user = userEvent.setup()
      render(
        <StyleControls
          {...defaultProps}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
      )
      
      const bgColorInput = screen.getByLabelText(/background color/i)
      await user.clear(bgColorInput)
      await user.type(bgColorInput, 'rgba(255, 0, 0, 0.5)')
      
      expect(handleBackgroundColorChange).toHaveBeenCalled()
    })
  })

  describe('All controls together', () => {
    it('allows changing all style properties independently', async () => {
      const handleFontSizeChange = jest.fn()
      const handleTextColorChange = jest.fn()
      const handleBackgroundColorChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <StyleControls
          {...defaultProps}
          onFontSizeChange={handleFontSizeChange}
          onTextColorChange={handleTextColorChange}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
      )
      
      const fontSizeInput = screen.getByLabelText(/font size/i)
      const textColorInput = screen.getByLabelText(/text color/i)
      const bgColorInput = screen.getByLabelText(/background color/i)
      
      await user.clear(fontSizeInput)
      await user.type(fontSizeInput, '36')
      await user.clear(textColorInput)
      await user.type(textColorInput, '#ff0000')
      await user.clear(bgColorInput)
      await user.type(bgColorInput, '#0000ff')
      
      expect(handleFontSizeChange).toHaveBeenCalled()
      expect(handleTextColorChange).toHaveBeenCalled()
      expect(handleBackgroundColorChange).toHaveBeenCalled()
    })
  })
})

