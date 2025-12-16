import type { RectangleEditableFields } from '@/shapes/types';

export interface RectangleFieldsProps {
  fields: Pick<RectangleEditableFields, 'width' | 'height'>;
  /**
   * Event handler that accepts string values from input events.
   * The parent component is responsible for converting to number.
   */
  onChange: (field: 'width' | 'height', value: string) => void;
}

/**
 * Field component for editing rectangle-specific properties
 */
export function RectangleFields({ fields, onChange }: RectangleFieldsProps) {
  return (
    <>
      <div className="shape-modal-field">
        <label htmlFor="width">Width</label>
        <input
          id="width"
          type="number"
          value={fields.width}
          onChange={(e) => onChange('width', e.target.value)}
          min="1"
          data-testid="shape-modal-width"
        />
      </div>

      <div className="shape-modal-field">
        <label htmlFor="height">Height</label>
        <input
          id="height"
          type="number"
          value={fields.height}
          onChange={(e) => onChange('height', e.target.value)}
          min="1"
          data-testid="shape-modal-height"
        />
      </div>
    </>
  );
}

