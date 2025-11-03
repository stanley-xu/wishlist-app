import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/lib/auth";

export default function RootLayout() {
  if (__DEV__) {
    console.log("🧑‍💻 Launched in dev mode!");
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {__DEV__ && (
          <Stack.Screen
            name="(component-previews)"
            options={{ headerShown: false }}
          />
        )}
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
