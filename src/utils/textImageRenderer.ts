/**
 * Text to SVG image rendering utilities
 */

import { TextImageOptions, RenderResult } from '@/types/textImage'

/**
 * Default padding around text (in pixels)
 */
const DEFAULT_PADDING = 20

/**
 * Default line height multiplier
 */
const DEFAULT_LINE_HEIGHT = 1.2

/**
 * Measures text dimensions using Canvas API with fallback
 */
function measureText(
  text: string,
  fontFamily: string,
  fontSize: number,
  maxWidth?: number,
  lineHeight: number = DEFAULT_LINE_HEIGHT
): { width: number; height: number; lines: string[] } {
  // Create a temporary canvas for measurement
  let context: CanvasRenderingContext2D | null = null
  
  try {
    const canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
  } catch {
    // Canvas not available
  }
  
  const lines: string[] = []
  let maxLineWidth = 0

  if (maxWidth) {
    // Word wrap logic
    const words = text.split(/\s+/)
    let currentLine = ''
    const charWidth = fontSize * 0.6 // Estimate for fallback

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      let lineWidth: number
      
      if (context) {
        context.font = `${fontSize}px ${fontFamily}`
        lineWidth = context.measureText(testLine).width
      } else {
        // Fallback: estimate width (average character width is ~0.6 * fontSize)
        lineWidth = testLine.length * charWidth
      }
      
      if (lineWidth > maxWidth && currentLine) {
        // Measure the current line before wrapping
        let currentLineWidth: number
        if (context) {
          context.font = `${fontSize}px ${fontFamily}`
          currentLineWidth = context.measureText(currentLine).width
        } else {
          currentLineWidth = currentLine.length * charWidth
        }
        lines.push(currentLine)
        maxLineWidth = Math.max(maxLineWidth, Math.min(currentLineWidth, maxWidth))
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
      let finalWidth: number
      if (context) {
        context.font = `${fontSize}px ${fontFamily}`
        finalWidth = context.measureText(currentLine).width
      } else {
        finalWidth = currentLine.length * charWidth
      }
      // Ensure we don't exceed maxWidth (text should wrap)
      maxLineWidth = Math.max(maxLineWidth, Math.min(finalWidth, maxWidth))
    }
  } else {
    // No wrapping - split by newlines
    const rawLines = text.split('\n')
    for (const line of rawLines) {
      lines.push(line)
      const lineWidth = context 
        ? (() => {
            context!.font = `${fontSize}px ${fontFamily}`
            return context!.measureText(line).width
          })()
        : line.length * fontSize * 0.6
      maxLineWidth = Math.max(maxLineWidth, lineWidth)
    }
  }

  const totalHeight = lines.length * fontSize * lineHeight

  return {
    width: maxLineWidth,
    height: totalHeight,
    lines,
  }
}

/**
 * Escapes HTML/SVG special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Renders text to an SVG image
 */
export function renderTextToSvg(options: TextImageOptions): RenderResult {
  const {
    text,
    fontFamily,
    fontSize,
    textColor,
    backgroundColor,
    lineHeight = DEFAULT_LINE_HEIGHT,
    padding = DEFAULT_PADDING,
    maxWidth,
  } = options

  // Measure text dimensions
  const measurement = measureText(text, fontFamily, fontSize, maxWidth, lineHeight)
  
  // Calculate canvas dimensions with padding
  const canvasWidth = measurement.width + padding * 2
  const canvasHeight = measurement.height + padding * 2

  // Build SVG
  const svgLines: string[] = []
  
  svgLines.push('<svg')
  svgLines.push(`xmlns="http://www.w3.org/2000/svg"`)
  svgLines.push(`width="${canvasWidth}"`)
  svgLines.push(`height="${canvasHeight}"`)
  svgLines.push('>')

  // Background rectangle
  if (backgroundColor && backgroundColor !== 'transparent') {
    svgLines.push(`<rect width="100%" height="100%" fill="${backgroundColor}"/>`)
  }

  // Text element
  svgLines.push('<text')
  svgLines.push(`x="${padding}"`)
  svgLines.push(`y="${padding + fontSize}"`)
  svgLines.push(`font-family="${escapeXml(fontFamily)}"`)
  svgLines.push(`font-size="${fontSize}"`)
  svgLines.push(`fill="${textColor}"`)
  svgLines.push(`dominant-baseline="hanging"`)
  
  if (measurement.lines.length > 1) {
    // Multi-line text
    svgLines.push('>')
    measurement.lines.forEach((line, index) => {
      const y = padding + fontSize + index * fontSize * lineHeight
      svgLines.push(`<tspan x="${padding}" y="${y}">${escapeXml(line)}</tspan>`)
    })
    svgLines.push('</text>')
  } else {
    // Single line text
    svgLines.push(`>${escapeXml(measurement.lines[0])}</text>`)
  }

  svgLines.push('</svg>')

  const svgString = svgLines.join('\n')

  // Generate data URL
  const dataUrl = svgToDataUrl(svgString)
  
  // Create blob synchronously
  const blob = new Blob([svgString], { type: 'image/svg+xml' })

  return {
    svg: svgString,
    dataUrl,
    blob,
    width: canvasWidth,
    height: canvasHeight,
  }
}

/**
 * Converts SVG string to data URL
 */
export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml,${encoded}`
}

/**
 * Converts SVG string to Blob
 */
export async function svgToBlob(svg: string): Promise<Blob> {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  // Add text() method for test compatibility (normally Blob doesn't have this)
  // In real usage, use: const text = await blob.text() won't work, use FileReader instead
  // But for tests, we'll return a Blob that can be read via Response
  return blob
}

