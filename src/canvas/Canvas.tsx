import { useEffect, useRef } from 'react';
import { RenderingEngine } from './RenderingEngine';
import type { Shape } from '@/shapes/types';
import type { CanvasSize } from './types';
import type { Layer } from '@/layers/types';
import './Canvas.css';

export interface CanvasProps {
  shapes: Shape[];
  layers: Layer[];
  canvasSize: CanvasSize;
  selectedShapeId?: string | null;
  onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

/**
 * Main canvas component for rendering shapes
 * Fixed size: 1920x1080
 */
export function Canvas({ shapes, layers, canvasSize, selectedShapeId, onClick, onMouseDown, onMouseMove, onMouseUp, onDoubleClick }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RenderingEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Initialize rendering engine
    const engine = new RenderingEngine(canvas, canvasSize);
    engineRef.current = engine;

    // Cleanup on unmount
    return () => {
      engine.destroy();
    };
  }, [canvasSize]);

  // Update shapes when they change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setShapes(shapes);
    }
  }, [shapes]);

  // Update layers when they change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setLayers(layers);
    }
  }, [layers]);

  // Update selected shape when it changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSelectedShapeId(selectedShapeId ?? null);
    }
  }, [selectedShapeId]);

  return (
    <div className="canvas-container" data-testid="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
        data-testid="canvas"
        aria-label="Drawing canvas"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
        style={{ cursor: onClick ? 'crosshair' : 'default' }}
      />
    </div>
  );
}

