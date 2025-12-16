import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Canvas } from './Canvas';
import { createRectangle } from '@/shapes/Rectangle';
import { createCircle } from '@/shapes/Circle';

const CANVAS_SIZE = { width: 1920, height: 1080 };

describe('Canvas', () => {
  it('renders canvas element', () => {
    render(<Canvas shapes={[]} layers={[]} canvasSize={CANVAS_SIZE} />);
    
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-label', 'Drawing canvas');
  });

  it('renders canvas container', () => {
    render(<Canvas shapes={[]} layers={[]} canvasSize={CANVAS_SIZE} />);
    
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });

  it('calls onClick handler when canvas is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(
      <Canvas
        shapes={[]}
        layers={[]}
        canvasSize={CANVAS_SIZE}
        onClick={handleClick}
      />
    );
    
    const canvas = screen.getByTestId('canvas');
    await user.click(canvas);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies crosshair cursor when onClick is provided', () => {
    const handleClick = jest.fn();
    
    render(
      <Canvas
        shapes={[]}
        layers={[]}
        canvasSize={CANVAS_SIZE}
        onClick={handleClick}
      />
    );
    
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveStyle({ cursor: 'crosshair' });
  });

  it('applies default cursor when onClick is not provided', () => {
    render(<Canvas shapes={[]} layers={[]} canvasSize={CANVAS_SIZE} />);
    
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveStyle({ cursor: 'default' });
  });

  it('renders with shapes', () => {
    const shapes = [
      createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6'),
      createCircle('circle-1', 400, 100, 75, '#22c55e'),
    ];
    const layers = [
      { id: 'layer-1', shapeId: 'rect-1', name: 'Rectangle', order: 0 },
      { id: 'layer-2', shapeId: 'circle-1', name: 'Circle', order: 1 },
    ];
    
    render(<Canvas shapes={shapes} layers={layers} canvasSize={CANVAS_SIZE} />);
    
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
    // Canvas rendering is tested visually, but we can verify the component renders
  });
});

