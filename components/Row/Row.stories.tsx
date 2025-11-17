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
  args: {
    children: (
      <>
        <Box>First</Box>
        <Box>Second</Box>
        <Box>Third</Box>
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    justify: 'space-between',
    children: (
      <>
        <Box>Left</Box>
        <Box>Right</Box>
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    justify: 'center',
    align: 'center',
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
};

export const VerticalAlignment: Story = {
  args: {
    align: 'flex-start',
    children: (
      <>
        <Box height={40}>Short</Box>
        <Box height={80}>Tall</Box>
        <Box height={60}>Medium</Box>
      </>
    ),
  },
};

export const Wrapping: Story = {
  args: {
    wrap: true,
    spacing: 'sm',
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
        <Box>Item 4</Box>
        <Box>Item 5</Box>
        <Box>Item 6</Box>
        <Box>Item 7</Box>
        <Box>Item 8</Box>
      </>
    ),
  },
};

export const SmallSpacing: Story = {
  args: {
    spacing: 'sm',
    children: (
      <>
        <Box>A</Box>
        <Box>B</Box>
        <Box>C</Box>
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
    children: (
      <>
        <Box>A</Box>
        <Box>B</Box>
        <Box>C</Box>
      </>
    ),
  },
};
