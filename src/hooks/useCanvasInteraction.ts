import { useCallback, useRef } from 'react';
import type { ShapeType, Shape } from '@/shapes/types';
import { createShape, generateShapeId } from '@/shapes/ShapeFactory';
import { getShapeAtPoint } from '@/utils/shapeUtils';
import type { Layer } from '@/layers/types';

export interface UseCanvasInteractionOptions {
  activeTool: 'select' | ShapeType;
  shapes: Shape[];
  layers: Layer[];
  selectedShapeId: string | null;
  onShapeCreate?: (shape: ReturnType<typeof createShape>) => void;
  onShapeSelect?: (shapeId: string | null) => void;
  onShapeUpdate?: (shapeId: string, updates: Partial<Shape>) => void;
  onShapeEdit?: (shapeId: string | null) => void;
  onBringToFront?: (shapeId: string) => void;
}

/**
 * Hook for handling canvas interactions (click to create shapes, select shapes, drag shapes)
 */
export function useCanvasInteraction({
  activeTool,
  shapes,
  layers,
  selectedShapeId,
  onShapeCreate,
  onShapeSelect,
  onShapeUpdate,
  onShapeEdit,
  onBringToFront,
}: UseCanvasInteractionOptions) {
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; shapeX: number; shapeY: number } | null>(null);

  const getCanvasCoordinates = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    // Convert screen coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      // Don't handle click if we just finished dragging
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }

      const coords = getCanvasCoordinates(event);

      // If a shape tool is active, create a new shape
      if (activeTool !== 'select' && onShapeCreate) {
        const shapeType = activeTool as ShapeType;
        const newShape = createShape(shapeType, generateShapeId(shapeType), coords.x, coords.y);
        onShapeCreate(newShape);
      } else if (activeTool === 'select' && onShapeSelect) {
        // Check if click hits a shape
        const hitShape = getShapeAtPoint(shapes, layers, coords.x, coords.y);
        onShapeSelect(hitShape ? hitShape.id : null);
      }
    },
    [activeTool, shapes, layers, onShapeCreate, onShapeSelect, getCanvasCoordinates]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (activeTool !== 'select' || !selectedShapeId || !onShapeUpdate) {
        return;
      }

      const coords = getCanvasCoordinates(event);
      const selectedShape = shapes.find((s) => s.id === selectedShapeId);
      
      if (selectedShape) {
        // Check if click is on the selected shape (use layers for hit testing)
        const hitShape = getShapeAtPoint([selectedShape], layers, coords.x, coords.y);
        if (hitShape && hitShape.id === selectedShapeId) {
          // Bring shape to front when starting to drag
          if (onBringToFront) {
            onBringToFront(selectedShapeId);
          }
          isDraggingRef.current = true;
          dragStartRef.current = {
            x: coords.x,
            y: coords.y,
            shapeX: selectedShape.x,
            shapeY: selectedShape.y,
          };
        }
      }
    },
    [activeTool, shapes, layers, selectedShapeId, onShapeUpdate, onBringToFront, getCanvasCoordinates]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current || !dragStartRef.current || !onShapeUpdate || !selectedShapeId) {
        return;
      }

      const coords = getCanvasCoordinates(event);
      const dx = coords.x - dragStartRef.current.x;
      const dy = coords.y - dragStartRef.current.y;

      // Mark that we're dragging (so click event can be ignored)
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        didDragRef.current = true;
      }

      onShapeUpdate(selectedShapeId, {
        x: dragStartRef.current.shapeX + dx,
        y: dragStartRef.current.shapeY + dy,
      });
    },
    [onShapeUpdate, selectedShapeId, getCanvasCoordinates]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      dragStartRef.current = null;
      // didDragRef will be reset on next click if no drag occurred
    }
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (activeTool !== 'select' || !onShapeEdit) {
        return;
      }

      const coords = getCanvasCoordinates(event);
      const hitShape = getShapeAtPoint(shapes, layers, coords.x, coords.y);
      onShapeEdit(hitShape ? hitShape.id : null);
    },
    [activeTool, shapes, layers, onShapeEdit, getCanvasCoordinates]
  );

  return {
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
  };
}

