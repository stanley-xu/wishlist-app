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
  args: {
    children: (
      <>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>This is a default card with some text content.</Card.Text>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Title>Elevated Card</Card.Title>
        <Card.Text>This card has a shadow to appear elevated from the background.</Card.Text>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <>
        <Card.Title>Outlined Card</Card.Title>
        <Card.Text>This card has a border instead of a background.</Card.Text>
      </>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <>
        <Card.Title>Small Padding</Card.Title>
        <Card.Text>This card has smaller padding.</Card.Text>
      </>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <>
        <Card.Title>Large Padding</Card.Title>
        <Card.Text>This card has larger padding.</Card.Text>
      </>
    ),
  },
};

export const Squared: Story = {
  args: {
    corners: 'squared',
    children: (
      <>
        <Card.Title>Squared Corners</Card.Title>
        <Card.Text>This card has squared corners instead of rounded.</Card.Text>
      </>
    ),
  },
};

export const WithButton: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <Card.Title>Interactive Card</Card.Title>
        <Card.Text>This card includes a button.</Card.Text>
        <Card.Button onPress={() => {}}>Click Me</Card.Button>
      </>
    ),
  },
};

export const WithInput: Story = {
  args: {
    children: (
      <>
        <Card.Title>Form Card</Card.Title>
        <Card.Input label="Name" placeholder="Enter your name" />
        <Card.Input label="Email" placeholder="Enter your email" />
        <Card.Button onPress={() => {}}>Submit</Card.Button>
      </>
    ),
  },
};

export const Complete: Story = {
  args: {
    variant: 'elevated',
    padding: 'lg',
    children: (
      <>
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
      </>
    ),
  },
};
