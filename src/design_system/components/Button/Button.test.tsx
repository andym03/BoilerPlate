import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ds-button', 'ds-button--primary', 'ds-button--medium');
    });

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button', 'custom-class');
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--primary');
    });

    it('renders primary variant explicitly', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--primary');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--secondary');
    });

    it('renders warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--warning');
    });

    it('renders info variant', () => {
      render(<Button variant="info">Info</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--info');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--danger');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--medium');
    });

    it('renders small size', () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--small');
    });

    it('renders medium size explicitly', () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--medium');
    });

    it('renders large size', () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button--large');
    });
  });

  describe('Disabled state', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('ds-button--disabled');
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not have disabled class when not disabled', () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('ds-button--disabled');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick with event object', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click',
        target: button,
      }));
    });
  });

  describe('Standard button props', () => {
    it('supports type prop', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('can set type="button" explicitly', () => {
      render(<Button type="button">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toBeInTheDocument();
    });

    it('supports data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });

    it('supports id prop', () => {
      render(<Button id="my-button">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'my-button');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = jest.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('ref provides access to button element', () => {
      let buttonElement: HTMLButtonElement | null = null;
      const ref = (node: HTMLButtonElement | null) => {
        buttonElement = node;
      };
      render(<Button ref={ref}>Button</Button>);
      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect((buttonElement as HTMLButtonElement | null)?.textContent).toBe('Button');
    });
  });

  describe('Combined props', () => {
    it('renders with variant, size, and className together', () => {
      render(
        <Button variant="danger" size="large" className="custom-class">
          Combined
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'ds-button',
        'ds-button--danger',
        'ds-button--large',
        'custom-class'
      );
    });

    it('renders disabled button with variant and size', () => {
      render(
        <Button variant="secondary" size="small" disabled>
          Disabled Secondary Small
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        'ds-button',
        'ds-button--secondary',
        'ds-button--small',
        'ds-button--disabled'
      );
    });
  });

  describe('Edge cases', () => {
    it('handles empty className prop', () => {
      render(<Button className="">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button');
    });

    it('handles multiple className values', () => {
      render(<Button className="class1 class2">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ds-button', 'class1', 'class2');
    });

    it('renders with complex children', () => {
      render(
        <Button>
          <span>Icon</span> Text
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });
});
