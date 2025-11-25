import { Input } from "@/components/Input";
import { ModalHeader } from "@/components/ModalHeader";
import type { WishlistItem } from "@/lib/schemas";
import { colours, spacing } from "@/styles/tokens";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";

import { wishlistItems } from "@/lib/api";
import { useWishlists } from "@/lib/hooks/useWishlists";

interface EditItemModalProps {
  visible: boolean;
  item: WishlistItem | null;
  onSave?: () => void;
  onClose: () => void;
  optimisticUpdateItem?: ReturnType<typeof useWishlists>["updateLocalItem"];
}

export default function WishlistItemEditModal({
  visible,
  item,
  onSave,
  onClose,
  optimisticUpdateItem,
}: EditItemModalProps) {
  const [name, setName] = useState(item?.name || "");
  const [url, setUrl] = useState(item?.url || "");
  const [description, setDescription] = useState(item?.description || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update form when item changes
  if (item && name === "" && item.name !== name) {
    setName(item.name);
    setUrl(item.url || "");
    setDescription(item.description || "");
  }

  const handleSave = async () => {
    if (!item || !name.trim()) return;

    const updatedData = {
      name: name.trim(),
      url: url.trim() || undefined,
      description: description.trim() || undefined,
    };

    optimisticUpdateItem?.(item.id, updatedData);

    setIsSaving(true);
    try {
      const { data, error } = await wishlistItems.update(item.id, updatedData);

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
    setName("");
    setUrl("");
    setDescription("");
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
          title="Edit Item"
          onCancel={handleClose}
          onSave={handleSave}
          saveDisabled={!name.trim() || isSaving}
          saveLoading={isSaving}
        />

        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Item name"
              autoFocus
            />

            <Input
              label="URL (optional)"
              value={url}
              onChangeText={setUrl}
              placeholder="https://..."
              keyboardType="url"
              autoCapitalize="none"
            />

            <Input
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add notes or details..."
              multiline
              numberOfLines={4}
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
