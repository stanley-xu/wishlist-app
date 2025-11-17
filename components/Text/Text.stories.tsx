import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: ['regular', 'italic', 'error'],
    },
  },
  args: {
    children: 'Sample text',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    variant: 'regular',
    children: 'This is regular text',
  },
};

export const Italic: Story = {
  args: {
    variant: 'italic',
    children: 'This is italic text',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'This is error text',
  },
};

export const LongText: Story = {
  args: {
    variant: 'regular',
    children: 'This is a longer piece of text to demonstrate how the Text component handles multiple lines and longer content. It should wrap naturally based on the container width.',
  },
};
