import type { Meta, StoryObj } from '@storybook/react';
import { Logout } from './Logout';

// NOTE: This story may not work properly because Logout depends on auth context
// jest.mock doesn't work in Storybook - consider using decorators or MSW for proper mocking
// For now, this will only work if the auth context is available in the Storybook environment

const meta = {
  title: 'Components/Logout',
  component: Logout,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'unstyled', 'dev'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Logout button component that signs the user out when pressed. Wraps the Button component with auth functionality.',
      },
    },
  },
} satisfies Meta<typeof Logout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
