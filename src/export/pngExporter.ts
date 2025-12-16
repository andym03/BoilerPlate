import type { Shape } from '@/shapes/types';
import type { CanvasSize } from '@/canvas/types';
import type { Layer } from '@/layers/types';
import { renderRectangle } from '@/shapes/Rectangle';
import { renderCircle } from '@/shapes/Circle';
import { renderTriangle } from '@/shapes/Triangle';
import { renderStar } from '@/shapes/Star';

/**
 * Renders a shape on a canvas context
 */
function renderShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
  switch (shape.type) {
    case 'rectangle':
      renderRectangle(ctx, shape);
      break;
    case 'circle':
      renderCircle(ctx, shape);
      break;
    case 'triangle':
      renderTriangle(ctx, shape);
      break;
    case 'star':
      renderStar(ctx, shape);
      break;
  }
}

/**
 * Exports canvas shapes to PNG format
 * Creates an offscreen canvas, renders all shapes, and returns the data URL
 * @param shapes Array of shapes to export
 * @param layers Array of layers defining render order
 * @param canvasSize Canvas dimensions
 * @param backgroundColor Background fill color (default: '#ffffff')
 * @returns Promise that resolves to PNG data URL
 */
export async function exportToPNG(
  shapes: Shape[],
  layers: Layer[],
  canvasSize: CanvasSize,
  backgroundColor: string = '#ffffff'
): Promise<string> {
  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context for PNG export');
  }
  
  // Clear canvas with specified background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
  
  // Sort layers by order (lowest first) to maintain layer order
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
  const shapeMap = new Map(shapes.map((s) => [s.id, s]));
  
  // Render each shape in layer order
  for (const layer of sortedLayers) {
    const shape = shapeMap.get(layer.shapeId);
    if (shape) {
      renderShape(ctx, shape);
    }
  }
  
  // Render any shapes without layers (shouldn't happen, but safety check)
  const shapesWithLayers = new Set(layers.map((l) => l.shapeId));
  for (const shape of shapes) {
    if (!shapesWithLayers.has(shape.id)) {
      renderShape(ctx, shape);
    }
  }
  
  // Convert canvas to PNG data URL
  return canvas.toDataURL('image/png');
}

/**
 * Downloads PNG content as a file
 * @param dataUrl PNG data URL
 * @param filename Filename for the download (without extension)
 */
export function downloadPNG(dataUrl: string, filename: string = 'canvas'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
