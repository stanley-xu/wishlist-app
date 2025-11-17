import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Spacer from './Spacer';

const meta = {
  title: 'Layout/Spacer',
  component: Spacer,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
  args: {
    size: 'md',
    direction: 'vertical',
  },
} satisfies Meta<typeof Spacer>;

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

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    size: 'md',
  },
  render: (args) => (
    <View>
      <Box>First Item</Box>
      <Spacer {...args} />
      <Box>Second Item</Box>
    </View>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    size: 'md',
  },
  render: (args) => (
    <View style={{ flexDirection: 'row' }}>
      <Box>First</Box>
      <Spacer {...args} />
      <Box>Second</Box>
    </View>
  ),
};

export const SmallVertical: Story = {
  args: {
    direction: 'vertical',
    size: 'sm',
  },
  render: (args) => (
    <View>
      <Box>Item 1</Box>
      <Spacer {...args} />
      <Box>Item 2</Box>
    </View>
  ),
};

export const LargeVertical: Story = {
  args: {
    direction: 'vertical',
    size: 'lg',
  },
  render: (args) => (
    <View>
      <Box>Item 1</Box>
      <Spacer {...args} />
      <Box>Item 2</Box>
    </View>
  ),
};

export const ExtraLargeVertical: Story = {
  args: {
    direction: 'vertical',
    size: '2xl',
  },
  render: (args) => (
    <View>
      <Box>Item 1</Box>
      <Spacer {...args} />
      <Box>Item 2</Box>
    </View>
  ),
};

export const MultipleSections: Story = {
  args: {
    direction: 'vertical',
    size: 'lg',
  },
  render: (args) => (
    <View>
      <Box>Section 1</Box>
      <Spacer {...args} />
      <Box>Section 2</Box>
      <Spacer {...args} />
      <Box>Section 3</Box>
    </View>
  ),
};
