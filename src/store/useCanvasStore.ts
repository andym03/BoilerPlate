import { useState, useCallback, useRef, useMemo } from 'react';
import type { Shape, RectangleShape, CircleShape, TriangleShape, StarShape } from '@/shapes/types';
import type { CanvasSize } from '@/canvas/types';
import type { CanvasStore } from './types';
import { LayerManager } from '@/layers/LayerManager';
import type { Layer } from '@/layers/types';

const DEFAULT_CANVAS_SIZE: CanvasSize = { width: 1920, height: 1080 };

/**
 * Custom hook for managing canvas state
 * Provides state and actions for shapes, selection, and canvas configuration
 */
export function useCanvasStore(initialCanvasSize: CanvasSize = DEFAULT_CANVAS_SIZE): CanvasStore {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [canvasSize] = useState<CanvasSize>(initialCanvasSize);
  const [layerVersion, setLayerVersion] = useState(0); // Force re-render when layers change
  const layerManagerRef = useRef(new LayerManager());

  /**
   * Get layer name from shape type
   */
  const getDefaultLayerName = useCallback((shape: Shape): string => {
    return `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)} ${shape.id.slice(-6)}`;
  }, []);

  const addShape = useCallback((shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
    // Create a layer for the new shape
    layerManagerRef.current.addLayer(shape.id, getDefaultLayerName(shape));
    setLayerVersion((v) => v + 1); // Trigger re-render
  }, [getDefaultLayerName]);

  const removeShape = useCallback((shapeId: string) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
    setSelectedShapeId((prev) => (prev === shapeId ? null : prev));
    // Remove the associated layer
    layerManagerRef.current.removeLayerByShapeId(shapeId);
    setLayerVersion((v) => v + 1); // Trigger re-render
  }, []);

  const updateShape = useCallback((shapeId: string, updates: Partial<Shape>) => {
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id !== shapeId) {
          return shape;
        }
        
        // Use type-safe update based on shape type to preserve discriminated union
        switch (shape.type) {
          case 'rectangle': {
            const rectUpdates = updates as Partial<RectangleShape>;
            return {
              ...shape,
              ...(rectUpdates.x !== undefined && { x: rectUpdates.x }),
              ...(rectUpdates.y !== undefined && { y: rectUpdates.y }),
              ...(rectUpdates.fillColor !== undefined && { fillColor: rectUpdates.fillColor }),
              ...(rectUpdates.width !== undefined && { width: rectUpdates.width }),
              ...(rectUpdates.height !== undefined && { height: rectUpdates.height }),
            } as RectangleShape;
          }
          case 'circle': {
            const circleUpdates = updates as Partial<CircleShape>;
            return {
              ...shape,
              ...(circleUpdates.x !== undefined && { x: circleUpdates.x }),
              ...(circleUpdates.y !== undefined && { y: circleUpdates.y }),
              ...(circleUpdates.fillColor !== undefined && { fillColor: circleUpdates.fillColor }),
              ...(circleUpdates.radius !== undefined && { radius: circleUpdates.radius }),
            } as CircleShape;
          }
          case 'triangle': {
            const triangleUpdates = updates as Partial<TriangleShape>;
            return {
              ...shape,
              ...(triangleUpdates.x !== undefined && { x: triangleUpdates.x }),
              ...(triangleUpdates.y !== undefined && { y: triangleUpdates.y }),
              ...(triangleUpdates.fillColor !== undefined && { fillColor: triangleUpdates.fillColor }),
              ...(triangleUpdates.width !== undefined && { width: triangleUpdates.width }),
              ...(triangleUpdates.height !== undefined && { height: triangleUpdates.height }),
            } as TriangleShape;
          }
          case 'star': {
            const starUpdates = updates as Partial<StarShape>;
            return {
              ...shape,
              ...(starUpdates.x !== undefined && { x: starUpdates.x }),
              ...(starUpdates.y !== undefined && { y: starUpdates.y }),
              ...(starUpdates.fillColor !== undefined && { fillColor: starUpdates.fillColor }),
              ...(starUpdates.outerRadius !== undefined && { outerRadius: starUpdates.outerRadius }),
              ...(starUpdates.innerRadius !== undefined && { innerRadius: starUpdates.innerRadius }),
              ...(starUpdates.points !== undefined && { points: starUpdates.points }),
            } as StarShape;
          }
          default:
            return shape;
        }
      })
    );
  }, []);

  const selectShape = useCallback((shapeId: string | null) => {
    setSelectedShapeId(shapeId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedShapeId(null);
  }, []);

  /**
   * Bring shape to front by bringing its layer to front
   */
  const bringToFront = useCallback((shapeId: string) => {
    const layer = layerManagerRef.current.getLayerByShapeId(shapeId);
    if (layer) {
      layerManagerRef.current.bringToFront(layer.id);
      setLayerVersion((v) => v + 1); // Trigger re-render
    }
  }, []);

  /**
   * Get layers ordered by their order property
   * Memoized to recompute when layerVersion changes
   */
  const layersOrdered = useMemo(() => {
    return layerManagerRef.current.getLayersOrdered();
  }, [layerVersion]);

  /**
   * Get layers ordered by their order property
   */
  const getLayersOrdered = useCallback((): Layer[] => {
    return layersOrdered;
  }, [layersOrdered]);

  /**
   * Get layer by shape ID
   */
  const getLayerByShapeId = useCallback((shapeId: string): Layer | undefined => {
    return layerManagerRef.current.getLayerByShapeId(shapeId);
  }, [layerVersion]); // Recompute when layerVersion changes

  /**
   * Update layer name
   */
  const updateLayerName = useCallback((layerId: string, name: string) => {
    layerManagerRef.current.updateLayerName(layerId, name);
    setLayerVersion((v) => v + 1); // Trigger re-render
  }, []);

  /**
   * Reorder layer
   */
  const reorderLayer = useCallback((layerId: string, newOrder: number) => {
    layerManagerRef.current.reorderLayer(layerId, newOrder);
    setLayerVersion((v) => v + 1); // Trigger re-render
  }, []);

  return {
    shapes,
    selectedShapeId,
    canvasSize,
    addShape,
    removeShape,
    updateShape,
    selectShape,
    clearSelection,
    bringToFront,
    getLayersOrdered,
    getLayerByShapeId,
    updateLayerName,
    reorderLayer,
  };
}

