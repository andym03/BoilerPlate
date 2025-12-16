import type { TriangleShape } from './types';

/**
 * Creates a new triangle shape
 */
export function createTriangle(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string = '#f97316'
): TriangleShape {
  return {
    id,
    type: 'triangle',
    x,
    y,
    width,
    height,
    fillColor,
  };
}

/**
 * Renders a triangle shape on a canvas context
 */
export function renderTriangle(
  ctx: CanvasRenderingContext2D,
  shape: TriangleShape
): void {
  ctx.fillStyle = shape.fillColor;
  ctx.beginPath();
  // Draw triangle: top point, bottom left, bottom right
  ctx.moveTo(shape.x + shape.width / 2, shape.y);
  ctx.lineTo(shape.x, shape.y + shape.height);
  ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
  ctx.closePath();
  ctx.fill();
}

