import { router } from "expo-router";
import { LogOut, UserSearch } from "lucide-react-native";
import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, TextProps } from "@/components/Text";
import { useAuthContext } from "@/lib/auth";
import { useBottomSheet } from "@/lib/hooks/useBottomSheet";
import { colours, spacing, text } from "@/styles/tokens";
import { Button } from "./Button";

interface SheetItemProps {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  variant?: TextProps["variant"];
}

function SheetItem({
  label,
  icon,
  onPress,
  variant = "semibold",
}: SheetItemProps) {
  return (
    <Button
      onPress={onPress}
      variant="outline"
      size="sm"
      style={[
        styles.sheetItem,
        variant === "destructive" && { borderColor: colours.error },
      ]}
    >
      {icon}
      <Text variant={variant} fontSize="sm">
        {label}
      </Text>
    </Button>
  );
}

export default function BottomSheet() {
  const { isOpen, closeBottomSheet } = useBottomSheet();
  const { signOut, profile } = useAuthContext();
  const { bottom } = useSafeAreaInsets();

  // Only render Modal when it needs to be visible or is animating
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={closeBottomSheet}
    >
      <Pressable style={styles.overlay} onPress={closeBottomSheet}>
        <View
          style={[
            styles.sheetWrapper,
            styles.container,
            {
              paddingBottom: bottom + spacing.lg,
              shadowOffset: {
                height: -4,
                width: 0,
              },
              shadowOpacity: 0.1,
            },
          ]}
        >
          {/* Handle/Grip indicator */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

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

          {/* Developer Section */}
          {__DEV__ && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Developer</Text>
              <SheetItem
                label="Preview your profile"
                icon={<UserSearch size={20} color={text.black} />}
                onPress={() => {
                  closeBottomSheet();
                  if (profile) {
                    router.push(`/profile/${profile.id}`);
                  }
                }}
              />
              <SheetItem
                label="View Another Profile"
                icon={<UserSearch size={20} color={text.black} />}
                onPress={() => {
                  Alert.prompt(
                    "Enter a wishlist share link",
                    "Paste link",
                    (input: string) => {
                      // Hack around the deeplinking we need to setup
                      // Seeded user for testing:
                      // Dev
                      // https://giftful.io/profile/00000000-0000-0000-0000-000000000001?share=406eb86d-7622-4be9-b262-243876260892
                      // Alice
                      // https://giftful.io/profile/00000000-0000-0000-0000-000000000002?share=7c74ca94-b0d9-44a0-883f-922b8c9ba799
                      const index = input.indexOf("profile");
                      const link = input.slice(index);
                      console.log({ link });

                      if (link && profile) {
                        closeBottomSheet();
                        //@ts-expect-error
                        router.navigate(`/${link}`);
                      }
                    }
                  );
                }}
              />
            </View>
          )}
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
    maxHeight: "40%", // Adjust this percentage for desired height
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
  sheetItem: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
