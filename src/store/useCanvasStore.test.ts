import { renderHook, act } from '@testing-library/react';
import { useCanvasStore } from './useCanvasStore';
import { createRectangle } from '@/shapes/Rectangle';

const CANVAS_SIZE = { width: 1920, height: 1080 };

describe('useCanvasStore', () => {
  it('initializes with empty shapes array', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    
    expect(result.current.shapes).toEqual([]);
    expect(result.current.selectedShapeId).toBeNull();
    expect(result.current.canvasSize).toEqual(CANVAS_SIZE);
  });

  it('adds shape to shapes array', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rectangle = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    
    act(() => {
      result.current.addShape(rectangle);
    });
    
    expect(result.current.shapes).toHaveLength(1);
    expect(result.current.shapes[0].id).toBe('rect-1');
    // Layer should be created automatically
    expect(result.current.getLayerByShapeId('rect-1')).toBeDefined();
  });

  it('adds multiple shapes', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
    });
    
    expect(result.current.shapes).toHaveLength(2);
    expect(result.current.shapes[0].id).toBe('rect-1');
    expect(result.current.shapes[1].id).toBe('rect-2');
    // Both should have layers
    expect(result.current.getLayerByShapeId('rect-1')).toBeDefined();
    expect(result.current.getLayerByShapeId('rect-2')).toBeDefined();
  });

  it('removes shape by id', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
    });
    
    act(() => {
      result.current.removeShape('rect-1');
    });
    
    expect(result.current.shapes).toHaveLength(1);
    expect(result.current.shapes[0].id).toBe('rect-2');
    // Layer should also be removed
    expect(result.current.getLayerByShapeId('rect-1')).toBeUndefined();
  });

  it('clears selection when removing selected shape', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.selectShape('rect-1');
    });
    
    expect(result.current.selectedShapeId).toBe('rect-1');
    
    act(() => {
      result.current.removeShape('rect-1');
    });
    
    expect(result.current.selectedShapeId).toBeNull();
  });

  it('updates shape properties', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    
    act(() => {
      result.current.addShape(rect1);
    });
    
    act(() => {
      result.current.updateShape('rect-1', { fillColor: '#ff0000', x: 200 });
    });
    
    expect(result.current.shapes[0].fillColor).toBe('#ff0000');
    expect(result.current.shapes[0].x).toBe(200);
    expect(result.current.shapes[0].y).toBe(100); // unchanged
  });

  it('brings shape to front', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
    const rect2 = createRectangle('rect-2', 300, 100, 200, 150, '#22c55e');
    
    act(() => {
      result.current.addShape(rect1);
      result.current.addShape(rect2);
    });
    
    const initialLayer1 = result.current.getLayerByShapeId('rect-1')!;
    const initialLayer2 = result.current.getLayerByShapeId('rect-2')!;
    
    // Initially rect1 has lower order than rect2
    expect(initialLayer1.order).toBeLessThan(initialLayer2.order);
    
    act(() => {
      result.current.bringToFront('rect-1');
    });
    
    const updatedLayer1 = result.current.getLayerByShapeId('rect-1')!;
    const updatedLayer2 = result.current.getLayerByShapeId('rect-2')!;
    
    // Now rect1 should have higher order (on top)
    expect(updatedLayer1.order).toBeGreaterThan(updatedLayer2.order);
  });

  it('selects shape by id', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    
    act(() => {
      result.current.selectShape('rect-1');
    });
    
    expect(result.current.selectedShapeId).toBe('rect-1');
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useCanvasStore(CANVAS_SIZE));
    
    act(() => {
      result.current.selectShape('rect-1');
      result.current.clearSelection();
    });
    
    expect(result.current.selectedShapeId).toBeNull();
  });
});

