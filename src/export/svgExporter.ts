import type { Shape, RectangleShape, CircleShape, TriangleShape, StarShape } from '@/shapes/types';
import type { CanvasSize } from '@/canvas/types';
import type { Layer } from '@/layers/types';

/**
 * Converts a rectangle shape to SVG element string
 */
function rectangleToSVG(shape: RectangleShape): string {
  return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fillColor}" />`;
}

/**
 * Converts a circle shape to SVG element string
 */
function circleToSVG(shape: CircleShape): string {
  const centerX = shape.x + shape.radius;
  const centerY = shape.y + shape.radius;
  return `<circle cx="${centerX}" cy="${centerY}" r="${shape.radius}" fill="${shape.fillColor}" />`;
}

/**
 * Converts a triangle shape to SVG element string
 */
function triangleToSVG(shape: TriangleShape): string {
  const x1 = shape.x + shape.width / 2; // top point
  const y1 = shape.y;
  const x2 = shape.x; // bottom left
  const y2 = shape.y + shape.height;
  const x3 = shape.x + shape.width; // bottom right
  const y3 = shape.y + shape.height;
  
  return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${shape.fillColor}" />`;
}

/**
 * Converts a star shape to SVG element string
 */
function starToSVG(shape: StarShape): string {
  const centerX = shape.x + shape.outerRadius;
  const centerY = shape.y + shape.outerRadius;
  
  const points: string[] = [];
  for (let i = 0; i < shape.points * 2; i++) {
    const angle = (i * Math.PI) / shape.points;
    const radius = i % 2 === 0 ? shape.outerRadius : shape.innerRadius;
    const px = centerX + Math.cos(angle) * radius;
    const py = centerY + Math.sin(angle) * radius;
    points.push(`${px},${py}`);
  }
  
  return `<polygon points="${points.join(' ')}" fill="${shape.fillColor}" />`;
}

/**
 * Converts a single shape to SVG element string
 */
function shapeToSVG(shape: Shape): string {
  switch (shape.type) {
    case 'rectangle':
      return rectangleToSVG(shape);
    case 'circle':
      return circleToSVG(shape);
    case 'triangle':
      return triangleToSVG(shape);
    case 'star':
      return starToSVG(shape);
  }
}

/**
 * Exports canvas shapes to SVG format
 * @param shapes Array of shapes to export
 * @param layers Array of layers defining render order
 * @param canvasSize Canvas dimensions
 * @returns SVG string
 */
export function exportToSVG(shapes: Shape[], layers: Layer[], canvasSize: CanvasSize): string {
  // Sort layers by order (lowest first) to maintain layer order
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
  const shapeMap = new Map(shapes.map((s) => [s.id, s]));
  
  // Get shapes in layer order
  const orderedShapes: Shape[] = [];
  for (const layer of sortedLayers) {
    const shape = shapeMap.get(layer.shapeId);
    if (shape) {
      orderedShapes.push(shape);
    }
  }
  
  // Add any shapes without layers (shouldn't happen, but safety check)
  const shapesWithLayers = new Set(layers.map((l) => l.shapeId));
  for (const shape of shapes) {
    if (!shapesWithLayers.has(shape.id)) {
      orderedShapes.push(shape);
    }
  }
  
  const svgShapes = orderedShapes.map(shapeToSVG).join('\n  ');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvasSize.width}" height="${canvasSize.height}" xmlns="http://www.w3.org/2000/svg">
  ${svgShapes}
</svg>`;
}

/**
 * Downloads SVG content as a file
 * @param svgContent SVG string content
 * @param filename Filename for the download (without extension)
 */
export function downloadSVG(svgContent: string, filename: string = 'canvas'): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
