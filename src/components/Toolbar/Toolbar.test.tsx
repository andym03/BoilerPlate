import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('renders all tools', () => {
    render(<Toolbar activeTool="select" onToolChange={() => {}} />);
    
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rectangle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /circle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /triangle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /star/i })).toBeInTheDocument();
  });

  it('marks active tool with aria-pressed', () => {
    render(<Toolbar activeTool="rectangle" onToolChange={() => {}} />);
    
    const rectangleButton = screen.getByRole('button', { name: /rectangle/i });
    expect(rectangleButton).toHaveAttribute('aria-pressed', 'true');
    
    const selectButton = screen.getByRole('button', { name: /select/i });
    expect(selectButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onToolChange when a tool is clicked', async () => {
    const user = userEvent.setup();
    const handleToolChange = jest.fn();
    
    render(<Toolbar activeTool="select" onToolChange={handleToolChange} />);
    
    const rectangleButton = screen.getByRole('button', { name: /rectangle/i });
    await user.click(rectangleButton);
    
    expect(handleToolChange).toHaveBeenCalledWith('rectangle');
  });

  it('has accessible labels for all buttons', () => {
    render(<Toolbar activeTool="select" onToolChange={() => {}} />);
    
    expect(screen.getByLabelText(/select/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rectangle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/circle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/triangle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/star/i)).toBeInTheDocument();
  });

  it('has toolbar role with accessible name', () => {
    render(<Toolbar activeTool="select" onToolChange={() => {}} />);
    
    const toolbar = screen.getByRole('toolbar', { name: /drawing tools/i });
    expect(toolbar).toBeInTheDocument();
  });
});

