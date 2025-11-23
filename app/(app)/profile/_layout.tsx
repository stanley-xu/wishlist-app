import { Button } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { colours } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { Alert } from "react-native";

const ShareButton = (_props: NativeStackHeaderItemProps) => {
  return (
    <Button
      variant="unstyled"
      onPress={() => Alert.alert("Share pressed")}
      style={{ minWidth: 44 }}
    >
      <Ionicons name="share-outline" size={24} />
    </Button>
  );
};

const LogoutButton = () => {
  const { signOut } = useAuthContext();

  return (
    <Button
      variant="unstyled"
      onPress={async () => await signOut()}
      style={{ minWidth: 44 }}
    >
      <Ionicons name="log-out-outline" size={24} />
    </Button>
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
          headerStyle: { backgroundColor: colours.surface },
          headerRight: () => <ShareButton />,
          headerLeft: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
