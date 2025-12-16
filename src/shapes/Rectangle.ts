import type { RectangleShape } from './types';

/**
 * Creates a new rectangle shape
 */
export function createRectangle(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string = '#3b82f6'
): RectangleShape {
  return {
    id,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    fillColor,
  };
}

/**
 * Renders a rectangle shape on a canvas context
 */
export function renderRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape
): void {
  ctx.fillStyle = shape.fillColor;
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
}

