import {
  createError,
  getErrorMessage,
  isTextImageError,
  handleError,
} from './errorHandler'
import { ErrorType, TextImageError } from '@/types/textImage'

/**
 * Interface for error handling utilities
 */
export interface ErrorHandler {
  createError: (
    type: ErrorType,
    message: string,
    originalError?: Error | unknown,
    context?: Record<string, unknown>
  ) => TextImageError
  getErrorMessage: (error: unknown) => string
  isTextImageError: (error: unknown) => error is TextImageError
  handleError: (error: unknown) => TextImageError
}

describe('errorHandler', () => {
  describe('createError', () => {
    it('should create a TextImageError with all properties', () => {
      const error = createError(
        ErrorType.FONT_LOAD_FAILED,
        'Font failed to load',
        new Error('Network error'),
        { fontUrl: 'https://example.com/font.woff2' }
      )

      expect(error.type).toBe(ErrorType.FONT_LOAD_FAILED)
      expect(error.message).toBe('Font failed to load')
      expect(error.originalError).toBeInstanceOf(Error)
      expect(error.context).toEqual({ fontUrl: 'https://example.com/font.woff2' })
    })

    it('should create error without original error', () => {
      const error = createError(ErrorType.INVALID_URL, 'Invalid URL format')
      expect(error.type).toBe(ErrorType.INVALID_URL)
      expect(error.message).toBe('Invalid URL format')
      expect(error.originalError).toBeUndefined()
    })

    it('should create error without context', () => {
      const error = createError(ErrorType.INVALID_TEXT, 'Text cannot be empty')
      expect(error.type).toBe(ErrorType.INVALID_TEXT)
      expect(error.message).toBe('Text cannot be empty')
      expect(error.context).toBeUndefined()
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from TextImageError', () => {
      const error = createError(ErrorType.RENDER_ERROR, 'Rendering failed')
      expect(getErrorMessage(error)).toBe('Rendering failed')
    })

    it('should extract message from Error object', () => {
      const error = new Error('Something went wrong')
      expect(getErrorMessage(error)).toBe('Something went wrong')
    })

    it('should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error')
    })

    it('should handle unknown error types', () => {
      expect(getErrorMessage({})).toBe('An unknown error occurred')
      expect(getErrorMessage(null)).toBe('An unknown error occurred')
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred')
    })
  })

  describe('isTextImageError', () => {
    it('should identify TextImageError objects', () => {
      const error = createError(ErrorType.FONT_LOAD_FAILED, 'Font failed')
      expect(isTextImageError(error)).toBe(true)
    })

    it('should reject non-TextImageError objects', () => {
      expect(isTextImageError(new Error('Regular error'))).toBe(false)
      expect(isTextImageError('string error')).toBe(false)
      expect(isTextImageError({})).toBe(false)
      expect(isTextImageError(null)).toBe(false)
    })
  })

  describe('handleError', () => {
    it('should return TextImageError as-is', () => {
      const error = createError(ErrorType.INVALID_URL, 'Invalid URL')
      const handled = handleError(error)
      expect(handled).toBe(error)
    })

    it('should wrap Error objects', () => {
      const error = new Error('Network error')
      const handled = handleError(error)
      expect(handled.type).toBe(ErrorType.UNKNOWN_ERROR)
      expect(handled.message).toBe('Network error')
      expect(handled.originalError).toBe(error)
    })

    it('should handle string errors', () => {
      const handled = handleError('String error')
      expect(handled.type).toBe(ErrorType.UNKNOWN_ERROR)
      expect(handled.message).toBe('String error')
    })

    it('should handle unknown error types', () => {
      const handled = handleError({ someProperty: 'value' })
      expect(handled.type).toBe(ErrorType.UNKNOWN_ERROR)
      expect(handled.message).toBe('An unknown error occurred')
    })
  })
})

