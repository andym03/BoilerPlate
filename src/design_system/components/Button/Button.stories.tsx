import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

/**
 * Button component from the design system.
 * 
 * Supports multiple variants (primary, secondary, warning, info, danger),
 * sizes (small, medium, large), and states (default, disabled).
 */
const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'warning', 'info', 'danger'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Default primary button with medium size.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
  },
};

/**
 * Primary variant button - the default style.
 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'medium',
  },
};

/**
 * Secondary variant button with purple styling.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
  },
};

/**
 * Warning variant button with yellow styling.
 */
export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'warning',
    size: 'medium',
  },
};

/**
 * Info variant button with light blue styling.
 */
export const Info: Story = {
  args: {
    children: 'Info Button',
    variant: 'info',
    size: 'medium',
  },
};

/**
 * Danger variant button with red styling.
 */
export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    size: 'medium',
  },
};

/**
 * Small size button.
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
};

/**
 * Medium size button (default).
 */
export const Medium: Story = {
  args: {
    children: 'Medium Button',
    variant: 'primary',
    size: 'medium',
  },
};

/**
 * Large size button.
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
};

/**
 * Disabled state button - non-interactive.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
};

/**
 * Interactive button with onClick handler.
 */
export const Interactive: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    size: 'medium',
    onClick: () => alert('Button clicked!'),
  },
};

/**
 * All variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

/**
 * All sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </div>
  ),
};

/**
 * All variants in disabled state.
 */
export const AllVariantsDisabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="warning" disabled>Warning</Button>
      <Button variant="info" disabled>Info</Button>
      <Button variant="danger" disabled>Danger</Button>
    </div>
  ),
};
