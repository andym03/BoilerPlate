import type { CircleShape } from './types';

/**
 * Creates a new circle shape
 */
export function createCircle(
  id: string,
  x: number,
  y: number,
  radius: number,
  fillColor: string = '#22c55e'
): CircleShape {
  return {
    id,
    type: 'circle',
    x,
    y,
    radius,
    fillColor,
  };
}

/**
 * Renders a circle shape on a canvas context
 */
export function renderCircle(
  ctx: CanvasRenderingContext2D,
  shape: CircleShape
): void {
  ctx.fillStyle = shape.fillColor;
  ctx.beginPath();
  ctx.arc(shape.x + shape.radius, shape.y + shape.radius, shape.radius, 0, Math.PI * 2);
  ctx.fill();
}

