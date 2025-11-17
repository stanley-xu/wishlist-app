import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Logout } from './Logout';

// Mock the auth context for Storybook
jest.mock('@/lib/auth', () => ({
  useAuthContext: () => ({
    signOut: async () => {
      console.log('Sign out action triggered');
    },
  }),
}));

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
