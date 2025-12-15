import type { Meta, StoryObj } from '@storybook/react-vite';
import { Example } from './Example';

/**
 * Example component demonstrating basic component structure.
 * 
 * This is a simple example component that accepts a title prop
 * and displays it along with a description.
 */
const meta: Meta<typeof Example> = {
  title: 'Components/Example',
  component: Example,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A simple example component showcasing component structure and prop usage.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title text to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Example>;

/**
 * Default example with default title.
 */
export const Default: Story = {
  args: {},
};

/**
 * Example with custom title prop.
 */
export const CustomTitle: Story = {
  args: {
    title: 'Custom Example Title',
  },
};

/**
 * Example with a longer title.
 */
export const LongTitle: Story = {
  args: {
    title: 'This is a much longer example title that demonstrates how the component handles longer text',
  },
};

/**
 * Example with a short title.
 */
export const ShortTitle: Story = {
  args: {
    title: 'Hi',
  },
};

/**
 * Example with special characters in title.
 */
export const SpecialCharacters: Story = {
  args: {
    title: 'Example with Special Characters: !@#$%^&*()',
  },
};

/**
 * Example with empty title (uses default).
 */
export const EmptyTitle: Story = {
  args: {
    title: '',
  },
};
