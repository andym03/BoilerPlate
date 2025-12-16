import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTextImage } from '@hooks/useTextImage'
import { loadFont } from '@utils/fontLoader'
import { TextInput } from './components/TextInput'
import { FontInput, type FontLoadStatus } from './components/FontInput'
import { StyleControls } from './components/StyleControls'
import { ImagePreview } from './components/ImagePreview'
import { ExportButtons } from './components/ExportButtons'
import './TextImageGenerator.css'

/**
 * Props for the TextImageGenerator component
 */
export interface TextImageGeneratorProps {
  /** Initial text value */
  initialText?: string
  /** Initial font URL */
  initialFontUrl?: string
  /** Initial font size */
  initialFontSize?: number
  /** Initial text color */
  initialTextColor?: string
  /** Initial background color */
  initialBackgroundColor?: string
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * Internal state for TextImageGenerator
 */
export interface TextImageGeneratorState {
  text: string
  fontUrl: string
  fontFamily: string
  fontSize: number
  textColor: string
  backgroundColor: string
}

/**
 * Main TextImageGenerator component that orchestrates all child components
 */
export const TextImageGenerator: React.FC<TextImageGeneratorProps> = ({
  initialText = '',
  initialFontUrl = '',
  initialFontSize = 24,
  initialTextColor = '#000000',
  initialBackgroundColor = '#ffffff',
  className = '',
  'data-testid': testId = 'text-image-generator',
}) => {
  // State management
  const [text, setText] = useState(initialText)
  const [fontUrl, setFontUrl] = useState(initialFontUrl)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontSize, setFontSize] = useState(initialFontSize)
  const [textColor, setTextColor] = useState(initialTextColor)
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor)
  const [fontLoadStatus, setFontLoadStatus] = useState<FontLoadStatus>('idle')
  const [fontLoadError, setFontLoadError] = useState<string | undefined>()

  // Use the text image hook
  const { imageData, isLoading, error, render, clearError } = useTextImage()

  // Extract font family name from URL or use a default
  const extractFontFamily = useCallback((url: string): string => {
    if (!url) return 'Arial'
    
    // Try to extract font family from URL (e.g., from Google Fonts)
    const match = url.match(/family=([^:&]+)/i)
    if (match) {
      return match[1].replace(/\+/g, ' ')
    }
    
    // Default to a sanitized version of the URL filename
    const filename = url.split('/').pop()?.split('.')[0] || 'CustomFont'
    return filename.replace(/[^a-zA-Z0-9]/g, '')
  }, [])

  // Load font when fontUrl changes
  useEffect(() => {
    if (!fontUrl || fontUrl.trim() === '') {
      setFontLoadStatus('idle')
      setFontLoadError(undefined)
      setFontFamily('Arial')
      return
    }

    let cancelled = false

    const loadFontAsync = async () => {
      setFontLoadStatus('loading')
      setFontLoadError(undefined)

      const extractedFamily = extractFontFamily(fontUrl)
      const result = await loadFont(fontUrl, extractedFamily)

      if (cancelled) return

      if (result.success) {
        setFontLoadStatus('loaded')
        setFontFamily(result.fontFamily)
        setFontLoadError(undefined)
      } else {
        setFontLoadStatus('error')
        setFontLoadError(result.error)
        // Fallback to system font
        setFontFamily('Arial')
      }
    }

    // Debounce font loading
    const timeoutId = setTimeout(() => {
      loadFontAsync()
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [fontUrl, extractFontFamily])

  // Render image when relevant state changes
  useEffect(() => {
    if (!text || text.trim() === '') {
      return
    }

    // Debounce rendering
    const timeoutId = setTimeout(() => {
      render({
        text,
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
      })
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [text, fontFamily, fontSize, textColor, backgroundColor, render])

  // Handle text change
  const handleTextChange = useCallback((value: string) => {
    setText(value)
    clearError()
  }, [clearError])

  // Handle font URL change
  const handleFontUrlChange = useCallback((url: string) => {
    setFontUrl(url)
    clearError()
  }, [clearError])

  // Handle style changes
  const handleFontSizeChange = useCallback((size: number) => {
    setFontSize(size)
  }, [])

  const handleTextColorChange = useCallback((color: string) => {
    setTextColor(color)
  }, [])

  const handleBackgroundColorChange = useCallback((color: string) => {
    setBackgroundColor(color)
  }, [])

  // Prepare error message for ImagePreview
  const previewError = useMemo(() => {
    if (error) {
      return error.message
    }
    if (fontLoadError && fontLoadStatus === 'error') {
      return `Font loading failed: ${fontLoadError}`
    }
    return null
  }, [error, fontLoadError, fontLoadStatus])

  // Determine if preview is loading
  const previewLoading = isLoading || fontLoadStatus === 'loading'

  return (
    <div className={`text-image-generator ${className}`.trim()} data-testid={testId}>
      <div className="text-image-generator__controls">
        <div className="text-image-generator__section">
          <h3 className="text-image-generator__section-title">Text Input</h3>
          <TextInput
            value={text}
            onChange={handleTextChange}
            ariaLabel="Text to render as image"
            placeholder="Enter your text here..."
            maxLength={10000}
          />
        </div>

        <div className="text-image-generator__section">
          <h3 className="text-image-generator__section-title">Font Settings</h3>
          <FontInput
            value={fontUrl}
            onChange={handleFontUrlChange}
            loadStatus={fontLoadStatus}
            error={fontLoadError}
            placeholder="Enter font URL (e.g., https://fonts.googleapis.com/css2?family=Roboto)"
          />
        </div>

        <div className="text-image-generator__section">
          <h3 className="text-image-generator__section-title">Style Controls</h3>
          <StyleControls
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            textColor={textColor}
            onTextColorChange={handleTextColorChange}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={handleBackgroundColorChange}
          />
        </div>
      </div>

      <div className="text-image-generator__preview">
        <h3 className="text-image-generator__section-title">Preview</h3>
        <ImagePreview
          imageDataUrl={imageData?.dataUrl || null}
          isLoading={previewLoading}
          error={previewError}
        />
      </div>

      <div className="text-image-generator__export">
        <ExportButtons
          svg={imageData?.svg || null}
          dataUrl={imageData?.dataUrl || null}
          blob={imageData?.blob || null}
          isExporting={isLoading}
        />
      </div>
    </div>
  )
}

