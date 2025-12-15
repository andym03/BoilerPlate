import { renderTextToSvg, svgToDataUrl, svgToBlob } from './textImageRenderer'
import { TextImageOptions, RenderResult } from '../types/textImage'

/**
 * Interface for text image rendering utilities
 */
export interface TextImageRenderer {
  renderTextToSvg: (options: TextImageOptions) => RenderResult
  svgToDataUrl: (svg: string) => string
  svgToBlob: (svg: string) => Promise<Blob>
}

describe('textImageRenderer', () => {
  describe('renderTextToSvg', () => {
    it('should render single-line text', () => {
      const options: TextImageOptions = {
        text: 'Hello World',
        fontFamily: 'Arial',
        fontSize: 24,
        textColor: '#000000',
        backgroundColor: '#ffffff',
      }

      const result = renderTextToSvg(options)

      expect(result.svg).toContain('Hello World')
      expect(result.svg).toContain('font-family="Arial"')
      expect(result.svg).toContain('font-size="24"')
      expect(result.svg).toContain('fill="#000000"')
      expect(result.width).toBeGreaterThan(0)
      expect(result.height).toBeGreaterThan(0)
    })

    it('should render multi-line text', () => {
      const options: TextImageOptions = {
        text: 'Line 1\nLine 2\nLine 3',
        fontFamily: 'Arial',
        fontSize: 20,
        textColor: '#333333',
        backgroundColor: '#ffffff',
      }

      const result = renderTextToSvg(options)

      expect(result.svg).toContain('Line 1')
      expect(result.svg).toContain('Line 2')
      expect(result.svg).toContain('Line 3')
      expect(result.height).toBeGreaterThan(result.width) // Multi-line should be taller than wide
    })

    it('should apply custom padding', () => {
      const options: TextImageOptions = {
        text: 'Test',
        fontFamily: 'Arial',
        fontSize: 16,
        textColor: '#000000',
        backgroundColor: '#ffffff',
        padding: 40,
      }

      const result = renderTextToSvg(options)

      expect(result.width).toBeGreaterThan(40 * 2) // Should include padding
      expect(result.height).toBeGreaterThan(40 * 2)
    })

    it('should apply custom line height', () => {
      const options: TextImageOptions = {
        text: 'Line 1\nLine 2',
        fontFamily: 'Arial',
        fontSize: 20,
        textColor: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: 1.5,
      }

      const result = renderTextToSvg(options)
      expect(result.svg).toContain('1.5') // Line height should be in SVG
    })

    it('should handle transparent background', () => {
      const options: TextImageOptions = {
        text: 'Test',
        fontFamily: 'Arial',
        fontSize: 16,
        textColor: '#000000',
        backgroundColor: 'transparent',
      }

      const result = renderTextToSvg(options)
      expect(result.svg).toContain('transparent')
    })

    it('should handle special characters and Unicode', () => {
      const options: TextImageOptions = {
        text: 'Hello 世界 🌍',
        fontFamily: 'Arial',
        fontSize: 20,
        textColor: '#000000',
        backgroundColor: '#ffffff',
      }

      const result = renderTextToSvg(options)
      expect(result.svg).toContain('Hello 世界 🌍')
    })

    it('should respect maxWidth for text wrapping', () => {
      const longText = 'This is a very long text that should wrap when maxWidth is set'
      const options: TextImageOptions = {
        text: longText,
        fontFamily: 'Arial',
        fontSize: 16,
        textColor: '#000000',
        backgroundColor: '#ffffff',
        maxWidth: 200,
      }

      const result = renderTextToSvg(options)
      // Width should be constrained by maxWidth + padding
      expect(result.width).toBeLessThanOrEqual(200 + (options.padding || 20) * 2)
    })

    it('should generate valid SVG structure', () => {
      const options: TextImageOptions = {
        text: 'Test',
        fontFamily: 'Arial',
        fontSize: 16,
        textColor: '#000000',
        backgroundColor: '#ffffff',
      }

      const result = renderTextToSvg(options)

      expect(result.svg).toMatch(/^<svg/)
      expect(result.svg).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(result.svg).toContain(`width="${result.width}"`)
      expect(result.svg).toContain(`height="${result.height}"`)
    })
  })

  describe('svgToDataUrl', () => {
    it('should convert SVG to data URL', () => {
      const svg = '<svg><text>Test</text></svg>'
      const dataUrl = svgToDataUrl(svg)

      expect(dataUrl).toMatch(/^data:image\/svg\+xml/)
      expect(dataUrl).toContain(encodeURIComponent(svg))
    })

    it('should handle empty SVG', () => {
      const dataUrl = svgToDataUrl('')
      expect(dataUrl).toMatch(/^data:image\/svg\+xml/)
    })
  })

  describe('svgToBlob', () => {
    it('should convert SVG to Blob', async () => {
      const svg = '<svg><text>Test</text></svg>'
      const blob = await svgToBlob(svg)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/svg+xml')
    })

    it('should create blob with correct content', async () => {
      const svg = '<svg><text>Test Content</text></svg>'
      const blob = await svgToBlob(svg)

      const text = await blob.text()
      expect(text).toBe(svg)
    })
  })
})

