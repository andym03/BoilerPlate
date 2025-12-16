import type { ShapeType } from './types';
import { createRectangle } from './Rectangle';
import { createCircle } from './Circle';
import { createTriangle } from './Triangle';
import { createStar } from './Star';
import type { Shape } from './types';

/**
 * Default position for new shapes
 */
const DEFAULT_POSITION = { x: 100, y: 100 };

/**
 * Default properties for each shape type
 */
const DEFAULT_SHAPE_PROPS = {
  rectangle: { width: 200, height: 150, fillColor: '#3b82f6' },
  circle: { radius: 75, fillColor: '#22c55e' },
  triangle: { width: 150, height: 150, fillColor: '#f97316' },
  star: { outerRadius: 60, innerRadius: 30, points: 5, fillColor: '#eab308' },
};

/**
 * Creates a new shape of the specified type with default properties
 */
export function createShape(
  type: ShapeType,
  id: string,
  x: number = DEFAULT_POSITION.x,
  y: number = DEFAULT_POSITION.y
): Shape {
  switch (type) {
    case 'rectangle': {
      const props = DEFAULT_SHAPE_PROPS.rectangle;
      return createRectangle(id, x, y, props.width, props.height, props.fillColor);
    }
    case 'circle': {
      const props = DEFAULT_SHAPE_PROPS.circle;
      return createCircle(id, x, y, props.radius, props.fillColor);
    }
    case 'triangle': {
      const props = DEFAULT_SHAPE_PROPS.triangle;
      return createTriangle(id, x, y, props.width, props.height, props.fillColor);
    }
    case 'star': {
      const props = DEFAULT_SHAPE_PROPS.star;
      return createStar(id, x, y, props.outerRadius, props.innerRadius, props.points, props.fillColor);
    }
  }
}

/**
 * Generates a unique ID for a shape
 */
export function generateShapeId(type: ShapeType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

