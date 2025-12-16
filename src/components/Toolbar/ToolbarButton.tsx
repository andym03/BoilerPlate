import './ToolbarButton.css';

export interface ToolbarButtonProps {
  /**
   * Tool identifier
   */
  tool: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Whether this tool is currently active
   */
  active?: boolean;
  /**
   * Icon or emoji to display
   */
  icon?: string;
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Toolbar button component
 */
export function ToolbarButton({
  tool,
  label,
  active = false,
  icon,
  onClick,
  'aria-label': ariaLabel,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`toolbar-button ${active ? 'toolbar-button--active' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-pressed={active}
      data-testid={`toolbar-button-${tool}`}
    >
      {icon && <span className="toolbar-button__icon" aria-hidden="true">{icon}</span>}
      <span className="toolbar-button__label">{label}</span>
    </button>
  );
}

