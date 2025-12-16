import type { BaseEditableFields } from '@/shapes/types';

export interface BaseFieldsProps {
  fields: BaseEditableFields;
  /**
   * Event handler that accepts string values from input events.
   * The parent component is responsible for converting to the correct type.
   */
  onChange: (field: keyof BaseEditableFields, value: string) => void;
}

/**
 * Field component for editing base properties common to all shapes
 */
export function BaseFields({ fields, onChange }: BaseFieldsProps) {
  return (
    <>
      <div className="shape-modal-field">
        <label htmlFor="x">X Position</label>
        <input
          id="x"
          type="number"
          value={fields.x}
          onChange={(e) => onChange('x', e.target.value)}
          data-testid="shape-modal-x"
        />
      </div>

      <div className="shape-modal-field">
        <label htmlFor="y">Y Position</label>
        <input
          id="y"
          type="number"
          value={fields.y}
          onChange={(e) => onChange('y', e.target.value)}
          data-testid="shape-modal-y"
        />
      </div>

      <div className="shape-modal-field">
        <label htmlFor="fillColor">Fill Color</label>
        <input
          id="fillColor"
          type="color"
          value={fields.fillColor}
          onChange={(e) => onChange('fillColor', e.target.value)}
          data-testid="shape-modal-fill-color"
        />
      </div>
    </>
  );
}

