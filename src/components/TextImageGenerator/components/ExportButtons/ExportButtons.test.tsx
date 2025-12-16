import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportButtons, type ExportButtonsProps } from './ExportButtons'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock document.createElement for anchor element
const mockClick = jest.fn()
const mockRemove = jest.fn()
const mockAppendChild = jest.fn()
const mockRemoveChild = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  document.createElement = jest.fn((tagName: string) => {
    if (tagName === 'a') {
      return {
        href: '',
        download: '',
        click: mockClick,
        remove: mockRemove,
      } as unknown as HTMLAnchorElement
    }
    return document.createElement(tagName)
  })
  document.body.appendChild = mockAppendChild
  document.body.removeChild = mockRemoveChild
})

describe('ExportButtons', () => {
  const createMockBlob = (): Blob => {
    return new Blob(['<svg></svg>'], { type: 'image/svg+xml' })
  }

  const defaultProps: ExportButtonsProps = {
    svg: '<svg></svg>',
    dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
    blob: createMockBlob(),
  }

  describe('Rendering', () => {
    it('renders all export buttons', () => {
      render(<ExportButtons {...defaultProps} />)
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    })

    it('disables buttons when svg is null', () => {
      render(<ExportButtons {...defaultProps} svg={null} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      const shareButton = screen.getByRole('button', { name: /share/i })
      
      expect(downloadButton).toBeDisabled()
      expect(copyButton).toBeDisabled()
      expect(shareButton).toBeDisabled()
    })

    it('disables buttons when dataUrl is null', () => {
      render(<ExportButtons {...defaultProps} dataUrl={null} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      const shareButton = screen.getByRole('button', { name: /share/i })
      
      expect(downloadButton).toBeDisabled()
      expect(copyButton).toBeDisabled()
      expect(shareButton).toBeDisabled()
    })

    it('enables buttons when data is available', () => {
      render(<ExportButtons {...defaultProps} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      const shareButton = screen.getByRole('button', { name: /share/i })
      
      expect(downloadButton).not.toBeDisabled()
      expect(copyButton).not.toBeDisabled()
      expect(shareButton).not.toBeDisabled()
    })

    it('applies custom className', () => {
      render(<ExportButtons {...defaultProps} className="custom-class" />)
      const container = screen.getByTestId('export-buttons')
      expect(container).toHaveClass('custom-class')
    })

    it('applies data-testid', () => {
      render(<ExportButtons {...defaultProps} data-testid="test-export-buttons" />)
      expect(screen.getByTestId('test-export-buttons')).toBeInTheDocument()
    })
  })

  describe('Download functionality', () => {
    it('calls onDownload when download button is clicked', async () => {
      const handleDownload = jest.fn()
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} onDownload={handleDownload} />)
      
      const downloadButton = screen.getByRole('button', { name: /download/i })
      await user.click(downloadButton)
      
      expect(handleDownload).toHaveBeenCalledTimes(1)
    })

    it('triggers download when onDownload is not provided', async () => {
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} />)
      
      const downloadButton = screen.getByRole('button', { name: /download/i })
      await user.click(downloadButton)
      
      // Should create anchor element and trigger download
      expect(document.createElement).toHaveBeenCalledWith('a')
    })

    it('shows loading state when isExporting is true', () => {
      render(<ExportButtons {...defaultProps} isExporting={true} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      expect(downloadButton).toBeDisabled()
    })
  })

  describe('Copy to clipboard functionality', () => {
    it('calls onCopy when copy button is clicked', async () => {
      const handleCopy = jest.fn()
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} onCopy={handleCopy} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      expect(handleCopy).toHaveBeenCalledTimes(1)
    })

    it('copies dataUrl to clipboard when onCopy is not provided', async () => {
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.dataUrl)
    })

    it('handles clipboard errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Clipboard error'))
      
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      // Should handle error without crashing
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Share functionality', () => {
    it('calls onShare when share button is clicked', async () => {
      const handleShare = jest.fn()
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} onShare={handleShare} />)
      
      const shareButton = screen.getByRole('button', { name: /share/i })
      await user.click(shareButton)
      
      expect(handleShare).toHaveBeenCalledTimes(1)
    })

    it('shares dataUrl when onShare is not provided', async () => {
      const mockShare = jest.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { share: mockShare })
      
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} />)
      
      const shareButton = screen.getByRole('button', { name: /share/i })
      await user.click(shareButton)
      
      if (navigator.share) {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Text Image',
          text: 'Generated text image',
          url: defaultProps.dataUrl,
        })
      }
    })

    it('handles share API not available', async () => {
      const originalShare = navigator.share
      delete (navigator as any).share
      
      const user = userEvent.setup()
      render(<ExportButtons {...defaultProps} />)
      
      const shareButton = screen.getByRole('button', { name: /share/i })
      await user.click(shareButton)
      
      // Should not crash when share API is not available
      expect(shareButton).toBeInTheDocument()
      
      ;(navigator as any).share = originalShare
    })
  })

  describe('Export state management', () => {
    it('disables all buttons when isExporting is true', () => {
      render(<ExportButtons {...defaultProps} isExporting={true} />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })

    it('enables buttons when isExporting is false', () => {
      render(<ExportButtons {...defaultProps} isExporting={false} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      const shareButton = screen.getByRole('button', { name: /share/i })
      
      expect(downloadButton).not.toBeDisabled()
      expect(copyButton).not.toBeDisabled()
      expect(shareButton).not.toBeDisabled()
    })
  })

  describe('Edge cases', () => {
    it('handles null blob gracefully', () => {
      render(<ExportButtons {...defaultProps} blob={null} />)
      const downloadButton = screen.getByRole('button', { name: /download/i })
      // Should still be enabled if svg and dataUrl are available
      expect(downloadButton).not.toBeDisabled()
    })

    it('handles empty svg string', () => {
      render(<ExportButtons {...defaultProps} svg="" />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })
  })
})

