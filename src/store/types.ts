import type { Shape } from '@/shapes/types';
import type { CanvasSize } from '@/canvas/types';
import type { Layer } from '@/layers/types';

/**
 * Canvas application state
 */
export interface CanvasState {
  shapes: Shape[];
  selectedShapeId: string | null;
  canvasSize: CanvasSize;
}

/**
 * Actions for modifying canvas state
 */
export interface CanvasActions {
  addShape: (shape: Shape) => void;
  removeShape: (shapeId: string) => void;
  updateShape: (shapeId: string, updates: Partial<Shape>) => void;
  selectShape: (shapeId: string | null) => void;
  clearSelection: () => void;
  bringToFront: (shapeId: string) => void;
  getLayersOrdered: () => Layer[];
  getLayerByShapeId: (shapeId: string) => Layer | undefined;
  updateLayerName: (layerId: string, name: string) => void;
  reorderLayer: (layerId: string, newOrder: number) => void;
}

/**
 * Combined canvas store type
 */
export type CanvasStore = CanvasState & CanvasActions;

