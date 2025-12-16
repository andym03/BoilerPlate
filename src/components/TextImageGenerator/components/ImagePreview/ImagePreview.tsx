import React from 'react'
import './ImagePreview.css'

/**
 * Props for the ImagePreview component
 */
export interface ImagePreviewProps {
  /** SVG data URL for preview */
  imageDataUrl: string | null
  /** Whether image is currently loading */
  isLoading: boolean
  /** Error message if rendering failed */
  error: string | null
  /** Width of the preview container (optional, for responsive sizing) */
  width?: number | string
  /** Height of the preview container (optional, for responsive sizing) */
  height?: number | string
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * ImagePreview component for displaying rendered SVG with loading and error states
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageDataUrl,
  isLoading,
  error,
  width,
  height,
  className = '',
  'data-testid': testId = 'image-preview',
}) => {
  const containerStyle: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={`image-preview ${className}`.trim()}
      data-testid={testId}
      style={containerStyle}
    >
      {isLoading && (
        <div className="image-preview__loading" role="status" aria-live="polite">
          <div className="image-preview__spinner"></div>
          <span>Loading...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="image-preview__error" role="alert">
          <span className="image-preview__error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && imageDataUrl && (
        <div className="image-preview__content">
          <img
            src={imageDataUrl}
            alt="Text image preview"
            className="image-preview__image"
          />
        </div>
      )}

      {!isLoading && !error && !imageDataUrl && (
        <div className="image-preview__empty">
          <span>No image to preview</span>
        </div>
      )}
    </div>
  )
}

