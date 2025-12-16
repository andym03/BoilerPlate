import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerItem } from './LayerItem';
import type { Layer } from '@/layers/types';

const mockLayer: Layer = {
  id: 'layer-1',
  shapeId: 'shape-1',
  name: 'Rectangle 1',
  order: 0,
};

describe('LayerItem', () => {
  it('renders layer name', () => {
    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    expect(screen.getByText('Rectangle 1')).toBeInTheDocument();
    expect(screen.getByTestId('layer-name-layer-1')).toBeInTheDocument();
  });

  it('applies selected class when selected', () => {
    render(
      <LayerItem
        layer={mockLayer}
        isSelected={true}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    expect(layerItem).toHaveClass('layer-item--selected');
  });

  it('applies dragging class when dragging', () => {
    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={true}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    expect(layerItem).toHaveClass('layer-item--dragging');
  });

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={handleSelect}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.click(layerItem);

    expect(handleSelect).toHaveBeenCalledWith('shape-1');
  });

  it('enters edit mode on double click', async () => {
    const user = userEvent.setup();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.dblClick(layerItem);

    const input = screen.getByTestId('layer-name-input-layer-1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Rectangle 1');
  });

  it('calls onRename when name is edited and blurred', async () => {
    const user = userEvent.setup();
    const handleRename = jest.fn();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={handleRename}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.dblClick(layerItem);

    const input = screen.getByTestId('layer-name-input-layer-1');
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.tab(); // Blur the input

    expect(handleRename).toHaveBeenCalledWith('layer-1', 'New Name');
  });

  it('cancels edit on Escape key', async () => {
    const user = userEvent.setup();
    const handleRename = jest.fn();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={handleRename}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.dblClick(layerItem);

    const input = screen.getByTestId('layer-name-input-layer-1');
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.keyboard('{Escape}');

    expect(handleRename).not.toHaveBeenCalled();
    expect(screen.getByText('Rectangle 1')).toBeInTheDocument();
  });

  it('saves edit on Enter key', async () => {
    const user = userEvent.setup();
    const handleRename = jest.fn();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={handleRename}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.dblClick(layerItem);

    const input = screen.getByTestId('layer-name-input-layer-1');
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.keyboard('{Enter}');

    expect(handleRename).toHaveBeenCalledWith('layer-1', 'New Name');
  });

  it('does not call onRename if name is unchanged', async () => {
    const user = userEvent.setup();
    const handleRename = jest.fn();

    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={handleRename}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    await user.dblClick(layerItem);

    await user.tab(); // Blur without changing

    expect(handleRename).not.toHaveBeenCalled();
  });

  it('has accessible attributes', () => {
    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    const layerItem = screen.getByTestId('layer-item-layer-1');
    expect(layerItem).toHaveAttribute('role', 'button');
    expect(layerItem).toHaveAttribute('aria-label', 'Layer Rectangle 1');
    expect(layerItem).toHaveAttribute('tabIndex', '0');
  });

  it('renders drag handle', () => {
    render(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={() => {}}
        onRename={() => {}}
        onDragStart={() => {}}
        onDragMove={() => {}}
        onDragEnd={() => {}}
        isDragging={false}
      />
    );

    expect(screen.getByTestId('layer-drag-handle-layer-1')).toBeInTheDocument();
  });
});

