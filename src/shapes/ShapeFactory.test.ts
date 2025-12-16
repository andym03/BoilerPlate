import { createShape, generateShapeId } from './ShapeFactory';
import type { RectangleShape, CircleShape, TriangleShape, StarShape } from './types';

describe('ShapeFactory', () => {
  describe('createShape', () => {
    it('creates rectangle shape with default properties', () => {
      const shape = createShape('rectangle', 'test-id');
      
      expect(shape.type).toBe('rectangle');
      expect(shape.id).toBe('test-id');
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      
      const rectangle = shape as RectangleShape;
      expect(rectangle.width).toBe(200);
      expect(rectangle.height).toBe(150);
      expect(rectangle.fillColor).toBe('#3b82f6');
    });

    it('creates circle shape with default properties', () => {
      const shape = createShape('circle', 'test-id');
      
      expect(shape.type).toBe('circle');
      expect(shape.id).toBe('test-id');
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      
      const circle = shape as CircleShape;
      expect(circle.radius).toBe(75);
      expect(circle.fillColor).toBe('#22c55e');
    });

    it('creates triangle shape with default properties', () => {
      const shape = createShape('triangle', 'test-id');
      
      expect(shape.type).toBe('triangle');
      expect(shape.id).toBe('test-id');
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      
      const triangle = shape as TriangleShape;
      expect(triangle.width).toBe(150);
      expect(triangle.height).toBe(150);
      expect(triangle.fillColor).toBe('#f97316');
    });

    it('creates star shape with default properties', () => {
      const shape = createShape('star', 'test-id');
      
      expect(shape.type).toBe('star');
      expect(shape.id).toBe('test-id');
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      
      const star = shape as StarShape;
      expect(star.outerRadius).toBe(60);
      expect(star.innerRadius).toBe(30);
      expect(star.points).toBe(5);
      expect(star.fillColor).toBe('#eab308');
    });

    it('creates shape with custom position', () => {
      const shape = createShape('rectangle', 'test-id', 50, 75);
      
      expect(shape.x).toBe(50);
      expect(shape.y).toBe(75);
    });
  });

  describe('generateShapeId', () => {
    it('generates unique ids for rectangle', () => {
      const id1 = generateShapeId('rectangle');
      const id2 = generateShapeId('rectangle');
      
      expect(id1).toMatch(/^rectangle-/);
      expect(id2).toMatch(/^rectangle-/);
      expect(id1).not.toBe(id2);
    });

    it('generates unique ids for circle', () => {
      const id1 = generateShapeId('circle');
      const id2 = generateShapeId('circle');
      
      expect(id1).toMatch(/^circle-/);
      expect(id2).toMatch(/^circle-/);
      expect(id1).not.toBe(id2);
    });

    it('generates unique ids for triangle', () => {
      const id1 = generateShapeId('triangle');
      const id2 = generateShapeId('triangle');
      
      expect(id1).toMatch(/^triangle-/);
      expect(id2).toMatch(/^triangle-/);
      expect(id1).not.toBe(id2);
    });

    it('generates unique ids for star', () => {
      const id1 = generateShapeId('star');
      const id2 = generateShapeId('star');
      
      expect(id1).toMatch(/^star-/);
      expect(id2).toMatch(/^star-/);
      expect(id1).not.toBe(id2);
    });
  });
});

