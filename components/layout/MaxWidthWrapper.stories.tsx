import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import MaxWidthWrapper from './MaxWidthWrapper';

const meta = {
  title: 'Layout/MaxWidthWrapper',
  component: MaxWidthWrapper,
  argTypes: {
    maxWidth: {
      control: { type: 'number', min: 300, max: 1200, step: 50 },
    },
    paddingX: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  args: {
    maxWidth: 600,
    paddingX: 'lg',
  },
} satisfies Meta<typeof MaxWidthWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

const Content = () => (
  <View
    style={{
      padding: 20,
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
    }}
  >
    <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
      Constrained Width Content
    </Text>
    <Text>
      This content will not exceed the specified maxWidth, even on larger
      screens. It will be centered and have horizontal padding.
    </Text>
  </View>
);

export const Default: Story = {
  args: {
    children: <Content />,
  },
};

export const NarrowWidth: Story = {
  args: {
    maxWidth: 400,
    children: <Content />,
  },
};

export const WideWidth: Story = {
  args: {
    maxWidth: 800,
    children: <Content />,
  },
};

export const SmallPadding: Story = {
  args: {
    maxWidth: 600,
    paddingX: 'sm',
    children: <Content />,
  },
};

export const LargePadding: Story = {
  args: {
    maxWidth: 600,
    paddingX: 'xl',
    children: <Content />,
  },
};

export const ArticleLayout: Story = {
  args: {
    maxWidth: 700,
    paddingX: 'lg',
    children: (
      <View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Article Title
        </Text>
        <Text style={{ marginBottom: 12 }}>
          This demonstrates how MaxWidthWrapper can be used for readable article
          layouts. The content stays within a comfortable reading width.
        </Text>
        <Text style={{ marginBottom: 12 }}>
          Long lines of text can be hard to read on wide screens. This wrapper
          ensures optimal readability.
        </Text>
        <Text>
          Perfect for blog posts, documentation, or any long-form content.
        </Text>
      </View>
    ),
  },
};
