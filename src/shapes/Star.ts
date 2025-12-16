import type { StarShape } from './types';

/**
 * Creates a new star shape
 */
export function createStar(
  id: string,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number = outerRadius * 0.5,
  points: number = 5,
  fillColor: string = '#eab308'
): StarShape {
  return {
    id,
    type: 'star',
    x,
    y,
    outerRadius,
    innerRadius,
    points,
    fillColor,
  };
}

/**
 * Renders a star shape on a canvas context
 */
export function renderStar(
  ctx: CanvasRenderingContext2D,
  shape: StarShape
): void {
  ctx.fillStyle = shape.fillColor;
  ctx.beginPath();
  
  const centerX = shape.x + shape.outerRadius;
  const centerY = shape.y + shape.outerRadius;
  
  for (let i = 0; i < shape.points * 2; i++) {
    const angle = (i * Math.PI) / shape.points;
    const radius = i % 2 === 0 ? shape.outerRadius : shape.innerRadius;
    const px = centerX + Math.cos(angle) * radius;
    const py = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
  ctx.fill();
}

