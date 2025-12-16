import { useState, useEffect, useMemo } from 'react';
import type { 
  Shape, 
  BaseEditableFields,
  RectangleEditableFields,
  CircleEditableFields,
  TriangleEditableFields,
  StarEditableFields
} from '@/shapes/types';
import { 
  BaseFields, 
  RectangleFields, 
  CircleFields, 
  TriangleFields, 
  StarFields 
} from './fields';
import './ShapeModal.css';

export interface ShapeModalProps {
  shapeId: string | null;
  shapes: Shape[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (shapeId: string, updates: Partial<Shape>) => void;
}

/**
 * Shape modal component for editing shape properties
 */
export function ShapeModal({ shapeId, shapes, isOpen, onClose, onUpdate }: ShapeModalProps) {
  // Find the shape from the store using shapeId
  const shape = useMemo(() => {
    if (!shapeId) return null;
    return shapes.find((s) => s.id === shapeId) ?? null;
  }, [shapeId, shapes]);
  const [baseFields, setBaseFields] = useState<BaseEditableFields>({
    x: 0,
    y: 0,
    fillColor: '#000000',
  });
  const [rectangleFields, setRectangleFields] = useState<Pick<RectangleEditableFields, 'width' | 'height'>>({
    width: 0,
    height: 0,
  });
  const [circleFields, setCircleFields] = useState<Pick<CircleEditableFields, 'radius'>>({
    radius: 0,
  });
  const [triangleFields, setTriangleFields] = useState<Pick<TriangleEditableFields, 'width' | 'height'>>({
    width: 0,
    height: 0,
  });
  const [starFields, setStarFields] = useState<Pick<StarEditableFields, 'outerRadius' | 'innerRadius'>>({
    outerRadius: 0,
    innerRadius: 0,
  });

  // Update form data when shape changes
  useEffect(() => {
    if (shape) {
      setBaseFields({
        x: shape.x,
        y: shape.y,
        fillColor: shape.fillColor,
      });

      switch (shape.type) {
        case 'rectangle':
          setRectangleFields({
            width: shape.width,
            height: shape.height,
          });
          break;
        case 'circle':
          setCircleFields({
            radius: shape.radius,
          });
          break;
        case 'triangle':
          setTriangleFields({
            width: shape.width,
            height: shape.height,
          });
          break;
        case 'star':
          setStarFields({
            outerRadius: shape.outerRadius,
            innerRadius: shape.innerRadius,
          });
          break;
      }
    }
  }, [shape]);

  if (!isOpen || !shape) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shape) return;

    // Build updates from base fields and shape-specific fields.
    // No conversion needed - state is already typed correctly (numbers for numeric fields, strings for string fields).
    const updates: Partial<Shape> = {
      x: baseFields.x,
      y: baseFields.y,
      fillColor: baseFields.fillColor,
    };

    switch (shape.type) {
      case 'rectangle':
        Object.assign(updates, {
          width: rectangleFields.width,
          height: rectangleFields.height,
        });
        break;
      case 'circle':
        Object.assign(updates, {
          radius: circleFields.radius,
        });
        break;
      case 'triangle':
        Object.assign(updates, {
          width: triangleFields.width,
          height: triangleFields.height,
        });
        break;
      case 'star':
        Object.assign(updates, {
          outerRadius: starFields.outerRadius,
          innerRadius: starFields.innerRadius,
        });
        break;
    }

    onUpdate(shape.id, updates);
    onClose();
  };

  /**
   * Type-safe handler for base fields.
   * Converts string input to the correct type (number for numeric fields, string for string fields).
   */
  const handleBaseFieldChange = (field: keyof BaseEditableFields, value: string) => {
    if (field === 'fillColor') {
      // String field - no conversion needed
      setBaseFields((prev) => ({
        ...prev,
        fillColor: value,
      }));
    } else if (field === 'x' || field === 'y') {
      // Numeric fields - convert string to number
      const numValue = Number(value) || 0;
      setBaseFields((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  /**
   * Type-safe handler for rectangle fields.
   * Converts string input to number for numeric fields.
   */
  const handleRectangleFieldChange = (field: 'width' | 'height', value: string) => {
    const numValue = Number(value) || 0;
    setRectangleFields((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  /**
   * Type-safe handler for circle fields.
   * Converts string input to number for numeric fields.
   */
  const handleCircleFieldChange = (field: 'radius', value: string) => {
    const numValue = Number(value) || 0;
    setCircleFields((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  /**
   * Type-safe handler for triangle fields.
   * Converts string input to number for numeric fields.
   */
  const handleTriangleFieldChange = (field: 'width' | 'height', value: string) => {
    const numValue = Number(value) || 0;
    setTriangleFields((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  /**
   * Type-safe handler for star fields.
   * Converts string input to number for numeric fields.
   */
  const handleStarFieldChange = (field: 'outerRadius' | 'innerRadius', value: string) => {
    const numValue = Number(value) || 0;
    setStarFields((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const getShapeTypeLabel = () => {
    return shape.type.charAt(0).toUpperCase() + shape.type.slice(1);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the overlay (not if the click bubbled from inside)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="shape-modal-overlay" onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()} data-testid="shape-modal-overlay">
      <div className="shape-modal" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <div className="shape-modal-header">
          <h2>Edit {getShapeTypeLabel()}</h2>
          <button
            className="shape-modal-close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="shape-modal-close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="shape-modal-form">
          <BaseFields fields={baseFields} onChange={handleBaseFieldChange} />

          {shape.type === 'rectangle' && (
            <RectangleFields fields={rectangleFields} onChange={handleRectangleFieldChange} />
          )}

          {shape.type === 'circle' && (
            <CircleFields fields={circleFields} onChange={handleCircleFieldChange} />
          )}

          {shape.type === 'triangle' && (
            <TriangleFields fields={triangleFields} onChange={handleTriangleFieldChange} />
          )}

          {shape.type === 'star' && (
            <StarFields fields={starFields} onChange={handleStarFieldChange} />
          )}

          <div className="shape-modal-actions">
            <button type="button" onClick={onClose} className="shape-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="shape-modal-apply" data-testid="shape-modal-apply">
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

