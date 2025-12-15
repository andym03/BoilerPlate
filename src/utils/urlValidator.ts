/**
 * URL validation utilities for font URLs
 */

export interface UrlValidationResult {
  isValid: boolean
  error?: string
  sanitizedUrl?: string
}

export interface FontUrlValidationResult extends UrlValidationResult {
  isAccessible?: boolean
}

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }

  try {
    const parsedUrl = new URL(url)
    // Only allow HTTP and HTTPS protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Sanitizes a URL and validates it
 */
export function sanitizeUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return {
      isValid: false,
      error: 'URL cannot be empty',
    }
  }

  const trimmedUrl = url.trim()

  // Check for dangerous protocols (javascript:, data:, etc.)
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmedUrl.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return {
        isValid: false,
        error: `Dangerous protocol detected: ${protocol}`,
      }
    }
  }

  // Validate URL format
  if (!isValidUrl(trimmedUrl)) {
    return {
      isValid: false,
      error: 'Invalid URL format. Only HTTP and HTTPS URLs are allowed.',
    }
  }

  return {
    isValid: true,
    sanitizedUrl: trimmedUrl,
  }
}

/**
 * Validates a font URL format and checks accessibility
 */
export async function validateFontUrl(url: string): Promise<FontUrlValidationResult> {
  // First validate URL format
  const sanitized = sanitizeUrl(url)
  if (!sanitized.isValid) {
    return {
      isValid: false,
      isAccessible: false,
      error: sanitized.error,
    }
  }

  // Check accessibility by attempting to fetch the URL
  try {
    const response = await fetch(sanitized.sanitizedUrl!, {
      method: 'HEAD',
      mode: 'cors', // Use cors mode to detect CORS errors
    })

    // If we get here, the URL is accessible
    return {
      isValid: true,
      isAccessible: true,
      sanitizedUrl: sanitized.sanitizedUrl,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // If it's a CORS error, mark as invalid/not accessible
    if (errorMessage.includes('CORS') || errorMessage.includes('cors') || errorMessage.includes('Failed to fetch')) {
      return {
        isValid: false,
        isAccessible: false,
        sanitizedUrl: sanitized.sanitizedUrl,
        error: 'CORS policy may prevent font loading',
      }
    }

    return {
      isValid: false,
      isAccessible: false,
      sanitizedUrl: sanitized.sanitizedUrl,
      error: `URL is not accessible: ${errorMessage}`,
    }
  }
}

