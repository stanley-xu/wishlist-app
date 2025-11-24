import { Modal, View, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { spacing, text, colours } from "@/styles/tokens";
import type { WishlistItem } from "@/lib/schemas";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Spacer } from "@/components/Spacer";

interface EditItemModalProps {
  visible: boolean;
  item: WishlistItem | null;
  onSave: (
    item: WishlistItem,
    updates: { name: string; url?: string; description?: string }
  ) => Promise<void>;
  onClose: () => void;
}

export default function EditItemModal({
  visible,
  item,
  onSave,
  onClose,
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

    setIsSaving(true);
    try {
      await onSave(item, {
        name: name.trim(),
        url: url.trim() || undefined,
        description: description.trim() || undefined,
      });
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card padding="lg">
            <Card.Title>Edit Item</Card.Title>
            <Spacer size="md" />

            <Card.Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Item name"
              autoFocus
            />
            <Spacer size="md" />

            <Card.Input
              label="URL (optional)"
              value={url}
              onChangeText={setUrl}
              placeholder="https://..."
              keyboardType="url"
              autoCapitalize="none"
            />
            <Spacer size="md" />

            <Card.Input
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add notes or details..."
              multiline
              numberOfLines={4}
            />
            <Spacer size="lg" />

            <View style={styles.buttonContainer}>
              <Button
                variant="secondary"
                onPress={handleClose}
                disabled={isSaving}
                style={styles.button}
              >
                Cancel
              </Button>
              <Spacer size="sm" />
              <Button
                variant="primary"
                onPress={handleSave}
                disabled={!name.trim() || isSaving}
                style={styles.button}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </View>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing["2xl"],
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
});
