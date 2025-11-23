import { IconButton } from "@/components/Button";
import { useAuthContext } from "@/lib/auth";
import { colours } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { Alert } from "react-native";

const ShareButton = (_props: NativeStackHeaderItemProps) => {
  return (
    <IconButton onPress={() => Alert.alert("Share pressed")}>
      <Ionicons name="share-outline" size={24} />
    </IconButton>
  );
};

const LogoutButton = () => {
  const { signOut } = useAuthContext();

  return (
    <IconButton onPress={async () => await signOut()}>
      <Ionicons name="log-out-outline" size={24} />
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
          headerStyle: { backgroundColor: colours.surface },
          headerRight: () => <ShareButton />,
          headerLeft: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
