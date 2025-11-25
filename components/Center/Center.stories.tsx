import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Center from './Center';

const meta = {
  title: 'Layout/Center',
  component: Center,
  argTypes: {
    fill: {
      control: 'boolean',
    },
  },
  args: {
    fill: true,
  },
  decorators: [
    (Story) => (
      <View style={{ height: 300, borderWidth: 1, borderColor: '#ccc' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Center>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: string }) => (
  <View
    style={{
      padding: 20,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
    }}
  >
    <Text>{children}</Text>
  </View>
);

export const Default: Story = {
  args: {
    fill: true,
  },
  render: (args) => (
    <Center {...args}>
      <Box>Centered Content</Box>
    </Center>
  ),
};

export const NoFill: Story = {
  args: {
    fill: false,
  },
  render: (args) => (
    <Center {...args}>
      <Box>Centered (no fill)</Box>
    </Center>
  ),
};

export const LoadingState: Story = {
  args: {
    fill: true,
  },
  render: (args) => (
    <Center {...args}>
      <Text style={{ fontSize: 24 }}>Loading...</Text>
    </Center>
  ),
};

export const EmptyState: Story = {
  args: {
    fill: true,
  },
  render: (args) => (
    <Center {...args}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>No items found</Text>
        <Text style={{ color: '#666' }}>Try adding some items</Text>
      </View>
    </Center>
  ),
};

export const MultipleItems: Story = {
  args: {
    fill: true,
  },
  render: (args) => (
    <Center {...args}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Text style={{ fontSize: 24 }}>✓</Text>
        <Text>Success!</Text>
      </View>
    </Center>
  ),
};
