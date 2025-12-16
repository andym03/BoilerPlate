import type { Layer } from './types';

/**
 * Generates a unique layer ID
 */
function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Layer manager for handling layer state and operations
 */
export class LayerManager {
  private layers: Layer[] = [];
  private nextOrder: number = 0;

  /**
   * Get all layers
   */
  getLayers(): Layer[] {
    return [...this.layers];
  }

  /**
   * Get layers ordered by their order property (lowest first)
   */
  getLayersOrdered(): Layer[] {
    return [...this.layers].sort((a, b) => a.order - b.order);
  }

  /**
   * Get layer by layer ID
   */
  getLayer(layerId: string): Layer | undefined {
    return this.layers.find((l) => l.id === layerId);
  }

  /**
   * Get layer by shape ID
   */
  getLayerByShapeId(shapeId: string): Layer | undefined {
    return this.layers.find((l) => l.shapeId === shapeId);
  }

  /**
   * Add a new layer for a shape
   * @param shapeId The shape ID this layer references
   * @param name Optional layer name (defaults to shape type)
   * @returns The created layer ID
   */
  addLayer(shapeId: string, name?: string): string {
    const layerId = generateLayerId();
    const layer: Layer = {
      id: layerId,
      shapeId,
      name: name || `Layer ${this.layers.length + 1}`,
      order: this.nextOrder++,
    };
    this.layers.push(layer);
    return layerId;
  }

  /**
   * Remove a layer by layer ID
   */
  removeLayer(layerId: string): void {
    this.layers = this.layers.filter((l) => l.id !== layerId);
  }

  /**
   * Remove a layer by shape ID
   */
  removeLayerByShapeId(shapeId: string): void {
    this.layers = this.layers.filter((l) => l.shapeId !== shapeId);
  }

  /**
   * Update layer name
   */
  updateLayerName(layerId: string, name: string): void {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      layer.name = name;
    }
  }

  /**
   * Reorder a layer to a specific order position
   */
  reorderLayer(layerId: string, newOrder: number): void {
    const layer = this.layers.find((l) => l.id === layerId);
    if (!layer) {
      return;
    }

    const oldOrder = layer.order;
    
    // Clamp newOrder to valid range
    const minOrder = 0;
    const maxOrder = this.layers.length - 1;
    const clampedOrder = Math.max(minOrder, Math.min(maxOrder, newOrder));

    // If moving to same position, do nothing
    if (oldOrder === clampedOrder) {
      return;
    }

    // Reorder all layers
    const sortedLayers = [...this.layers].sort((a, b) => a.order - b.order);
    sortedLayers.splice(oldOrder, 1); // Remove from old position
    sortedLayers.splice(clampedOrder, 0, layer); // Insert at new position

    // Reassign orders sequentially
    sortedLayers.forEach((l, index) => {
      l.order = index;
    });
  }

  /**
   * Get the maximum order value
   */
  private getMaxOrder(): number {
    if (this.layers.length === 0) {
      return -1;
    }
    return Math.max(...this.layers.map((l) => l.order));
  }

  /**
   * Bring layer to front (highest order)
   */
  bringToFront(layerId: string): void {
    const maxOrder = this.getMaxOrder();
    if (maxOrder >= 0) {
      this.reorderLayer(layerId, maxOrder + 1);
    }
  }

  /**
   * Send layer to back (order 0, shift others up)
   */
  sendToBack(layerId: string): void {
    this.reorderLayer(layerId, -1); // Will be clamped to 0
    // Shift all other layers up
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      this.layers.forEach((l) => {
        if (l.id !== layerId && l.order < layer.order) {
          l.order++;
        }
      });
      layer.order = 0;
    }
  }

  /**
   * Move layer up one position (increase order)
   */
  moveUp(layerId: string): void {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer) {
      this.reorderLayer(layerId, layer.order + 1);
    }
  }

  /**
   * Move layer down one position (decrease order)
   */
  moveDown(layerId: string): void {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer && layer.order > 0) {
      this.reorderLayer(layerId, layer.order - 1);
    }
  }
}
