import React from 'react'
import './StyleControls.css'

/**
 * Props for the StyleControls component
 */
export interface StyleControlsProps {
  /** Current font size in pixels */
  fontSize: number
  /** Callback when font size changes */
  onFontSizeChange: (size: number) => void
  /** Current text color (CSS color value) */
  textColor: string
  /** Callback when text color changes */
  onTextColorChange: (color: string) => void
  /** Current background color (CSS color value) */
  backgroundColor: string
  /** Callback when background color changes */
  onBackgroundColorChange: (color: string) => void
  /** Minimum font size (default: 8) */
  minFontSize?: number
  /** Maximum font size (default: 200) */
  maxFontSize?: number
  /** Additional CSS class name */
  className?: string
  /** Test ID for testing */
  'data-testid'?: string
}

/**
 * StyleControls component for font size, text color, and background color controls
 */
export const StyleControls: React.FC<StyleControlsProps> = ({
  fontSize,
  onFontSizeChange,
  textColor,
  onTextColorChange,
  backgroundColor,
  onBackgroundColorChange,
  minFontSize = 8,
  maxFontSize = 200,
  className = '',
  'data-testid': testId,
}) => {
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10)
    if (!isNaN(newSize) && newSize >= minFontSize && newSize <= maxFontSize) {
      onFontSizeChange(newSize)
    }
  }

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTextColorChange(e.target.value)
  }

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBackgroundColorChange(e.target.value)
  }

  return (
    <div className={`style-controls ${className}`.trim()} data-testid={testId || 'style-controls'}>
      <div className="style-controls__group">
        <label htmlFor="font-size-input" className="style-controls__label">
          Font Size
        </label>
        <div className="style-controls__input-wrapper">
          <input
            id="font-size-input"
            type="number"
            min={minFontSize}
            max={maxFontSize}
            value={fontSize}
            onChange={handleFontSizeChange}
            className="style-controls__input style-controls__input--number"
            aria-label="Font size in pixels"
          />
          <span className="style-controls__unit">px</span>
        </div>
      </div>

      <div className="style-controls__group">
        <label htmlFor="text-color-input" className="style-controls__label">
          Text Color
        </label>
        <div className="style-controls__input-wrapper">
          <input
            id="text-color-input"
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="style-controls__input style-controls__input--color"
            aria-label="Text color"
          />
          <input
            type="text"
            value={textColor}
            onChange={handleTextColorChange}
            className="style-controls__input style-controls__input--text"
            placeholder="#000000"
            aria-label="Text color value"
          />
        </div>
      </div>

      <div className="style-controls__group">
        <label htmlFor="background-color-input" className="style-controls__label">
          Background Color
        </label>
        <div className="style-controls__input-wrapper">
          <input
            id="background-color-input"
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="style-controls__input style-controls__input--color"
            aria-label="Background color"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="style-controls__input style-controls__input--text"
            placeholder="#ffffff"
            aria-label="Background color value"
          />
        </div>
      </div>
    </div>
  )
}

