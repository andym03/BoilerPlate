export interface TextImageOptions {
  /** The text content to render (supports multi-line) */
  text: string
  /** Font family name (should match loaded font) */
  fontFamily: string
  /** Font size in pixels */
  fontSize: number
  /** Text color (CSS color value) */
  textColor: string
  /** Background color (CSS color value, can include transparency) */
  backgroundColor: string
  /** Line height multiplier (default: 1.2) */
  lineHeight?: number
  /** Padding around text in pixels (default: 20) */
  padding?: number
  /** Maximum width for text wrapping in pixels (optional) */
  maxWidth?: number
}

export interface RenderResult {
  /** SVG string representation */
  svg: string
  /** Data URL for preview/display */
  dataUrl: string
  /** Blob for programmatic use */
  blob: Blob
  /** Width of the rendered image in pixels */
  width: number
  /** Height of the rendered image in pixels */
  height: number
}

export interface FontLoadResult {
  /** Whether the font loaded successfully */
  success: boolean
  /** The loaded FontFace object (if successful) */
  fontFace?: FontFace
  /** Error message (if failed) */
  error?: string
  /** Font family name */
  fontFamily: string
  /** Font URL that was loaded */
  fontUrl: string
}

/**
 * Standardized error types for text image operations
 */
export enum ErrorType {
  /** Invalid or malformed URL */
  INVALID_URL = 'INVALID_URL',
  /** Font failed to load (network error, CORS, etc.) */
  FONT_LOAD_FAILED = 'FONT_LOAD_FAILED',
  /** Font loading timeout */
  FONT_LOAD_TIMEOUT = 'FONT_LOAD_TIMEOUT',
  /** Invalid text input */
  INVALID_TEXT = 'INVALID_TEXT',
  /** Rendering error */
  RENDER_ERROR = 'RENDER_ERROR',
  /** Unknown error */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Standardized error object
 */
export interface TextImageError {
  /** Error type */
  type: ErrorType
  /** Human-readable error message */
  message: string
  /** Original error (if any) */
  originalError?: Error | unknown
  /** Additional context data */
  context?: Record<string, unknown>
}

