import { exportToSVG, downloadSVG } from './svgExporter';
import { createRectangle } from '@/shapes/Rectangle';
import { createCircle } from '@/shapes/Circle';
import { createTriangle } from '@/shapes/Triangle';
import { createStar } from '@/shapes/Star';
import type { CanvasSize } from '@/canvas/types';
import type { Layer } from '@/layers/types';

const CANVAS_SIZE: CanvasSize = { width: 1920, height: 1080 };

describe('svgExporter', () => {
  describe('exportToSVG', () => {
    it('exports empty canvas as SVG', () => {
      const svg = exportToSVG([], [], CANVAS_SIZE);
      
      expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(svg).toContain(`<svg width="${CANVAS_SIZE.width}" height="${CANVAS_SIZE.height}"`);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('exports rectangle shape to SVG', () => {
      const rect = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      const layers: Layer[] = [{ id: 'layer-1', shapeId: 'rect-1', name: 'Rectangle', order: 0 }];
      const svg = exportToSVG([rect], layers, CANVAS_SIZE);
      
      expect(svg).toContain(`<rect x="100" y="100" width="200" height="150" fill="#3b82f6" />`);
    });

    it('exports circle shape to SVG', () => {
      const circle = createCircle('circle-1', 100, 100, 75, '#22c55e');
      const layers: Layer[] = [{ id: 'layer-1', shapeId: 'circle-1', name: 'Circle', order: 0 }];
      const svg = exportToSVG([circle], layers, CANVAS_SIZE);
      
      // Circle center is at (x + radius, y + radius) = (175, 175)
      expect(svg).toContain(`<circle cx="175" cy="175" r="75" fill="#22c55e" />`);
    });

    it('exports triangle shape to SVG', () => {
      const triangle = createTriangle('triangle-1', 100, 100, 150, 150, '#f97316');
      const layers: Layer[] = [{ id: 'layer-1', shapeId: 'triangle-1', name: 'Triangle', order: 0 }];
      const svg = exportToSVG([triangle], layers, CANVAS_SIZE);
      
      // Triangle points: top (175, 100), bottom-left (100, 250), bottom-right (250, 250)
      expect(svg).toContain('<polygon');
      expect(svg).toContain('fill="#f97316"');
      expect(svg).toContain('175,100'); // top point
      expect(svg).toContain('100,250'); // bottom left
      expect(svg).toContain('250,250'); // bottom right
    });

    it('exports star shape to SVG', () => {
      const star = createStar('star-1', 100, 100, 60, 30, 5, '#eab308');
      const layers: Layer[] = [{ id: 'layer-1', shapeId: 'star-1', name: 'Star', order: 0 }];
      const svg = exportToSVG([star], layers, CANVAS_SIZE);
      
      expect(svg).toContain('<polygon');
      expect(svg).toContain('fill="#eab308"');
      expect(svg).toContain('points=');
    });

    it('exports multiple shapes in correct layer order', () => {
      const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
      const circle = createCircle('circle-1', 500, 100, 75, '#ff0000');
      
      const layers: Layer[] = [
        { id: 'layer-1', shapeId: 'circle-1', name: 'Circle', order: 0 },
        { id: 'layer-2', shapeId: 'rect-1', name: 'Rectangle 1', order: 1 },
        { id: 'layer-3', shapeId: 'rect-2', name: 'Rectangle 2', order: 2 },
      ];
      
      const svg = exportToSVG([rect1, rect2, circle], layers, CANVAS_SIZE);
      
      // Shapes should be sorted by layer order (lowest first)
      const circleIndex = svg.indexOf('circle');
      const rect1Index = svg.indexOf('rect-1');
      const rect2Index = svg.indexOf('rect-2');
      
      // Circle (order 0) should appear first, then rect1 (order 1), then rect2 (order 2)
      expect(circleIndex).toBeLessThan(rect1Index);
      expect(rect1Index).toBeLessThan(rect2Index);
    });
  });

  describe('downloadSVG', () => {
    it('creates download link and triggers download', () => {
      const svgContent = exportToSVG([], [], CANVAS_SIZE);
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
      
      downloadSVG(svgContent, 'test-canvas');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('test-canvas.svg');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });
});
