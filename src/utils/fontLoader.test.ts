import { loadFont, getCachedFont, clearFontCache } from './fontLoader'
import { FontLoadResult } from '@/types/textImage'

/**
 * Interface for font loading utilities
 */
export interface FontLoader {
  loadFont: (
    fontUrl: string,
    fontFamily: string,
    timeout?: number
  ) => Promise<FontLoadResult>
  getCachedFont: (fontFamily: string) => FontFace | null
  clearFontCache: () => void
}

// Mock FontFace API
class MockFontFace {
  status: FontFaceLoadStatus = 'unloaded'
  family: string
  source: string

  constructor(family: string, source: string) {
    this.family = family
    this.source = source
  }

  async load(): Promise<FontFace> {
    this.status = 'loaded'
    return this
  }
}

describe('fontLoader', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearFontCache()
    // Mock FontFace API
    global.FontFace = MockFontFace as unknown as typeof FontFace
    // Mock document.fonts
    global.document.fonts = {
      add: jest.fn(),
      check: jest.fn().mockReturnValue(true),
    } as unknown as FontFaceSet
  })

  describe('loadFont', () => {
    it('should load font successfully', async () => {
      const result = await loadFont(
        'https://example.com/font.woff2',
        'CustomFont'
      )

      expect(result.success).toBe(true)
      expect(result.fontFace).toBeDefined()
      expect(result.fontFamily).toBe('CustomFont')
      expect(result.fontUrl).toBe('https://example.com/font.woff2')
      expect(result.error).toBeUndefined()
    })

    it('should cache loaded fonts', async () => {
      await loadFont('https://example.com/font.woff2', 'CustomFont')
      const cached = getCachedFont('CustomFont')
      expect(cached).toBeDefined()
    })

    it('should return cached font on subsequent loads', async () => {
      await loadFont('https://example.com/font.woff2', 'CustomFont')
      const result = await loadFont('https://example.com/font.woff2', 'CustomFont')
      expect(result.success).toBe(true)
      // Should use cached font
    })

    it('should handle font load failures', async () => {
      // Mock FontFace to throw error
      const MockFailingFontFace = class extends MockFontFace {
        async load(): Promise<FontFace> {
          throw new Error('Font load failed')
        }
      }
      global.FontFace = MockFailingFontFace as unknown as typeof FontFace

      const result = await loadFont(
        'https://example.com/invalid.woff2',
        'InvalidFont'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.fontFace).toBeUndefined()
    })

    it('should handle timeout', async () => {
      // Mock FontFace that never resolves
      const MockSlowFontFace = class extends MockFontFace {
        async load(): Promise<FontFace> {
          return new Promise(() => {
            // Never resolves
          })
        }
      }
      global.FontFace = MockSlowFontFace as unknown as typeof FontFace

      const result = await loadFont(
        'https://example.com/slow.woff2',
        'SlowFont',
        100 // 100ms timeout
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle network errors', async () => {
      // Mock fetch to fail
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const result = await loadFont(
        'https://example.com/missing.woff2',
        'MissingFont'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('getCachedFont', () => {
    it('should return null for uncached fonts', () => {
      const cached = getCachedFont('UncachedFont')
      expect(cached).toBeNull()
    })

    it('should return cached font after loading', async () => {
      await loadFont('https://example.com/font.woff2', 'CachedFont')
      const cached = getCachedFont('CachedFont')
      expect(cached).toBeDefined()
      expect(cached?.family).toBe('CachedFont')
    })
  })

  describe('clearFontCache', () => {
    it('should clear all cached fonts', async () => {
      await loadFont('https://example.com/font1.woff2', 'Font1')
      await loadFont('https://example.com/font2.woff2', 'Font2')

      expect(getCachedFont('Font1')).toBeDefined()
      expect(getCachedFont('Font2')).toBeDefined()

      clearFontCache()

      expect(getCachedFont('Font1')).toBeNull()
      expect(getCachedFont('Font2')).toBeNull()
    })
  })
})

