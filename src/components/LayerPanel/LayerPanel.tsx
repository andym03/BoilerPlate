import { useState, useRef, useCallback } from 'react';
import type { Layer } from '@/layers/types';
import { LayerItem } from './LayerItem';
import './LayerPanel.css';

export interface LayerPanelProps {
  layers: Layer[];
  selectedShapeId: string | null;
  onSelectShape: (shapeId: string) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
  onReorderLayer: (layerId: string, newOrder: number) => void;
}

/**
 * Layer panel component for visualizing and managing layers
 */
export function LayerPanel({
  layers,
  selectedShapeId,
  onSelectShape,
  onRenameLayer,
  onReorderLayer,
}: LayerPanelProps) {
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const dragStartOrderRef = useRef<number>(0);
  const lastReorderTimeRef = useRef<number>(0);
  const dragListenersRef = useRef<{ move: ((e: MouseEvent) => void) | null; up: (() => void) | null }>({ move: null, up: null });

  // Reverse layers for display (top layer first in UI)
  const layersReversed = [...layers].reverse();
  
  // Use ref to track current layers for drag handler (avoids stale closure)
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const handleDragMove = useCallback((layerId: string, event: MouseEvent) => {
    if (!panelRef.current) {
      return;
    }

    const currentY = event.clientY;

    // Throttle reorder operations to avoid excessive updates
    const now = Date.now();
    if (now - lastReorderTimeRef.current < 50) {
      return; // Throttle to max once per 50ms
    }

    // Calculate which position we're hovering over
    const listElement = panelRef.current.querySelector('.layer-panel__list');
    if (!listElement) {
      return;
    }

    // Use current layers from ref to avoid stale closure
    const currentLayers = layersRef.current;
    const currentLayersReversed = [...currentLayers].reverse();

    const listRect = listElement.getBoundingClientRect();
    const relativeY = currentY - listRect.top;
    const itemHeight = 40; // Approximate height of each layer item
    const hoverIndex = Math.floor(relativeY / itemHeight);
    
    // Convert hover index to position in reversed list (UI shows top layer first)
    const reversedIndex = Math.max(0, Math.min(currentLayersReversed.length - 1, hoverIndex));
    const targetLayer = currentLayersReversed[reversedIndex];
    
    if (targetLayer && targetLayer.id !== layerId) {
      const draggingLayer = currentLayers.find((l) => l.id === layerId);
      if (!draggingLayer) {
        return;
      }

      const currentReversedIndex = currentLayersReversed.findIndex((l) => l.id === layerId);
      
      if (currentReversedIndex !== -1 && reversedIndex !== currentReversedIndex) {
        // Calculate target order: in reversed list, index 0 = highest order (top layer)
        // Convert reversed index to actual order position
        // reversedIndex 0 = order (length - 1), reversedIndex 1 = order (length - 2), etc.
        const targetOrder = currentLayersReversed.length - 1 - reversedIndex;
        onReorderLayer(layerId, targetOrder);
        lastReorderTimeRef.current = now;
      }
    }
  }, [onReorderLayer]);

  const handleDragEnd = useCallback(() => {
    // Clean up listeners
    if (dragListenersRef.current.move) {
      document.removeEventListener('mousemove', dragListenersRef.current.move);
    }
    if (dragListenersRef.current.up) {
      document.removeEventListener('mouseup', dragListenersRef.current.up);
    }
    dragListenersRef.current = { move: null, up: null };
    
    setDraggingLayerId(null);
  }, []);

  const handleDragStart = useCallback((layerId: string, event: React.MouseEvent) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) {
      return;
    }

    setDraggingLayerId(layerId);
    dragStartYRef.current = event.clientY;
    dragStartOrderRef.current = layer.order;
    lastReorderTimeRef.current = 0;
    event.preventDefault();
    
    // Set up global drag listeners
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(layerId, e);
    };
    const handleMouseUp = () => {
      handleDragEnd();
    };

    dragListenersRef.current = { move: handleMouseMove, up: handleMouseUp };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [layers, handleDragMove, handleDragEnd]);

  // Get the layer that corresponds to the selected shape
  const selectedLayerId = selectedShapeId
    ? layers.find((l) => l.shapeId === selectedShapeId)?.id
    : null;

  if (layers.length === 0) {
    return (
      <div className="layer-panel" data-testid="layer-panel">
        <div className="layer-panel__header">
          <h3 className="layer-panel__title">Layers</h3>
        </div>
        <div className="layer-panel__empty" data-testid="layer-panel-empty">
          No layers yet
        </div>
      </div>
    );
  }

  return (
    <div className="layer-panel" data-testid="layer-panel" ref={panelRef}>
      <div className="layer-panel__header">
        <h3 className="layer-panel__title">Layers</h3>
      </div>
      <div className="layer-panel__list" data-testid="layer-panel-list">
        {layersReversed.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            isSelected={layer.id === selectedLayerId}
            onSelect={onSelectShape}
            onRename={onRenameLayer}
            onDragStart={handleDragStart}
            onDragMove={() => {}} // Not used, handled globally
            onDragEnd={() => {}} // Not used, handled globally
            isDragging={draggingLayerId === layer.id}
          />
        ))}
      </div>
    </div>
  );
}

