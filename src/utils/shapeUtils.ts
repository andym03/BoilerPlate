import type { Shape, RectangleShape, CircleShape, TriangleShape, StarShape } from '@/shapes/types';
import type { Layer } from '@/layers/types';

/**
 * Check if a point is inside a rectangle shape
 */
function isPointInRectangle(shape: RectangleShape, x: number, y: number): boolean {
  return (
    x >= shape.x &&
    x <= shape.x + shape.width &&
    y >= shape.y &&
    y <= shape.y + shape.height
  );
}

/**
 * Check if a point is inside a circle shape
 */
function isPointInCircle(shape: CircleShape, x: number, y: number): boolean {
  const centerX = shape.x + shape.radius;
  const centerY = shape.y + shape.radius;
  const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  return distance <= shape.radius;
}

/**
 * Check if a point is inside a triangle shape
 * Uses barycentric coordinates
 */
function isPointInTriangle(shape: TriangleShape, x: number, y: number): boolean {
  const x1 = shape.x + shape.width / 2; // top point
  const y1 = shape.y;
  const x2 = shape.x; // bottom left
  const y2 = shape.y + shape.height;
  const x3 = shape.x + shape.width; // bottom right
  const y3 = shape.y + shape.height;

  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
  const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
  const c = 1 - a - b;

  return a >= 0 && b >= 0 && c >= 0;
}

/**
 * Check if a point is inside a star shape
 * Uses a simple bounding box check (could be improved with path-based hit testing)
 */
function isPointInStar(shape: StarShape, x: number, y: number): boolean {
  // Use bounding box for simplicity
  const size = shape.outerRadius * 2;
  return (
    x >= shape.x &&
    x <= shape.x + size &&
    y >= shape.y &&
    y <= shape.y + size
  );
}

/**
 * Check if a point (x, y) is inside a shape
 * Returns the shape if the point is inside, null otherwise
 * Checks shapes in layer order (highest order first, i.e., top to bottom)
 */
export function getShapeAtPoint(shapes: Shape[], layers: Layer[], x: number, y: number): Shape | null {
  // Sort layers by order (highest first) to check top shapes first
  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);
  const shapeMap = new Map(shapes.map((s) => [s.id, s]));
  
  // Check shapes in layer order (top to bottom)
  for (const layer of sortedLayers) {
    const shape = shapeMap.get(layer.shapeId);
    if (!shape) continue;
    
    switch (shape.type) {
      case 'rectangle':
        if (isPointInRectangle(shape, x, y)) {
          return shape;
        }
        break;
      case 'circle':
        if (isPointInCircle(shape, x, y)) {
          return shape;
        }
        break;
      case 'triangle':
        if (isPointInTriangle(shape, x, y)) {
          return shape;
        }
        break;
      case 'star':
        if (isPointInStar(shape, x, y)) {
          return shape;
        }
        break;
    }
  }
  
  // Check shapes without layers (shouldn't happen, but safety check)
  const shapesWithLayers = new Set(layers.map((l) => l.shapeId));
  for (const shape of shapes) {
    if (!shapesWithLayers.has(shape.id)) {
      switch (shape.type) {
        case 'rectangle':
          if (isPointInRectangle(shape, x, y)) return shape;
          break;
        case 'circle':
          if (isPointInCircle(shape, x, y)) return shape;
          break;
        case 'triangle':
          if (isPointInTriangle(shape, x, y)) return shape;
          break;
        case 'star':
          if (isPointInStar(shape, x, y)) return shape;
          break;
      }
    }
  }
  
  return null;
}

/**
 * Get bounding box of a shape (for selection indicator)
 */
export function getShapeBounds(shape: Shape): { x: number; y: number; width: number; height: number } {
  switch (shape.type) {
    case 'rectangle':
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    case 'circle':
      return {
        x: shape.x,
        y: shape.y,
        width: shape.radius * 2,
        height: shape.radius * 2,
      };
    case 'triangle':
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      };
    case 'star':
      const size = shape.outerRadius * 2;
      return {
        x: shape.x,
        y: shape.y,
        width: size,
        height: size,
      };
  }
}

