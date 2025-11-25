import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { colours } from "@/styles/tokens";
import { Loader } from "./";

const meta = {
  title: "Components/Loader",
  component: Loader,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colours.surface,
          padding: 40,
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 48,
  },
};

export const Large: Story = {
  args: {
    size: 128,
  },
};

export const CustomColor: Story = {
  args: {
    size: 96,
    color: colours.accent,
  },
};

export const OnDarkBackground: Story = {
  args: {
    size: 96,
    color: colours.background,
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          padding: 40,
        }}
      >
        <Story />
      </View>
    ),
  ],
};
