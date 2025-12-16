import type { StarEditableFields } from '@/shapes/types';

export interface StarFieldsProps {
  fields: Pick<StarEditableFields, 'outerRadius' | 'innerRadius'>;
  /**
   * Event handler that accepts string values from input events.
   * The parent component is responsible for converting to number.
   */
  onChange: (field: 'outerRadius' | 'innerRadius', value: string) => void;
}

/**
 * Field component for editing star-specific properties
 */
export function StarFields({ fields, onChange }: StarFieldsProps) {
  return (
    <>
      <div className="shape-modal-field">
        <label htmlFor="outerRadius">Outer Radius</label>
        <input
          id="outerRadius"
          type="number"
          value={fields.outerRadius}
          onChange={(e) => onChange('outerRadius', e.target.value)}
          min="1"
          data-testid="shape-modal-outer-radius"
        />
      </div>

      <div className="shape-modal-field">
        <label htmlFor="innerRadius">Inner Radius</label>
        <input
          id="innerRadius"
          type="number"
          value={fields.innerRadius}
          onChange={(e) => onChange('innerRadius', e.target.value)}
          min="1"
          data-testid="shape-modal-inner-radius"
        />
      </div>
    </>
  );
}

