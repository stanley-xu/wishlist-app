import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    onPress: { action: 'pressed' },
  },
  args: {
    title: 'Button',
    onPress: () => {},
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// Individual stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    title: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    title: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    title: 'Outline Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    title: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
  },
};
