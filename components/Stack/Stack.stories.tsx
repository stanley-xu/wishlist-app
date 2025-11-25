import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Stack from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  args: {
    spacing: 'md',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: string }) => (
  <View
    style={{
      padding: 16,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
    }}
  >
    <Text>{children}</Text>
  </View>
);

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>First Item</Box>
      <Box>Second Item</Box>
      <Box>Third Item</Box>
    </Stack>
  ),
};

export const SmallSpacing: Story = {
  args: {
    spacing: 'sm',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const ExtraLargeSpacing: Story = {
  args: {
    spacing: '2xl',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const ManyItems: Story = {
  args: {
    spacing: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
      <Box>Item 6</Box>
    </Stack>
  ),
};
