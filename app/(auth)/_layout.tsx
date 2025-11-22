import { Button } from "@/components";
import { largeHeaderStyles } from "@/styles/styles";
import { colours } from "@/styles/tokens";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          ...largeHeaderStyles,
          // TODO: fun randomized greetings
          title: "Welcome, fellow gifter.",
          headerRight: () => (
            <Button
              variant="unstyled"
              size="sm"
              onPress={() => router.push("/(auth)/register")}
              textStyle={{ color: colours.background }}
            >
              Sign up
            </Button>
          ),
        }}
      />
      <Stack.Screen name="register" options={{ presentation: "modal" }} />
      <Stack.Screen name="handoff" options={{ presentation: "modal" }} />
    </Stack>
  );
}
