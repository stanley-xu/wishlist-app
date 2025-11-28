import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Text } from "@/components/Text";
import { spacing, text } from "@/styles/tokens";

type WishlistVisibility = "public" | "follower" | "private";

const VISIBILITY_OPTIONS = ["Public", "Followers", "Private"];
const VISIBILITY_MAP: WishlistVisibility[] = ["public", "follower", "private"];

interface VisibilitySelectorProps {
  defaultValue?: WishlistVisibility;
  onChange?: (visibility: WishlistVisibility) => void;
  disabled?: boolean;
}

export function VisibilitySelector({
  defaultValue = "private",
  onChange,
  disabled = false
}: VisibilitySelectorProps) {
  const defaultIndex = VISIBILITY_MAP.indexOf(defaultValue);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  // Update selected index when defaultValue changes
  useEffect(() => {
    const newIndex = VISIBILITY_MAP.indexOf(defaultValue);
    setSelectedIndex(newIndex);
  }, [defaultValue]);

  const handleSegmentChange = (index: number) => {
    if (disabled) return;
    setSelectedIndex(index);
    const newVisibility = VISIBILITY_MAP[index];
    onChange?.(newVisibility);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Wishlist Visibility</Text>
      <SegmentedControl
        values={VISIBILITY_OPTIONS}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          handleSegmentChange(event.nativeEvent.selectedSegmentIndex);
        }}
        enabled={!disabled}
        style={{ marginBottom: spacing.sm }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: text.black,
    opacity: 0.5,
    paddingBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
