import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import type { WishlistItem } from "@/lib/schemas";
import { StyleSheet, View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface WishlistItemProps {
  item: WishlistItem;
  onPress?: (item: WishlistItem) => void;
  onPin?: (item: WishlistItem) => void;
  onDelete?: (item: WishlistItem) => void;
  variant?: "neutral" | "warm" | "elevated";
}

const SWIPE_THRESHOLD = 80;
const SWIPE_ACTION_THRESHOLD = 120;

export default function WishlistItemComponent({
  item,
  onPress,
  onPin,
  onDelete,
  variant = "warm",
}: WishlistItemProps) {
  const translateX = useSharedValue(0);
  const isPinned = item.status === "pinned";

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow swiping in the appropriate direction
      // Swipe left (negative) to pin, swipe right (positive) to delete
      if (event.translationX < 0) {
        // Swipe left to pin - limit to threshold
        translateX.value = Math.max(event.translationX, -SWIPE_ACTION_THRESHOLD);
      } else {
        // Swipe right to delete - limit to threshold
        translateX.value = Math.min(event.translationX, SWIPE_ACTION_THRESHOLD);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Swiped left - pin action
        if (onPin) {
          runOnJS(onPin)(item);
        }
      } else if (event.translationX > SWIPE_THRESHOLD) {
        // Swiped right - delete action
        if (onDelete) {
          runOnJS(onDelete)(item);
        }
      }
      // Reset position
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1),
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1),
  }));

  return (
    <View style={styles.wrapper}>
      {/* Left action (appears when swiping left) - Pin */}
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <Ionicons name="pin" size={24} color={colours.background} />
      </Animated.View>

      {/* Right action (appears when swiping right) - Delete */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <Ionicons name="trash" size={24} color={colours.background} />
      </Animated.View>

      {/* Main content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
    position: "relative",
  },

  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
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

  leftAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colours.accent,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },

  rightAction: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colours.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
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
