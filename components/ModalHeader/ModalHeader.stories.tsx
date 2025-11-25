import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { ModalHeader } from "./";

const meta = {
  title: "Components/ModalHeader",
  component: ModalHeader,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, backgroundColor: "#fff" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ModalHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Add Item",
    onCancel: () => console.log("Cancel pressed"),
    onSave: () => console.log("Save pressed"),
  },
};

export const TitleOnly: Story = {
  args: {
    title: "View Details",
  },
};

export const WithCancelOnly: Story = {
  args: {
    title: "Information",
    onCancel: () => console.log("Cancel pressed"),
  },
};

export const WithSaveOnly: Story = {
  args: {
    title: "Confirm",
    onSave: () => console.log("Save pressed"),
  },
};

export const SaveLoading: Story = {
  args: {
    title: "Add Item",
    onCancel: () => console.log("Cancel pressed"),
    onSave: () => console.log("Save pressed"),
    saveLoading: true,
  },
};

export const SaveDisabled: Story = {
  args: {
    title: "Add Item",
    onCancel: () => console.log("Cancel pressed"),
    onSave: () => console.log("Save pressed"),
    saveDisabled: true,
  },
};

export const CustomButtonText: Story = {
  args: {
    title: "Delete Item",
    onCancel: () => console.log("No pressed"),
    cancelText: "No",
    onSave: () => console.log("Yes pressed"),
    saveText: "Delete",
  },
};

export const LongTitle: Story = {
  args: {
    title: "This is a Very Long Modal Title",
    onCancel: () => console.log("Cancel pressed"),
    onSave: () => console.log("Save pressed"),
  },
};
