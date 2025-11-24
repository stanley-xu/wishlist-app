import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import type { WishlistItem } from "@/lib/schemas";
import { StyleSheet, View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";

interface WishlistItemProps {
  item: WishlistItem;
  onPress?: (item: WishlistItem) => void;
  variant?: "neutral" | "warm" | "elevated";
}

export default function WishlistItemComponent({
  item,
  onPress,
  variant = "warm",
}: WishlistItemProps) {
  const isPinned = item.status === "pinned";

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.container,
        styles[variant],
        pressed && styles.pressed,
      ]}
    >
      {/* Pin indicator */}
      {isPinned && (
        <View style={styles.pinIndicator}>
          <Ionicons name="pin" size={14} color={text.black} />
        </View>
      )}

      {/* Item content */}
      <View style={styles.content}>
        <Text style={styles.itemName}>{item.name}</Text>

        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.url && (
          <Text style={styles.itemUrl} numberOfLines={1}>
            {item.url}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },

  // Variants
  neutral: {
    backgroundColor: colours.background,
    shadowColor: text.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  warm: {
    backgroundColor: colours.backgroundWarm,
    shadowColor: text.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  elevated: {
    backgroundColor: colours.background,
    shadowColor: text.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  pressed: {
    opacity: 0.8,
  },

  pinIndicator: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
  },

  content: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: text.black,
    marginBottom: spacing.xs,
  },

  itemDescription: {
    fontSize: 14,
    color: text.black,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },

  itemUrl: {
    fontSize: 12,
    color: colours.accent,
  },
});
