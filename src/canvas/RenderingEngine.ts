import type { Shape } from '@/shapes/types';
import { renderRectangle } from '@/shapes/Rectangle';
import { renderCircle } from '@/shapes/Circle';
import { renderTriangle } from '@/shapes/Triangle';
import { renderStar } from '@/shapes/Star';
import type { CanvasSize } from './types';
import { getShapeBounds } from '@/utils/shapeUtils';
import type { Layer } from '@/layers/types';

/**
 * Rendering engine for canvas-based drawing
 * Uses requestAnimationFrame for smooth 60fps rendering
 */
export class RenderingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private shapes: Shape[] = [];
  private layers: Layer[] = [];
  private selectedShapeId: string | null = null;
  private canvasSize: CanvasSize;
  private needsRedraw: boolean = true;

  constructor(canvas: HTMLCanvasElement, canvasSize: CanvasSize) {
    this.canvas = canvas;
    this.canvasSize = canvasSize;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2d context from canvas');
    }
    this.ctx = context;

    // Set canvas size
    this.canvas.width = canvasSize.width;
    this.canvas.height = canvasSize.height;

    // Start render loop
    this.startRenderLoop();
  }

  /**
   * Set the shapes to render
   */
  setShapes(shapes: Shape[]): void {
    this.shapes = shapes;
    this.markDirty();
  }

  /**
   * Set the layers for rendering order
   */
  setLayers(layers: Layer[]): void {
    this.layers = layers;
    this.markDirty();
  }

  /**
   * Set the selected shape ID for rendering selection indicator
   */
  setSelectedShapeId(selectedShapeId: string | null): void {
    this.selectedShapeId = selectedShapeId;
    this.markDirty();
  }

  /**
   * Mark canvas as needing redraw
   */
  markDirty(): void {
    this.needsRedraw = true;
  }

  /**
   * Clear the entire canvas
   */
  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
  }

  /**
   * Render all shapes
   */
  private render(): void {
    if (!this.needsRedraw) {
      return;
    }

    this.clear();

    // Get shapes in layer order (lowest order first, so they render bottom to top)
    const orderedLayers = [...this.layers].sort((a, b) => a.order - b.order);
    const shapeMap = new Map(this.shapes.map((s) => [s.id, s]));

    // Render each shape in layer order
    for (const layer of orderedLayers) {
      const shape = shapeMap.get(layer.shapeId);
      if (shape) {
        this.renderShape(shape);
      }
    }

    // Render any shapes that don't have layers (shouldn't happen, but safety check)
    for (const shape of this.shapes) {
      if (!this.layers.some((l) => l.shapeId === shape.id)) {
        this.renderShape(shape);
      }
    }

    // Render selection indicator
    if (this.selectedShapeId) {
      const selectedShape = this.shapes.find((s) => s.id === this.selectedShapeId);
      if (selectedShape) {
        this.renderSelectionIndicator(selectedShape);
      }
    }

    this.needsRedraw = false;
  }

  /**
   * Render a single shape based on its type
   */
  private renderShape(shape: Shape): void {
    switch (shape.type) {
      case 'rectangle':
        renderRectangle(this.ctx, shape);
        break;
      case 'circle':
        renderCircle(this.ctx, shape);
        break;
      case 'triangle':
        renderTriangle(this.ctx, shape);
        break;
      case 'star':
        renderStar(this.ctx, shape);
        break;
    }
  }

  /**
   * Render selection indicator (outline) around a shape
   */
  private renderSelectionIndicator(shape: Shape): void {
    const bounds = getShapeBounds(shape);
    const padding = 4;
    
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(
      bounds.x - padding,
      bounds.y - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2
    );
    this.ctx.setLineDash([]);
  }

  /**
   * Start the render loop using requestAnimationFrame
   */
  private startRenderLoop(): void {
    const loop = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Stop the render loop
   */
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

