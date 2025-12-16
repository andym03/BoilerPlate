import React, { useCallback } from 'react'
import './ExportButtons.css'
import { Button } from '@/design_system/components/Button'

/**
 * Export operation status
 */
export type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'

/**
 * Props for the ExportButtons component
 */
export interface ExportButtonsProps {
  /** SVG string for export */
  svg: string | null
  /** Data URL for export */
  dataUrl: string | null
  /** Blob for export */
  blob: Blob | null
  /** Whether export is currently in progress */
  isExporting?: boolean
  /** Callback when download is triggered */
  onDownload?: () => void
  /** Callback when copy to clipboard is triggered */
  onCopy?: () => void
  /** Callback when share is triggered */
  onShare?: () => void
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * ExportButtons component for downloading, copying, and sharing text images
 */
export const ExportButtons: React.FC<ExportButtonsProps> = ({
  svg,
  dataUrl,
  blob,
  isExporting = false,
  onDownload,
  onCopy,
  onShare,
  className = '',
  'data-testid': testId = 'export-buttons',
}) => {
  const isDisabled = !svg || !dataUrl || isExporting

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload()
      return
    }

    if (!blob && !svg) return

    try {
      const blobToDownload = blob || new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blobToDownload)
      const link = document.createElement('a')
      link.href = url
      link.download = 'text-image.svg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }, [svg, blob, onDownload])

  const handleCopy = useCallback(async () => {
    if (onCopy) {
      onCopy()
      return
    }

    if (!dataUrl) return

    try {
      await navigator.clipboard.writeText(dataUrl)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [dataUrl, onCopy])

  const handleShare = useCallback(async () => {
    if (onShare) {
      onShare()
      return
    }

    if (!dataUrl) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Text Image',
          text: 'Generated text image',
          url: dataUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await handleCopy()
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to share:', error)
      }
    }
  }, [dataUrl, onShare, handleCopy])

  return (
    <div className={`export-buttons ${className}`.trim()} data-testid={testId}>
      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={isDisabled}
        aria-label="Download image"
      >
        Download
      </Button>
      <Button
        variant="secondary"
        onClick={handleCopy}
        disabled={isDisabled}
        aria-label="Copy to clipboard"
      >
        Copy
      </Button>
      <Button
        variant="info"
        onClick={handleShare}
        disabled={isDisabled}
        aria-label="Share image"
      >
        Share
      </Button>
    </div>
  )
}

