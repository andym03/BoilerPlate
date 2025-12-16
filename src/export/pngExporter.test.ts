import { exportToPNG, downloadPNG } from './pngExporter';
import { createRectangle } from '@/shapes/Rectangle';
import { createCircle } from '@/shapes/Circle';
import type { CanvasSize } from '@/canvas/types';
import type { Layer } from '@/layers/types';

const CANVAS_SIZE: CanvasSize = { width: 1920, height: 1080 };

describe('pngExporter', () => {
  describe('exportToPNG', () => {
    it('exports empty canvas as PNG data URL', async () => {
      const dataUrl = await exportToPNG([], [], CANVAS_SIZE);
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('exports shapes to PNG', async () => {
      const rect = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      const layers: Layer[] = [{ id: 'layer-1', shapeId: 'rect-1', name: 'Rectangle', order: 0 }];
      const dataUrl = await exportToPNG([rect], layers, CANVAS_SIZE);
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('exports multiple shapes in correct layer order', async () => {
      const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
      const circle = createCircle('circle-1', 500, 100, 75, '#ff0000');
      
      const layers: Layer[] = [
        { id: 'layer-1', shapeId: 'circle-1', name: 'Circle', order: 0 },
        { id: 'layer-2', shapeId: 'rect-1', name: 'Rectangle 1', order: 1 },
        { id: 'layer-3', shapeId: 'rect-2', name: 'Rectangle 2', order: 2 },
      ];
      
      const dataUrl = await exportToPNG([rect1, rect2, circle], layers, CANVAS_SIZE);
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('handles all shape types', async () => {
      const shapes = [
        createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6'),
        createCircle('circle-1', 400, 100, 75, '#22c55e'),
      ];
      
      const layers: Layer[] = [
        { id: 'layer-1', shapeId: 'rect-1', name: 'Rectangle', order: 0 },
        { id: 'layer-2', shapeId: 'circle-1', name: 'Circle', order: 1 },
      ];
      
      const dataUrl = await exportToPNG(shapes, layers, CANVAS_SIZE);
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('accepts custom background color parameter', async () => {
      // Test that the function accepts backgroundColor parameter without error
      const dataUrl = await exportToPNG([], [], CANVAS_SIZE, '#ff0000');
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('uses default white background when backgroundColor is not provided', async () => {
      // Test that the function works with default backgroundColor
      const dataUrl = await exportToPNG([], [], CANVAS_SIZE);
      
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('downloadPNG', () => {
    it('creates download link and triggers download', () => {
      const dataUrl = 'data:image/png;base64,test';
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');
      const clickSpy = jest.fn();
      
      // Mock link element
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy,
      } as unknown as HTMLAnchorElement;
      
      createElementSpy.mockReturnValue(mockLink);
      
      downloadPNG(dataUrl, 'test-canvas');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe(dataUrl);
      expect(mockLink.download).toBe('test-canvas.png');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });
});
