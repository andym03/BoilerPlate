import { render, screen } from '@testing-library/react'
import { ImagePreview, type ImagePreviewProps } from './ImagePreview'

describe('ImagePreview', () => {
  const defaultProps: ImagePreviewProps = {
    imageDataUrl: null,
    isLoading: false,
    error: null,
  }

  describe('Rendering', () => {
    it('renders preview container', () => {
      render(<ImagePreview {...defaultProps} />)
      const container = screen.getByTestId('image-preview')
      expect(container).toBeInTheDocument()
    })

    it('renders image when dataUrl is provided', () => {
      const dataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
      render(<ImagePreview {...defaultProps} imageDataUrl={dataUrl} />)
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', dataUrl)
    })

    it('does not render image when dataUrl is null', () => {
      render(<ImagePreview {...defaultProps} imageDataUrl={null} />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<ImagePreview {...defaultProps} className="custom-class" />)
      const container = screen.getByTestId('image-preview')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<ImagePreview {...defaultProps} data-testid="test-image-preview" />)
      expect(screen.getByTestId('test-image-preview')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows loading indicator when isLoading is true', () => {
      render(<ImagePreview {...defaultProps} isLoading={true} />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('does not show loading indicator when isLoading is false', () => {
      render(<ImagePreview {...defaultProps} isLoading={false} />)
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    it('shows loading even when imageDataUrl is provided', () => {
      const dataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
      render(
        <ImagePreview
          {...defaultProps}
          imageDataUrl={dataUrl}
          isLoading={true}
        />
      )
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('shows error message when error is provided', () => {
      render(<ImagePreview {...defaultProps} error="Failed to render image" />)
      expect(screen.getByText('Failed to render image')).toBeInTheDocument()
    })

    it('does not show error when error is null', () => {
      render(<ImagePreview {...defaultProps} error={null} />)
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('prioritizes error over image display', () => {
      const dataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
      render(
        <ImagePreview
          {...defaultProps}
          imageDataUrl={dataUrl}
          error="Rendering failed"
        />
      )
      expect(screen.getByText('Rendering failed')).toBeInTheDocument()
    })
  })

  describe('Responsive sizing', () => {
    it('applies width when provided', () => {
      render(<ImagePreview {...defaultProps} width={500} />)
      const container = screen.getByTestId('image-preview')
      expect(container).toHaveStyle({ width: '500px' })
    })

    it('applies height when provided', () => {
      render(<ImagePreview {...defaultProps} height={300} />)
      const container = screen.getByTestId('image-preview')
      expect(container).toHaveStyle({ height: '300px' })
    })

    it('applies string width', () => {
      render(<ImagePreview {...defaultProps} width="100%" />)
      const container = screen.getByTestId('image-preview')
      expect(container).toHaveStyle({ width: '100%' })
    })

    it('applies string height', () => {
      render(<ImagePreview {...defaultProps} height="auto" />)
      const container = screen.getByTestId('image-preview')
      expect(container).toHaveStyle({ height: 'auto' })
    })
  })

  describe('Image display', () => {
    it('renders SVG data URL correctly', () => {
      const svgDataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
      render(<ImagePreview {...defaultProps} imageDataUrl={svgDataUrl} />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', svgDataUrl)
      expect(img).toHaveAttribute('alt', expect.stringContaining('preview'))
    })

    it('handles empty state gracefully', () => {
      render(<ImagePreview {...defaultProps} imageDataUrl={null} isLoading={false} />)
      // Should render container but no image
      const container = screen.getByTestId('image-preview') || document.querySelector('.image-preview')
      expect(container).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('State combinations', () => {
    it('handles loading state with no error', () => {
      render(
        <ImagePreview
          {...defaultProps}
          isLoading={true}
          error={null}
          imageDataUrl={null}
        />
      )
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('handles error state when not loading', () => {
      render(
        <ImagePreview
          {...defaultProps}
          isLoading={false}
          error="Error message"
          imageDataUrl={null}
        />
      )
      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    it('handles successful render state', () => {
      const dataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
      render(
        <ImagePreview
          {...defaultProps}
          isLoading={false}
          error={null}
          imageDataUrl={dataUrl}
        />
      )
      expect(screen.getByRole('img')).toBeInTheDocument()
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })
})

