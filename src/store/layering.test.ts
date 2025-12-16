import { renderHook, act } from '@testing-library/react';
import { useCanvasStore } from './useCanvasStore';
import { createRectangle } from '@/shapes/Rectangle';
import { createCircle } from '@/shapes/Circle';

const CANVAS_SIZE = { width: 1920, height: 1080 };

describe('Layering System', () => {
  it('creates layers automatically when adding shapes (newest on top)', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    const circle1 = createCircle('circle-1', 500, 100, 75, '#ff0000');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
      result.current.addShape(circle1);
    });
    
    const layers = result.current.getLayersOrdered();
    expect(layers).toHaveLength(3);
    
    // Layers should have increasing order (newest on top)
    const layer1 = result.current.getLayerByShapeId('rect-1');
    const layer2 = result.current.getLayerByShapeId('rect-2');
    const layer3 = result.current.getLayerByShapeId('circle-1');
    
    expect(layer1).toBeDefined();
    expect(layer2).toBeDefined();
    expect(layer3).toBeDefined();
    expect(layer1!.order).toBeLessThan(layer2!.order);
    expect(layer2!.order).toBeLessThan(layer3!.order);
  });

  it('brings shape to front when bringToFront is called', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    const rect3 = createRectangle('rect-3', 500, 100, 200, 150, '#ff0000');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
      result.current.addShape(rect3);
    });
    
    const initialLayer1 = result.current.getLayerByShapeId('rect-1')!;
    const initialLayer2 = result.current.getLayerByShapeId('rect-2')!;
    const initialLayer3 = result.current.getLayerByShapeId('rect-3')!;
    
    // Initially: rect1 has lowest order, rect3 has highest
    expect(initialLayer1.order).toBeLessThan(initialLayer2.order);
    expect(initialLayer2.order).toBeLessThan(initialLayer3.order);
    
    // Bring rect1 to front
    act(() => {
      result.current.bringToFront('rect-1');
    });
    
    const updatedLayer1 = result.current.getLayerByShapeId('rect-1')!;
    const updatedLayer2 = result.current.getLayerByShapeId('rect-2')!;
    const updatedLayer3 = result.current.getLayerByShapeId('rect-3')!;
    
    // Now rect1 should have highest order (on top)
    expect(updatedLayer1.order).toBeGreaterThan(updatedLayer2.order);
    expect(updatedLayer1.order).toBeGreaterThan(updatedLayer3.order);
  });

  it('renders shapes in correct layer order (lowest order first)', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
    });
    
    const layers = result.current.getLayersOrdered();
    expect(layers).toHaveLength(2);
    
    // Layers should be ordered by order property (lowest first)
    expect(layers[0].shapeId).toBe('rect-1');
    expect(layers[1].shapeId).toBe('rect-2');
    expect(layers[0].order).toBeLessThan(layers[1].order);
  });

  it('removes layer when shape is removed', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
    });
    
    expect(result.current.getLayersOrdered()).toHaveLength(2);
    
    act(() => {
      result.current.removeShape('rect-1');
    });
    
    expect(result.current.getLayersOrdered()).toHaveLength(1);
    expect(result.current.getLayerByShapeId('rect-1')).toBeUndefined();
    expect(result.current.getLayerByShapeId('rect-2')).toBeDefined();
  });

  it('updates layer name', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    
    act(() => {
      result.current.addShape(rect1);
    });
    
    const layer = result.current.getLayerByShapeId('rect-1')!;
    const layerId = layer.id;
    
    act(() => {
      result.current.updateLayerName(layerId, 'My Custom Layer');
    });
    
    const updatedLayer = result.current.getLayerByShapeId('rect-1')!;
    expect(updatedLayer.name).toBe('My Custom Layer');
  });

  it('reorders layers correctly', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    const rect3 = createRectangle('rect-3', 500, 100, 200, 150, '#ff0000');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
      result.current.addShape(rect3);
    });
    
    const layer2 = result.current.getLayerByShapeId('rect-2')!;
    
    // Move rect2 to position 0 (bottom)
    act(() => {
      result.current.reorderLayer(layer2.id, 0);
    });
    
    const updatedLayers = result.current.getLayersOrdered();
    expect(updatedLayers[0].shapeId).toBe('rect-2');
  });
});
