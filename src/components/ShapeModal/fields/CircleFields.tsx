import type { CircleEditableFields } from '@/shapes/types';

export interface CircleFieldsProps {
  fields: Pick<CircleEditableFields, 'radius'>;
  /**
   * Event handler that accepts string values from input events.
   * The parent component is responsible for converting to number.
   */
  onChange: (field: 'radius', value: string) => void;
}

/**
 * Field component for editing circle-specific properties
 */
export function CircleFields({ fields, onChange }: CircleFieldsProps) {
  return (
    <div className="shape-modal-field">
      <label htmlFor="radius">Radius</label>
      <input
        id="radius"
        type="number"
        value={fields.radius}
        onChange={(e) => onChange('radius', e.target.value)}
        min="1"
        data-testid="shape-modal-radius"
      />
    </div>
  );
}

