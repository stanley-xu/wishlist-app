import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Container from './Container';

const meta = {
  title: 'Components/Container',
  component: Container,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <View style={{ padding: 20 }}>
        <Text>Container with background color</Text>
      </View>
    ),
  },
};

export const WithMultipleChildren: Story = {
  args: {
    children: (
      <View style={{ padding: 20 }}>
        <Text>First child</Text>
        <Text>Second child</Text>
        <Text>Third child</Text>
      </View>
    ),
  },
};

export const Tall: Story = {
  args: {
    children: (
      <View style={{ padding: 20, height: 300, justifyContent: 'center' }}>
        <Text>Tall container (300px height)</Text>
      </View>
    ),
  },
};
