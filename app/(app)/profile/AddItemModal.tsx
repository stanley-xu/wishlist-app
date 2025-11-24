import { Button, Input, Text } from "@/components";
import { wishlistItems } from "@/lib/api";
import {
  CreateWishlistItemSchema,
  type CreateWishlistItem,
} from "@/lib/schemas";
import { colours, spacing } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, View } from "react-native";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  wishlistId: string;
  onItemAdded?: () => void;
}

export function AddItemModal({
  visible,
  onClose,
  wishlistId,
  onItemAdded,
}: AddItemModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWishlistItem>({
    resolver: zodResolver(CreateWishlistItemSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateWishlistItem) => {
    const { error } = await wishlistItems.create(wishlistId, data);

    if (error) {
      console.error("Error creating wishlist item:", error);
      return;
    }

    reset();
    onItemAdded?.();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Button variant="outline" size="sm" onPress={handleClose}>
            <Text>Cancel</Text>
          </Button>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Add Item</Text>
          <Button
            size="sm"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <Text>Save</Text>
          </Button>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Item name"
                placeholder="What do you want?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                autoFocus
              />
            )}
          />

          <Controller
            control={control}
            name="url"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Link (optional)"
                placeholder="https://..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.url?.message}
                keyboardType="url"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Notes (optional)"
                placeholder="Size, color, etc."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colours.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
});
