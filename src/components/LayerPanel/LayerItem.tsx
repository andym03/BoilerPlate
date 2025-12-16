import { useState, useRef, useEffect } from 'react';
import type { Layer } from '@/layers/types';
import './LayerItem.css';

export interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (shapeId: string) => void;
  onRename: (layerId: string, newName: string) => void;
  onDragStart: (layerId: string, event: React.MouseEvent) => void;
  onDragMove?: (layerId: string, event: MouseEvent) => void; // Not used, kept for API consistency
  onDragEnd?: () => void; // Not used, kept for API consistency
  isDragging: boolean;
}

/**
 * Individual layer item component with rename and drag functionality
 */
export function LayerItem({
  layer,
  isSelected,
  onSelect,
  onRename,
  onDragStart,
  isDragging,
}: LayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update edit value when layer name changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(layer.name);
    }
  }, [layer.name, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(layer.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (editValue.trim() !== '' && editValue !== layer.name) {
      onRename(layer.id, editValue.trim());
    } else {
      setEditValue(layer.name);
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setEditValue(layer.name);
      setIsEditing(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on input
    if (isEditing || (e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }
    onDragStart(layer.id, e);
  };

  return (
    <div
      className={`layer-item ${isSelected ? 'layer-item--selected' : ''} ${isDragging ? 'layer-item--dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={() => !isEditing && onSelect(layer.shapeId)}
      onDoubleClick={handleDoubleClick}
      data-testid={`layer-item-${layer.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Layer ${layer.name}`}
    >
      <div className="layer-item__drag-handle" ref={dragHandleRef} data-testid={`layer-drag-handle-${layer.id}`}>
        ⋮⋮
      </div>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="layer-item__name-input"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={(e) => e.stopPropagation()}
          data-testid={`layer-name-input-${layer.id}`}
        />
      ) : (
        <span className="layer-item__name" data-testid={`layer-name-${layer.id}`}>
          {layer.name}
        </span>
      )}
    </div>
  );
}

