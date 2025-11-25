import { Text } from "@/components/Text";
import type { WishlistItem } from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { ExternalPathString, Link } from "expo-router";
import {
  Pin,
  PinOff,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface WishlistItemProps {
  item: WishlistItem;
  onPress?: (item: WishlistItem) => void;
  onPin?: (item: WishlistItem) => void;
  onDelete?: (item: WishlistItem) => void;
  variant?: "neutral" | "warm" | "elevated";
}

const SWIPE_THRESHOLD = 60;
const SWIPE_OPEN_POSITION = 80;

type SwipeState = "closed" | "swipedLeft" | "swipedRight";

export default function WishlistItemComponent({
  item,
  onPress,
  onPin,
  onDelete,
  variant = "warm",
}: WishlistItemProps) {
  const translateX = useSharedValue(0);
  const [swipeState, setSwipeState] = useState<SwipeState>("closed");
  const isPinned = item.status === "pinned";

  const closeSwipe = () => {
    setSwipeState("closed");
    translateX.value = withSpring(0);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Require 10px horizontal movement before activating
    .failOffsetY([-10, 10]) // Fail if vertical movement exceeds 10px (for scrolling)
    .onUpdate((event) => {
      // If already swiped, allow closing gesture
      if (swipeState === "swipedLeft" && event.translationX > 0) {
        translateX.value = Math.min(
          -SWIPE_OPEN_POSITION + event.translationX,
          0
        );
      } else if (swipeState === "swipedRight" && event.translationX < 0) {
        translateX.value = Math.max(
          SWIPE_OPEN_POSITION + event.translationX,
          0
        );
      } else if (swipeState === "closed") {
        // Normal swipe behavior when closed
        if (event.translationX < 0) {
          // Swipe left to pin
          translateX.value = Math.max(event.translationX, -SWIPE_OPEN_POSITION);
        } else {
          // Swipe right to delete
          translateX.value = Math.min(event.translationX, SWIPE_OPEN_POSITION);
        }
      }
    })
    .onEnd((event) => {
      if (swipeState === "closed") {
        if (event.translationX < -SWIPE_THRESHOLD) {
          // Swiped left - stay open showing pin action
          runOnJS(setSwipeState)("swipedLeft");
          translateX.value = withSpring(-SWIPE_OPEN_POSITION);
        } else if (event.translationX > SWIPE_THRESHOLD) {
          // Swiped right - stay open showing delete action
          runOnJS(setSwipeState)("swipedRight");
          translateX.value = withSpring(SWIPE_OPEN_POSITION);
        } else {
          // Not enough swipe, close
          translateX.value = withSpring(0);
        }
      } else {
        // Already swiped - check if closing
        const isClosing =
          (swipeState === "swipedLeft" &&
            event.translationX > SWIPE_THRESHOLD / 2) ||
          (swipeState === "swipedRight" &&
            event.translationX < -SWIPE_THRESHOLD / 2);

        if (isClosing) {
          runOnJS(closeSwipe)();
        } else {
          // Return to open position
          const targetPosition =
            swipeState === "swipedLeft"
              ? -SWIPE_OPEN_POSITION
              : SWIPE_OPEN_POSITION;
          translateX.value = withSpring(targetPosition);
        }
      }
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(500)
    .onEnd(() => {
      if (swipeState === "closed" && onPress) {
        runOnJS(onPress)(item);
      } else if (swipeState !== "closed") {
        // Close if tapped while swiped
        runOnJS(closeSwipe)();
      }
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

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
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            closeSwipe();
            onPin?.(item);
          }}
        >
          {isPinned ? (
            <PinOff size={24} color={colours.background} />
          ) : (
            <Pin size={24} color={colours.background} />
          )}
        </Pressable>
      </Animated.View>

      {/* Right action (appears when swiping right) - Delete */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            closeSwipe();
            onDelete?.(item);
          }}
        >
          <Trash2 size={24} color={colours.background} />
        </Pressable>
      </Animated.View>

      {/* Main content */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={animatedStyle}>
          <View style={[styles.container, styles[variant]]}>
            {/* Pin indicator */}
            {isPinned && (
              <View style={styles.pinIndicator}>
                <Pin size={14} fill={colours.accent} color={colours.accent} />
              </View>
            )}

            {/* Item content */}
            <View style={styles.content}>
              <View style={styles.contentColumn1}>
                <Text style={styles.itemName}>{item.name}</Text>

                {item.description && (
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>

              <View style={styles.contentColumn2}>
                {item.url && (
                  <Link href={item.url as ExternalPathString}>
                    <SquareArrowOutUpRight size={24} color={colours.accent} />
                  </Link>
                )}
              </View>
            </View>
          </View>
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

  actionButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  pinIndicator: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    transform: "rotate(-45deg)",
  },

  content: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentColumn1: {
    flex: 1,
  },
  contentColumn2: {},

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
