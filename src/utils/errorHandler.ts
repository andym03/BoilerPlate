/**
 * Error handling utilities for text image operations
 */

import { ErrorType, TextImageError } from '@/types/textImage'

/**
 * Creates a standardized TextImageError object
 */
export function createError(
  type: ErrorType,
  message: string,
  originalError?: Error | unknown,
  context?: Record<string, unknown>
): TextImageError {
  return {
    type,
    message,
    originalError,
    context,
  }
}

/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isTextImageError(error) || error instanceof Error) {
    return (error as Error).message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}

/**
 * Type guard to check if an error is a TextImageError
 */
export function isTextImageError(error: unknown): error is TextImageError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    typeof (error as TextImageError).type === 'string' &&
    typeof (error as TextImageError).message === 'string'
  )
}

/**
 * Handles any error and converts it to a TextImageError
 */
export function handleError(error: unknown): TextImageError {
  // If it's already a TextImageError, return as-is
  if (isTextImageError(error)) {
    return error
  }

  // If it's a standard Error, wrap it
  if (error instanceof Error) {
    return createError(ErrorType.UNKNOWN_ERROR, error.message, error)
  }

  // If it's a string, create error with that message
  if (typeof error === 'string') {
    return createError(ErrorType.UNKNOWN_ERROR, error)
  }

  // For unknown error types, create a generic error
  return createError(ErrorType.UNKNOWN_ERROR, 'An unknown error occurred', error)
}

