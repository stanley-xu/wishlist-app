import { Text } from "@/components";
import { IconButton } from "@/components/Button";
import { useAuthContext } from "@/lib/auth";
import { spacing } from "@/styles/tokens";
import { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { LogOut, Share } from "lucide-react-native";
import { Alert, View } from "react-native";

const ShareButton = (_props: NativeStackHeaderItemProps) => {
  return (
    <IconButton
      onPress={() => Alert.alert("Share pressed")}
      style={{ paddingHorizontal: spacing.xs }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}
      >
        <Text variant="semibold">Share</Text>
        <Share size={24} />
      </View>
    </IconButton>
  );
};

const LogoutButton = () => {
  const { signOut } = useAuthContext();

  return (
    <IconButton onPress={async () => await signOut()}>
      <LogOut size={24} />
    </IconButton>
  );
};

// Sadly, this doesn't work
// const RightItems: NativeStackHeaderItem[] = (
//   props: NativeStackHeaderItemProps
// ) => {
//   const { signOut } = useAuthContext();
//   return [
//     {
//       type: "button",
//       label: "Share",
//       icon: { type: "sfSymbol", name: "square.and.arrow.up" },
//       onPress: () => Alert.alert("Share pressed"),
//     },
//     {
//       type: "button",
//       label: "Logout",
//       icon: {
//         type: "sfSymbol",
//         name: "rectangle.portrait.and.arrow.right",
//       },
//       onPress: async () => await signOut(),
//     },
//   ];
// };

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
          headerLeft: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
