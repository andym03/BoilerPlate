/**
 * React hook for text image generation
 */

import { useState, useCallback } from 'react'
import { TextImageOptions, RenderResult } from '../types/textImage'
import { renderTextToSvg } from '../utils/textImageRenderer'
import { loadFont } from '../utils/fontLoader'
import { handleError } from '../utils/errorHandler'
import { ErrorType } from '../types/textImage'

export interface UseTextImageReturn {
  /** Rendered image data */
  imageData: {
    svg: string
    dataUrl: string
    blob: Blob | null
    width: number
    height: number
  } | null
  /** Whether font is currently loading */
  isLoading: boolean
  /** Error object if any error occurred */
  error: Error | null
  /** Function to trigger rendering */
  render: (options: TextImageOptions) => Promise<void>
  /** Function to clear error state */
  clearError: () => void
}

/**
 * Hook for generating text images with font loading support
 */
export function useTextImage(): UseTextImageReturn {
  const [imageData, setImageData] = useState<{
    svg: string
    dataUrl: string
    blob: Blob | null
    width: number
    height: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const render = useCallback(
    async (options: TextImageOptions): Promise<void> => {
      setIsLoading(true)
      setError(null)

      try {
        // Validate options
        if (!options.text || options.text.trim() === '') {
          throw new Error('Text cannot be empty')
        }

        if (!options.fontFamily) {
          throw new Error('Font family is required')
        }

        if (options.fontSize <= 0) {
          throw new Error('Font size must be greater than 0')
        }

        // For system fonts (like Arial), we can render directly
        // For custom fonts, they should be pre-loaded using loadFont utility
        // The hook will attempt to render with the specified fontFamily
        // If the font is not available, the browser will use a fallback

        // Render text to SVG
        const result: RenderResult = renderTextToSvg(options)

        // Ensure blob is available
        let blob: Blob | null = result.blob
        if (blob instanceof Promise) {
          blob = await blob
        }

        setImageData({
          svg: result.svg,
          dataUrl: result.dataUrl,
          blob,
          width: result.width,
          height: result.height,
        })
      } catch (err) {
        const handledError = handleError(err)
        const errorMessage = handledError.message

        setError(new Error(errorMessage))
        setImageData(null)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    imageData,
    isLoading,
    error,
    render,
    clearError,
  }
}

