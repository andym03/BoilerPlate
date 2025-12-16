import { createRectangle, renderRectangle } from './Rectangle';
import type { RectangleShape } from './types';

describe('Rectangle', () => {
  describe('createRectangle', () => {
    it('creates rectangle with all properties', () => {
      const rect = createRectangle('test-id', 10, 20, 100, 200, '#ff0000');
      
      expect(rect.id).toBe('test-id');
      expect(rect.type).toBe('rectangle');
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(200);
      expect(rect.fillColor).toBe('#ff0000');
    });

    it('uses default fill color when not provided', () => {
      const rect = createRectangle('test-id', 10, 20, 100, 200);
      
      expect(rect.fillColor).toBe('#3b82f6');
    });
  });

  describe('renderRectangle', () => {
    it('renders rectangle on canvas context', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get 2d context');
      }
      
      const rect: RectangleShape = createRectangle('test-id', 10, 20, 100, 200, '#ff0000');
      
      // Mock fillRect to verify it's called correctly
      const fillRectSpy = jest.spyOn(ctx, 'fillRect');
      
      renderRectangle(ctx, rect);
      
      expect(ctx.fillStyle).toBe('#ff0000');
      expect(fillRectSpy).toHaveBeenCalledWith(10, 20, 100, 200);
      
      fillRectSpy.mockRestore();
    });
  });
});

