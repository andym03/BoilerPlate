import { ToolbarButton } from './ToolbarButton';
import type { ShapeType } from '@/shapes/types';
import './Toolbar.css';

export type Tool = 'select' | ShapeType;

export interface ToolbarProps {
  /**
   * Currently active tool
   */
  activeTool: Tool;
  /**
   * Tool change handler
   */
  onToolChange: (tool: Tool) => void;
  /**
   * Handler for SVG export
   */
  onExportSVG?: () => void;
  /**
   * Handler for PNG export
   */
  onExportPNG?: () => void;
}

const TOOLS: Array<{ tool: Tool; label: string; icon: string }> = [
  { tool: 'select', label: 'Select', icon: '👆' },
  { tool: 'rectangle', label: 'Rectangle', icon: '▭' },
  { tool: 'circle', label: 'Circle', icon: '○' },
  { tool: 'triangle', label: 'Triangle', icon: '△' },
  { tool: 'star', label: 'Star', icon: '★' },
];

/**
 * Toolbar component for selecting tools and creating shapes
 */
export function Toolbar({ activeTool, onToolChange, onExportSVG, onExportPNG }: ToolbarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Drawing tools" data-testid="toolbar">
      {TOOLS.map(({ tool, label, icon }) => (
        <ToolbarButton
          key={tool}
          tool={tool}
          label={label}
          icon={icon}
          active={activeTool === tool}
          onClick={() => onToolChange(tool)}
        />
      ))}
      {(onExportSVG || onExportPNG) && (
        <div className="toolbar-separator" data-testid="toolbar-separator" />
      )}
      {onExportSVG && (
        <ToolbarButton
          tool="export-svg"
          label="Export SVG"
          icon="📥"
          active={false}
          onClick={onExportSVG}
        />
      )}
      {onExportPNG && (
        <ToolbarButton
          tool="export-png"
          label="Export PNG"
          icon="🖼️"
          active={false}
          onClick={onExportPNG}
        />
      )}
    </div>
  );
}

