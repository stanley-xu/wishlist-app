import { AuthProvider, useAuthContext } from "@/lib/auth";
import { Stack } from "expo-router";
import SplashScreenController from "./splash";

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

function RootNavigator() {
  const { session, profile, loading: profileLoading } = useAuthContext();

  const guardStates = {
    loading: profileLoading,
    auth: !session,
    app: Boolean(session && !profileLoading && profile),
    welcome: Boolean(session && !profileLoading && !profile),
  };

  if (__DEV__) {
    console.log(guardStates);
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={guardStates.loading}>
        <Stack.Screen name="loading" />
      </Stack.Protected>
      <Stack.Protected guard={guardStates.auth}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={guardStates.app}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={guardStates.welcome}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
    </Stack>
  );
}
