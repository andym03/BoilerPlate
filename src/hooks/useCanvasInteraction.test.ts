import { renderHook } from '@testing-library/react';
import { useCanvasInteraction } from './useCanvasInteraction';

describe('useCanvasInteraction', () => {
  it('returns handleCanvasClick function', () => {
    const { result } = renderHook(() =>
      useCanvasInteraction({
        activeTool: 'select',
        shapes: [],
        layers: [],
        selectedShapeId: null,
        onShapeCreate: jest.fn(),
        onShapeSelect: jest.fn(),
      })
    );
    
    expect(result.current.handleCanvasClick).toBeInstanceOf(Function);
  });

  it('calls onShapeCreate when shape tool is active and canvas is clicked', () => {
    const onShapeCreate = jest.fn();
    const { result } = renderHook(() =>
      useCanvasInteraction({
        activeTool: 'rectangle',
        shapes: [],
        layers: [],
        selectedShapeId: null,
        onShapeCreate,
        onShapeSelect: jest.fn(),
      })
    );
    
    // Create a mock canvas click event
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    document.body.appendChild(canvas);
    
    const mockEvent = {
      currentTarget: canvas,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent<HTMLCanvasElement>;
    
    // Mock getBoundingClientRect
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 1920,
      bottom: 1080,
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    });
    
    result.current.handleCanvasClick(mockEvent);
    
    expect(onShapeCreate).toHaveBeenCalledTimes(1);
    const createdShape = onShapeCreate.mock.calls[0][0];
    expect(createdShape.type).toBe('rectangle');
    expect(createdShape.id).toMatch(/^rectangle-/);
    
    document.body.removeChild(canvas);
  });

  it('calls onShapeSelect when select tool is active', () => {
    const onShapeSelect = jest.fn();
    const { result } = renderHook(() =>
      useCanvasInteraction({
        activeTool: 'select',
        shapes: [],
        layers: [],
        selectedShapeId: null,
        onShapeCreate: jest.fn(),
        onShapeSelect,
      })
    );
    
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    document.body.appendChild(canvas);
    
    const mockEvent = {
      currentTarget: canvas,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent<HTMLCanvasElement>;
    
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 1920,
      bottom: 1080,
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    });
    
    result.current.handleCanvasClick(mockEvent);
    
    expect(onShapeSelect).toHaveBeenCalledWith(null);
    
    document.body.removeChild(canvas);
  });
});

