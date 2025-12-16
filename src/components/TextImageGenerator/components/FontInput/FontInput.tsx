import React from 'react'
import './FontInput.css'

/**
 * Font loading status
 */
export type FontLoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

/**
 * Props for the FontInput component
 */
export interface FontInputProps {
  /** Current font URL value */
  value: string
  /** Callback when font URL changes */
  onChange: (url: string) => void
  /** Font loading status */
  loadStatus: FontLoadStatus
  /** Error message if font loading failed */
  error?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * FontInput component for font URL input with loading status indicator
 */
export const FontInput: React.FC<FontInputProps> = ({
  value,
  onChange,
  loadStatus,
  error,
  placeholder = 'Enter font URL (e.g., https://example.com/font.woff2)',
  disabled = false,
  className = '',
  'data-testid': testId,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const getStatusMessage = (): string | null => {
    switch (loadStatus) {
      case 'loading':
        return 'Loading...'
      case 'loaded':
        return 'Loaded'
      case 'error':
        return 'Error'
      default:
        return null
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <div className={`font-input ${className}`.trim()} data-testid={testId}>
      <div className="font-input__wrapper">
        <input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="font-input__input"
          aria-label="Font URL input"
        />
        {statusMessage && (
          <span
            className={`font-input__status font-input__status--${loadStatus}`}
            aria-live="polite"
          >
            {statusMessage}
          </span>
        )}
      </div>
      {loadStatus === 'error' && error && (
        <div className="font-input__error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

