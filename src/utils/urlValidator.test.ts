import { isValidUrl, sanitizeUrl, validateFontUrl } from './urlValidator'

export interface UrlValidationResult {
  isValid: boolean
  error?: string
  sanitizedUrl?: string
}

export interface FontUrlValidationResult extends UrlValidationResult {
  isAccessible?: boolean
}

describe('urlValidator', () => {
  describe('isValidUrl', () => {
    it('should validate HTTP URLs', () => {
      expect(isValidUrl('http://example.com/font.woff2')).toBe(true)
    })

    it('should validate HTTPS URLs', () => {
      expect(isValidUrl('https://example.com/font.woff2')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })

    it('should reject non-HTTP(S) protocols', () => {
      expect(isValidUrl('ftp://example.com/font.woff2')).toBe(false)
      expect(isValidUrl('file:///path/to/font.woff2')).toBe(false)
    })
  })

  describe('sanitizeUrl', () => {
    it('should return sanitized URL for valid input', () => {
      const result = sanitizeUrl('https://example.com/font.woff2')
      expect(result.sanitizedUrl).toBe('https://example.com/font.woff2')
      expect(result.isValid).toBe(true)
    })

    it('should handle URLs with query parameters', () => {
      const result = sanitizeUrl('https://example.com/font.woff2?v=1&family=Roboto')
      expect(result.sanitizedUrl).toBe('https://example.com/font.woff2?v=1&family=Roboto')
      expect(result.isValid).toBe(true)
    })

    it('should reject malicious URLs', () => {
      const result = sanitizeUrl('javascript:alert(1)')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle empty strings', () => {
      const result = sanitizeUrl('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateFontUrl', () => {
    it('should validate accessible font URLs', async () => {
      // Mock fetch for successful font URL
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'font/woff2' }),
      })

      const result = await validateFontUrl('https://example.com/font.woff2')
      expect(result.isValid).toBe(true)
      expect(result.isAccessible).toBe(true)
    })

    it('should reject inaccessible font URLs', async () => {
      // Mock fetch for failed request
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const result = await validateFontUrl('https://example.com/font.woff2')
      expect(result.isValid).toBe(false)
      expect(result.isAccessible).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject invalid URL format', async () => {
      const result = await validateFontUrl('not-a-url')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle CORS errors', async () => {
      // Mock fetch for CORS error
      global.fetch = jest.fn().mockRejectedValue(new Error('CORS policy'))

      const result = await validateFontUrl('https://example.com/font.woff2')
      expect(result.isValid).toBe(false)
      expect(result.isAccessible).toBe(false)
    })
  })
})

