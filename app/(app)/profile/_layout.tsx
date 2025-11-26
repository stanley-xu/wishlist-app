import { Stack } from "expo-router";
import { Text } from "@/components";
import { IconButton } from "@/components/Button";
import { useDrawer } from "@/lib/hooks/useDrawer";
import { spacing } from "@/styles/tokens";
import { Menu, Share } from "lucide-react-native";
import { Alert, View, Pressable } from "react-native";

const ShareButton = () => {
  return (
    <Pressable
      onPress={() => Alert.alert("Share pressed")}
      style={{ paddingHorizontal: spacing.xs }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}
      >
        <Text variant="semibold">Share</Text>
        <Share size={24} />
      </View>
    </Pressable>
  );
};

const DrawerButton = () => {
  const { openDrawer } = useDrawer();

  return (
    <IconButton onPress={openDrawer}>
      <Menu size={24} />
    </IconButton>
  );
};

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerRight: () => <ShareButton />,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Stack.Screen
        name="[userId]"
        options={{
          headerShown: true,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
