import { Button } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { colours } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { Alert } from "react-native";

// const ShareButton = (_props: NativeStackHeaderItemProps) => {
//   return (
//     <Button
//       variant="unstyled"
//       onPress={() => Alert.alert("Share pressed")}
//       style={{ minWidth: 44 }}
//     >
//       <Ionicons name="share-outline" size={24} />
//     </Button>
//   );
// };

const LogoutButton = () => {
  const { signOut } = useAuthContext();

  return (
    <Button.Unstyled
      onPress={async () => await signOut()}
      style={{ minWidth: 44 }}
    >
      <Ionicons name="log-out-outline" size={24} />
    </Button.Unstyled>
  );
};

export default function ProfileLayout() {
  const { signOut } = useAuthContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerStyle: { backgroundColor: colours.surface },
          // headerRight: () => <ShareButton />,
          unstable_headerRightItems: (props) => [
            {
              type: "button",
              label: "Share",
              icon: { type: "sfSymbol", name: "square.and.arrow.up" },
              onPress: () => Alert.alert("Share pressed"),
            },
            {
              type: "button",
              label: "Logout",
              icon: {
                type: "sfSymbol",
                name: "rectangle.portrait.and.arrow.right",
              },
              onPress: async () => await signOut(),
            },
          ],
          headerLeft: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
