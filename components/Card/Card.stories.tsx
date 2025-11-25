import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    corners: {
      control: 'select',
      options: ['rounded', 'squared'],
    },
  },
  args: {
    variant: 'default',
    padding: 'md',
    corners: 'rounded',
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>This is a default card with some text content.</Card.Text>
    </Card>
  ),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Elevated Card</Card.Title>
      <Card.Text>This card has a shadow to appear elevated from the background.</Card.Text>
    </Card>
  ),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Outlined Card</Card.Title>
      <Card.Text>This card has a border instead of a background.</Card.Text>
    </Card>
  ),
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Small Padding</Card.Title>
      <Card.Text>This card has smaller padding.</Card.Text>
    </Card>
  ),
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Large Padding</Card.Title>
      <Card.Text>This card has larger padding.</Card.Text>
    </Card>
  ),
};

export const Squared: Story = {
  args: {
    corners: 'squared',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Squared Corners</Card.Title>
      <Card.Text>This card has squared corners instead of rounded.</Card.Text>
    </Card>
  ),
};

export const WithButton: Story = {
  args: {
    variant: 'elevated',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Interactive Card</Card.Title>
      <Card.Text>This card includes a button.</Card.Text>
      <Card.Button onPress={() => {}}>Click Me</Card.Button>
    </Card>
  ),
};

export const WithInput: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Title>Form Card</Card.Title>
      <Card.Input label="Name" placeholder="Enter your name" />
      <Card.Input label="Email" placeholder="Enter your email" />
      <Card.Button onPress={() => {}}>Submit</Card.Button>
    </Card>
  ),
};

export const Complete: Story = {
  args: {
    variant: 'elevated',
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Complete Card</Card.Title>
      <Card.Text>
        This demonstrates all Card sub-components working together.
      </Card.Text>
      <Card.Input label="Username" placeholder="Enter username" />
      <Card.Input
        label="Password"
        placeholder="Enter password"
        secureTextEntry
      />
      <Card.Button onPress={() => {}}>Sign In</Card.Button>
    </Card>
  ),
};
