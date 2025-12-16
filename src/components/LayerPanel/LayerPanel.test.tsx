import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerPanel } from './LayerPanel';
import type { Layer } from '@/layers/types';

const mockLayers: Layer[] = [
  { id: 'layer-1', shapeId: 'shape-1', name: 'Rectangle 1', order: 0 },
  { id: 'layer-2', shapeId: 'shape-2', name: 'Circle 1', order: 1 },
  { id: 'layer-3', shapeId: 'shape-3', name: 'Triangle 1', order: 2 },
];

describe('LayerPanel', () => {
  it('renders empty state when no layers', () => {
    render(
      <LayerPanel
        layers={[]}
        selectedShapeId={null}
        onSelectShape={() => {}}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    expect(screen.getByTestId('layer-panel')).toBeInTheDocument();
    expect(screen.getByTestId('layer-panel-empty')).toBeInTheDocument();
    expect(screen.getByText('No layers yet')).toBeInTheDocument();
  });

  it('renders all layers', () => {
    render(
      <LayerPanel
        layers={mockLayers}
        selectedShapeId={null}
        onSelectShape={() => {}}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    expect(screen.getByTestId('layer-panel')).toBeInTheDocument();
    expect(screen.getByTestId('layer-panel-list')).toBeInTheDocument();
    expect(screen.getByText('Rectangle 1')).toBeInTheDocument();
    expect(screen.getByText('Circle 1')).toBeInTheDocument();
    expect(screen.getByText('Triangle 1')).toBeInTheDocument();
  });

  it('highlights selected layer', () => {
    render(
      <LayerPanel
        layers={mockLayers}
        selectedShapeId="shape-2"
        onSelectShape={() => {}}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-2');
    expect(layerItem).toHaveClass('layer-item--selected');
  });

  it('calls onSelectShape when layer is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <LayerPanel
        layers={mockLayers}
        selectedShapeId={null}
        onSelectShape={handleSelect}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.click(layerItem);

    expect(handleSelect).toHaveBeenCalledWith('shape-1');
  });

  it('displays layers in reverse order (top layer first)', () => {
    render(
      <LayerPanel
        layers={mockLayers}
        selectedShapeId={null}
        onSelectShape={() => {}}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    const layerItems = screen.getAllByTestId(/^layer-item-/);
    // Should be in reverse order: Triangle (order 2), Circle (order 1), Rectangle (order 0)
    expect(layerItems[0]).toHaveAttribute('data-testid', 'layer-item-layer-3');
    expect(layerItems[1]).toHaveAttribute('data-testid', 'layer-item-layer-2');
    expect(layerItems[2]).toHaveAttribute('data-testid', 'layer-item-layer-1');
  });

  it('has accessible structure', () => {
    render(
      <LayerPanel
        layers={mockLayers}
        selectedShapeId={null}
        onSelectShape={() => {}}
        onRenameLayer={() => {}}
        onReorderLayer={() => {}}
      />
    );

    expect(screen.getByText('Layers')).toBeInTheDocument();
    expect(screen.getByTestId('layer-panel')).toBeInTheDocument();
  });
});

