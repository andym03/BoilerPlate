import React from 'react'
import './TextInput.css'

/**
 * Props for the TextInput component
 */
export interface TextInputProps {
  /** Current text value */
  value: string
  /** Callback when text changes */
  onChange: (value: string) => void
  /** Accessible label for the text input */
  ariaLabel?: string
  /** Placeholder text */
  placeholder?: string
  /** Maximum character count (optional) */
  maxLength?: number
  /** Whether the input is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * TextInput component for multi-line text input with character count
 */
export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  ariaLabel,
  placeholder = 'Enter your text here...',
  maxLength,
  disabled = false,
  className = '',
  'data-testid': testId,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      return
    }
    onChange(newValue)
  }

  const characterCount = value.length
  const showCharacterCount = maxLength !== undefined
  const countId = testId ? `${testId}-count` : 'text-input-count'
  
  // Determine warning/error state based on character count
  const getCountDataAttributes = () => {
    if (!maxLength) return {}
    
    const percentage = (characterCount / maxLength) * 100
    
    // Error: at or over limit (100%+)
    if (characterCount >= maxLength) {
      return { 'data-error': 'true' }
    }
    
    // Warning: approaching limit (80-99%)
    if (percentage >= 80) {
      return { 'data-warning': 'true' }
    }
    
    return {}
  }

  return (
    <div className={`text-input ${className}`.trim()} data-testid={testId}>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="text-input__textarea"
        rows={6}
        aria-label={ariaLabel}
        aria-describedby={showCharacterCount ? countId : undefined}
        aria-valuenow={showCharacterCount ? characterCount : undefined}
        aria-valuemax={maxLength}
        aria-valuemin={0}
      />
      {showCharacterCount && (
        <div 
          id={countId}
          className="text-input__count" 
          role="status"
          aria-live="polite"
          aria-atomic="true"
          {...getCountDataAttributes()}
        >
          {characterCount}/{maxLength}
        </div>
      )}
    </div>
  )
}

