import { Button } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { colours } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { Alert } from "react-native";

const ShareButton = () => {
  return (
    <Button
      variant="unstyled"
      size="sm"
      onPress={() => Alert.alert("Share pressed")}
    >
      <Ionicons name="share-outline" size={24} />
    </Button>
  );
};

const LogoutButton = () => {
  const { signOut } = useAuthContext();

  return (
    <Button variant="unstyled" size="sm" onPress={async () => await signOut()}>
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
