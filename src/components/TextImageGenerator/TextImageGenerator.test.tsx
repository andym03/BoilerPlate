import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextImageGenerator, type TextImageGeneratorProps } from './TextImageGenerator'
import * as fontLoader from '@utils/fontLoader'

// Mock the font loader
jest.mock('@utils/fontLoader')
const mockLoadFont = fontLoader.loadFont as jest.MockedFunction<typeof fontLoader.loadFont>

// Mock useTextImage hook
jest.mock('@hooks/useTextImage', () => ({
  useTextImage: jest.fn(() => ({
    imageData: null,
    isLoading: false,
    error: null,
    render: jest.fn(),
    clearError: jest.fn(),
  })),
}))

describe('TextImageGenerator', () => {
  const defaultProps: TextImageGeneratorProps = {}

  beforeEach(() => {
    jest.clearAllMocks()
    mockLoadFont.mockResolvedValue({
      success: true,
      fontFamily: 'TestFont',
      fontUrl: 'https://example.com/font.woff2',
    })
  })

  describe('Rendering', () => {
    it('renders all child components', () => {
      render(<TextImageGenerator {...defaultProps} />)
      expect(screen.getByLabelText(/text/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/font url/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/font size/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/text color/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/background color/i)).toBeInTheDocument()
    })

    it('renders with initial values', () => {
      render(
        <TextImageGenerator
          {...defaultProps}
          initialText="Hello"
          initialFontUrl="https://example.com/font.woff2"
          initialFontSize={32}
          initialTextColor="#ff0000"
          initialBackgroundColor="#0000ff"
        />
      )
      const textInput = screen.getByLabelText(/text/i) as HTMLTextAreaElement
      expect(textInput.value).toBe('Hello')
    })

    it('applies custom className', () => {
      render(<TextImageGenerator {...defaultProps} className="custom-class" />)
      const container = screen.getByTestId('text-image-generator')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<TextImageGenerator {...defaultProps} data-testid="test-generator" />)
      expect(screen.getByTestId('test-generator')).toBeInTheDocument()
    })
  })

  describe('State management', () => {
    it('updates text when TextInput changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const textInput = screen.getByLabelText(/text/i)
      await user.type(textInput, 'New text')
      
      expect((textInput as HTMLTextAreaElement).value).toBe('New text')
    })

    it('updates font URL when FontInput changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const fontInput = screen.getByLabelText(/font url/i)
      await user.type(fontInput, 'https://example.com/new-font.woff2')
      
      expect((fontInput as HTMLInputElement).value).toBe('https://example.com/new-font.woff2')
    })

    it('updates font size when StyleControls changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const fontSizeInput = screen.getByLabelText(/font size/i)
      await user.clear(fontSizeInput)
      await user.type(fontSizeInput, '48')
      
      expect((fontSizeInput as HTMLInputElement).value).toBe('48')
    })

    it('updates text color when StyleControls changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const textColorInput = screen.getByLabelText(/text color/i)
      await user.clear(textColorInput)
      await user.type(textColorInput, '#00ff00')
      
      expect((textColorInput as HTMLInputElement).value).toBe('#00ff00')
    })

    it('updates background color when StyleControls changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const bgColorInput = screen.getByLabelText(/background color/i)
      await user.clear(bgColorInput)
      await user.type(bgColorInput, '#ff00ff')
      
      expect((bgColorInput as HTMLInputElement).value).toBe('#ff00ff')
    })
  })

  describe('Font loading', () => {
    it('loads font when font URL changes', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const fontInput = screen.getByLabelText(/font url/i)
      await user.type(fontInput, 'https://example.com/font.woff2')
      
      // Wait for debounced font loading
      await waitFor(() => {
        expect(mockLoadFont).toHaveBeenCalled()
      }, { timeout: 2000 })
    })

    it('shows loading state during font loading', async () => {
      mockLoadFont.mockImplementation(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve({
                success: true,
                fontFamily: 'TestFont',
                fontUrl: 'https://example.com/font.woff2',
              })
            }, 100)
          })
      )

      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const fontInput = screen.getByLabelText(/font url/i)
      await user.type(fontInput, 'https://example.com/font.woff2')
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
      })
    })

    it('handles font loading errors', async () => {
      mockLoadFont.mockResolvedValue({
        success: false,
        error: 'Failed to load font',
        fontFamily: 'TestFont',
        fontUrl: 'https://example.com/font.woff2',
      })

      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      const fontInput = screen.getByLabelText(/font url/i)
      await user.type(fontInput, 'https://example.com/invalid-font.woff2')
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Image rendering', () => {
    it('renders image when all required data is available', async () => {
      const { useTextImage } = require('@hooks/useTextImage')
      useTextImage.mockReturnValue({
        imageData: {
          svg: '<svg></svg>',
          dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
          blob: new Blob(['<svg></svg>'], { type: 'image/svg+xml' }),
          width: 100,
          height: 50,
        },
        isLoading: false,
        error: null,
        render: jest.fn(),
        clearError: jest.fn(),
      })

      render(<TextImageGenerator {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument()
      })
    })

    it('shows loading state during image rendering', () => {
      const { useTextImage } = require('@hooks/useTextImage')
      useTextImage.mockReturnValue({
        imageData: null,
        isLoading: true,
        error: null,
        render: jest.fn(),
        clearError: jest.fn(),
      })

      render(<TextImageGenerator {...defaultProps} />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('shows error state when rendering fails', () => {
      const { useTextImage } = require('@hooks/useTextImage')
      useTextImage.mockReturnValue({
        imageData: null,
        isLoading: false,
        error: new Error('Rendering failed'),
        render: jest.fn(),
        clearError: jest.fn(),
      })

      render(<TextImageGenerator {...defaultProps} />)
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  describe('Export functionality', () => {
    it('enables export buttons when image is available', async () => {
      const { useTextImage } = require('@hooks/useTextImage')
      useTextImage.mockReturnValue({
        imageData: {
          svg: '<svg></svg>',
          dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
          blob: new Blob(['<svg></svg>'], { type: 'image/svg+xml' }),
          width: 100,
          height: 50,
        },
        isLoading: false,
        error: null,
        render: jest.fn(),
        clearError: jest.fn(),
      })

      render(<TextImageGenerator {...defaultProps} />)
      
      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /download/i })
        expect(downloadButton).not.toBeDisabled()
      })
    })
  })

  describe('Data flow', () => {
    it('passes correct props to child components', () => {
      render(
        <TextImageGenerator
          {...defaultProps}
          initialText="Test"
          initialFontSize={24}
          initialTextColor="#000000"
          initialBackgroundColor="#ffffff"
        />
      )
      
      const textInput = screen.getByLabelText(/text/i) as HTMLTextAreaElement
      const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement
      
      expect(textInput.value).toBe('Test')
      expect(fontSizeInput.value).toBe('24')
    })

    it('coordinates between child components', async () => {
      const user = userEvent.setup()
      render(<TextImageGenerator {...defaultProps} />)
      
      // Change text
      const textInput = screen.getByLabelText(/text/i)
      await user.type(textInput, 'Hello')
      
      // Change font size
      const fontSizeInput = screen.getByLabelText(/font size/i)
      await user.clear(fontSizeInput)
      await user.type(fontSizeInput, '32')
      
      // Both should be updated
      expect((textInput as HTMLTextAreaElement).value).toBe('Hello')
      expect((fontSizeInput as HTMLInputElement).value).toBe('32')
    })
  })
})

