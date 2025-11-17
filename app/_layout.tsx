import { AuthProvider, useAuthContext } from "@/lib/auth";
import { Stack } from "expo-router";
import { SplashScreenController } from "./splash";

export default function RootLayout() {
  if (__DEV__) {
    console.log("🧑‍💻 Launched in dev mode!");
  }

  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}

// stub
const useUserContext = () => null;

function RootNavigator() {
  const { session } = useAuthContext();
  const user = useUserContext();

  if (__DEV__ && session) {
    console.log(`Session changed: ${session?.access_token}`);
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !user}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
