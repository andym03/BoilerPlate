/**
 * Font loading utilities with caching support
 */

import { FontLoadResult } from '@/types/textImage'
import { validateFontUrl } from './urlValidator'
import { createError, handleError } from './errorHandler'
import { ErrorType } from '@/types/textImage'

// Font cache: maps font family name to FontFace instance
const fontCache = new Map<string, FontFace>()

/**
 * Default timeout for font loading (10 seconds)
 */
const DEFAULT_TIMEOUT = 10000

/**
 * Loads a font from a URL using the FontFace API
 */
export async function loadFont(
  fontUrl: string,
  fontFamily: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<FontLoadResult> {
  // Check cache first
  const cachedFont = getCachedFont(fontFamily)
  if (cachedFont) {
    return {
      success: true,
      fontFace: cachedFont,
      fontFamily,
      fontUrl,
    }
  }

  // Validate URL format
  const urlValidation = await validateFontUrl(fontUrl)
  if (!urlValidation.isValid) {
    return {
      success: false,
      error: urlValidation.error || 'Invalid font URL',
      fontFamily,
      fontUrl,
    }
  }

  const sanitizedUrl = urlValidation.sanitizedUrl!

  try {
    // Create FontFace instance
    const fontFace = new FontFace(fontFamily, `url(${sanitizedUrl})`)

    // Load font with timeout
    const loadPromise = fontFace.load()
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Font loading timeout'))
      }, timeout)
    })

    // Race between loading and timeout
    await Promise.race([loadPromise, timeoutPromise])

    // Add to document fonts
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.add(fontFace)
    }

    // Cache the font
    fontCache.set(fontFamily, fontFace)

    return {
      success: true,
      fontFace,
      fontFamily,
      fontUrl: sanitizedUrl,
    }
  } catch (error) {
    const handledError = handleError(error)
    
    // Determine error type
    let errorType = ErrorType.FONT_LOAD_FAILED
    if (handledError.message.includes('timeout')) {
      errorType = ErrorType.FONT_LOAD_TIMEOUT
    }

    return {
      success: false,
      error: handledError.message,
      fontFamily,
      fontUrl: sanitizedUrl,
    }
  }
}

/**
 * Gets a cached font by family name
 */
export function getCachedFont(fontFamily: string): FontFace | null {
  return fontCache.get(fontFamily) || null
}

/**
 * Clears the font cache
 */
export function clearFontCache(): void {
  fontCache.clear()
}

