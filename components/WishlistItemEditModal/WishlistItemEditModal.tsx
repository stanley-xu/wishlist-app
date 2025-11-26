import { Input } from "@/components/Input";
import { ModalHeader } from "@/components/ModalHeader";
import type { UpdateWishlistItem, WishlistItem } from "@/lib/schemas";
import { UpdateWishlistItemSchema } from "@/lib/schemas";
import { colours, spacing } from "@/styles/tokens";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";

import { wishlistItems } from "@/lib/api";
import { useWishlists } from "@/lib/hooks/useWishlists";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

interface EditItemModalProps {
  visible: boolean;
  item: WishlistItem | null;
  onSave?: () => void;
  onClose: () => void;
  optimisticUpdateItem?: ReturnType<typeof useWishlists>["updateLocalItem"];
  readOnly?: boolean;
}

export default function WishlistItemEditModal({
  visible,
  item,
  onSave,
  onClose,
  optimisticUpdateItem,
  readOnly = false,
}: EditItemModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<UpdateWishlistItem>({
    resolver: zodResolver(UpdateWishlistItemSchema),
    defaultValues: {
      name: item?.name || "",
      url: item?.url || null,
      description: item?.description || null,
    },
  });

  // Update form when item changes
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        url: item.url || null,
        description: item.description || null,
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: UpdateWishlistItem) => {
    if (!item) return;

    // Build update object with only dirty fields
    const updatedData: UpdateWishlistItem = {};

    if (dirtyFields.name) {
      updatedData.name = data.name?.trim();
    }

    if (dirtyFields.url) {
      // Empty string becomes null for URL field
      const url = (() => {
        if (data.url) {
          if (data.url === "") {
            return null;
          } else {
            return data.url.trim();
          }
        } else {
          return null;
        }
      })();

      updatedData.url = url;
    }

    if (dirtyFields.description) {
      // Empty string becomes null for description field
      updatedData.description = data.description?.trim() ?? null;
    }

    // If nothing changed, just close
    if (Object.keys(updatedData).length === 0) {
      handleClose();
      return;
    }

    optimisticUpdateItem?.(item.id, updatedData);

    setIsSaving(true);
    try {
      console.debug("Updating item with:", updatedData);
      const { data: result, error } = await wishlistItems.update(
        item.id,
        updatedData
      );

      if (error) {
        console.error("Failed to update item:", error);
        throw error;
      }

      await onSave?.();
      handleClose();
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <ModalHeader
          title="Item details"
          onCancel={handleClose}
          onSave={readOnly ? undefined : handleSubmit(onSubmit)}
          saveDisabled={!isValid || isSaving || Object.keys(dirtyFields).length === 0}
          saveLoading={isSaving}
        />

        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Item name"
                  error={errors.name?.message}
                  editable={!readOnly}
                />
              )}
            />

            <Controller
              control={control}
              name="url"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="URL (optional)"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="https://..."
                  keyboardType="url"
                  autoCapitalize="none"
                  error={errors.url?.message}
                  editable={!readOnly}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description (optional)"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Add notes or details..."
                  multiline
                  numberOfLines={4}
                  error={errors.description?.message}
                  editable={!readOnly}
                />
              )}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colours.background,
  },
  form: {
    gap: spacing.md,
  },
});
