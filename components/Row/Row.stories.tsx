import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Row from './Row';

const meta = {
  title: 'Layout/Row',
  component: Row,
  argTypes: {
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    wrap: {
      control: 'boolean',
    },
  },
  args: {
    spacing: 'md',
    align: 'center',
    justify: 'flex-start',
    wrap: false,
  },
} satisfies Meta<typeof Row>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ children, height }: { children: string; height?: number }) => (
  <View
    style={{
      padding: 16,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
      height,
    }}
  >
    <Text>{children}</Text>
  </View>
);

export const Default: Story = {
  render: (args) => (
    <Row {...args}>
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Row>
  ),
};

export const SpaceBetween: Story = {
  args: {
    justify: 'space-between',
  },
  render: (args) => (
    <Row {...args}>
      <Box>Left</Box>
      <Box>Right</Box>
    </Row>
  ),
};

export const Centered: Story = {
  args: {
    justify: 'center',
    align: 'center',
  },
  render: (args) => (
    <Row {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Row>
  ),
};

export const VerticalAlignment: Story = {
  args: {
    align: 'flex-start',
  },
  render: (args) => (
    <Row {...args}>
      <Box height={40}>Short</Box>
      <Box height={80}>Tall</Box>
      <Box height={60}>Medium</Box>
    </Row>
  ),
};

export const Wrapping: Story = {
  args: {
    wrap: true,
    spacing: 'sm',
  },
  render: (args) => (
    <Row {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
      <Box>Item 6</Box>
      <Box>Item 7</Box>
      <Box>Item 8</Box>
    </Row>
  ),
};

export const SmallSpacing: Story = {
  args: {
    spacing: 'sm',
  },
  render: (args) => (
    <Row {...args}>
      <Box>A</Box>
      <Box>B</Box>
      <Box>C</Box>
    </Row>
  ),
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
  },
  render: (args) => (
    <Row {...args}>
      <Box>A</Box>
      <Box>B</Box>
      <Box>C</Box>
    </Row>
  ),
};
