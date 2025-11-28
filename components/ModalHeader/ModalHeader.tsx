import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { colours, spacing, text, typography } from "@/styles/tokens";

interface ModalHeaderProps {
  title: string;

  // Left action (Cancel)
  onCancel?: () => void;
  cancelText?: string;
  cancelDisabled?: boolean;

  // Right action (Save)
  onSave?: () => void;
  saveText?: string;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  saveDestructive?: boolean;
  saveOutline?: boolean;

  // Styling
  style?: StyleProp<ViewStyle>;
}

export default function ModalHeader({
  title,
  onCancel,
  cancelText = "Cancel",
  cancelDisabled = false,
  onSave,
  saveText = "Save",
  saveDisabled = false,
  saveLoading = false,
  saveDestructive = false,
  saveOutline = false,
  style,
}: ModalHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {/* Left Action */}
      {onCancel ? (
        <Button
          variant="outline"
          size="sm"
          onPress={onCancel}
          disabled={cancelDisabled}
          style={styles.button}
        >
          <Text>{cancelText}</Text>
        </Button>
      ) : (
        <View style={styles.button} />
      )}

      {/* Center Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Action */}
      {onSave ? (
        <Button
          size="sm"
          variant={
            saveOutline
              ? "outline"
              : saveDestructive
                ? "destructive"
                : "primary"
          }
          onPress={onSave}
          loading={saveLoading}
          disabled={saveDisabled}
          style={[
            styles.button,
            saveOutline && saveDestructive && { borderColor: colours.error },
          ]}
        >
          <Text variant={saveDestructive && saveOutline ? "destructive" : "semibold"}>
            {saveText}
          </Text>
        </Button>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  button: {
    minWidth: 90,
    borderColor: text.black,
  },
});
