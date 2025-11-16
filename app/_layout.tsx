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

function RootNavigator() {
  const { session } = useAuthContext();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen
          name="(auth)/login"
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
