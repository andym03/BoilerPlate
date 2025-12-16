import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolbarButton } from './ToolbarButton';

describe('ToolbarButton', () => {
  it('renders with label and icon', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        onClick={() => {}}
      />
    );
    
    expect(screen.getByRole('button', { name: /rectangle/i })).toBeInTheDocument();
    expect(screen.getByText('▭')).toBeInTheDocument();
  });

  it('applies active state when active prop is true', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        active={true}
        onClick={() => {}}
      />
    );
    
    const button = screen.getByRole('button', { name: /rectangle/i });
    expect(button).toHaveClass('toolbar-button--active');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies inactive state when active prop is false', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        active={false}
        onClick={() => {}}
      />
    );
    
    const button = screen.getByRole('button', { name: /rectangle/i });
    expect(button).not.toHaveClass('toolbar-button--active');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        onClick={handleClick}
      />
    );
    
    const button = screen.getByRole('button', { name: /rectangle/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('uses custom aria-label when provided', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        aria-label="Create rectangle shape"
        onClick={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Create rectangle shape')).toBeInTheDocument();
  });

  it('uses label as aria-label when aria-label is not provided', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        onClick={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Rectangle')).toBeInTheDocument();
  });

  it('has test id for testing', () => {
    render(
      <ToolbarButton
        tool="rectangle"
        label="Rectangle"
        icon="▭"
        onClick={() => {}}
      />
    );
    
    expect(screen.getByTestId('toolbar-button-rectangle')).toBeInTheDocument();
  });
});

