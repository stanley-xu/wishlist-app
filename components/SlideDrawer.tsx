import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LogOut, UserSearch } from "lucide-react-native";

import { Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { useDrawer } from "@/lib/hooks/useDrawer";
import { colours, spacing, text } from "@/styles/tokens";

const DRAWER_WIDTH = 280;
const SWIPE_THRESHOLD = DRAWER_WIDTH / 2; // Close if dragged past halfway

interface DrawerItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  variant?: "default" | "destructive";
}

function DrawerItem({ label, icon, onPress, variant = "default" }: DrawerItemProps) {
  return (
    <Pressable style={styles.drawerItem} onPress={onPress}>
      {icon && <View style={styles.drawerItemIcon}>{icon}</View>}
      <Text
        style={[
          styles.drawerItemLabel,
          variant === "destructive" && styles.drawerItemLabelDestructive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function SlideDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { signOut, profile } = useAuthContext();
  const { top } = useSafeAreaInsets();

  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Standard ease
      });
    } else {
      translateX.value = withTiming(-DRAWER_WIDTH, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Clamp to only allow dragging left (negative values)
      const newTranslateX = Math.min(0, Math.max(-DRAWER_WIDTH, event.translationX));
      translateX.value = newTranslateX;
    })
    .onEnd((event) => {
      // Close if dragged more than threshold to the left or fast swipe left
      if (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -500) {
        translateX.value = withTiming(-DRAWER_WIDTH, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        runOnJS(closeDrawer)();
      } else {
        // Snap back to open position
        translateX.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.drawer,
                { paddingTop: top + spacing.lg },
                animatedStyle,
              ]}
              onStartShouldSetResponder={() => true}
            >
            {/* Profile Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <DrawerItem
                label="My Profile"
                onPress={() => {
                  closeDrawer();
                  router.push("/profile");
                }}
              />
            </View>

            {/* Developer Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Developer</Text>
              <DrawerItem
                label="View Another Profile"
                icon={<UserSearch size={20} color={text.black} />}
                onPress={() => {
                  closeDrawer();
                  if (profile) {
                    router.push(`/profile/${profile.id}`);
                  }
                }}
              />
            </View>

            {/* Logout */}
            <View style={styles.logoutSection}>
              <DrawerItem
                label="Logout"
                icon={<LogOut size={20} color={colours.error} />}
                onPress={() => {
                  closeDrawer();
                  signOut();
                }}
                variant="destructive"
              />
            </View>
          </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colours.background,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: text.black,
    opacity: 0.5,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  drawerItemIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerItemLabel: {
    fontSize: 16,
    color: text.black,
  },
  drawerItemLabelDestructive: {
    color: colours.error,
  },
  logoutSection: {
    marginTop: "auto",
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colours.border,
  },
});
