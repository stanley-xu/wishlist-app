import { router } from "expo-router";
import { LogOut, UserSearch } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/Text";
import { useAuthContext } from "@/lib/auth";
import { useBottomSheet } from "@/lib/hooks/useBottomSheet";
import { colours, spacing, text } from "@/styles/tokens";

interface SheetItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  variant?: "default" | "destructive";
}

function SheetItem({
  label,
  icon,
  onPress,
  variant = "default",
}: SheetItemProps) {
  return (
    <Pressable style={styles.sheetItem} onPress={onPress}>
      {icon && <View style={styles.sheetItemIcon}>{icon}</View>}
      <Text
        style={[
          styles.sheetItemLabel,
          variant === "destructive" && styles.sheetItemLabelDestructive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function BottomSheet() {
  const { isOpen, closeBottomSheet } = useBottomSheet();
  const { signOut, profile } = useAuthContext();
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={closeBottomSheet}
    >
      <Pressable style={styles.overlay} onPress={closeBottomSheet}>
        <View style={styles.sheetWrapper}>
          <Pressable style={[styles.container, { paddingBottom: bottom + spacing.lg }]}>
            {/* Handle/Grip indicator */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Developer Section */}
            {__DEV__ && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Developer</Text>
                <SheetItem
                  label="View Another Profile"
                  icon={<UserSearch size={20} color={text.black} />}
                  onPress={() => {
                    closeBottomSheet();
                    if (profile) {
                      router.push(`/profile/${profile.id}`);
                    }
                  }}
                />
              </View>
            )}

            {/* Logout */}
            <View style={styles.section}>
              <SheetItem
                label="Logout"
                icon={<LogOut size={20} color={colours.error} />}
                onPress={() => {
                  closeBottomSheet();
                  signOut();
                }}
                variant="destructive"
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    maxHeight: "35%", // Adjust this percentage for desired height
  },
  container: {
    backgroundColor: colours.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: text.black,
    opacity: 0.3,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: text.black,
    opacity: 0.5,
    paddingBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  sheetItemIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetItemLabel: {
    fontSize: 16,
    color: text.black,
  },
  sheetItemLabelDestructive: {
    color: colours.error,
  },
});
