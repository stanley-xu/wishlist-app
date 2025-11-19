import { Button } from "@/components";
import { colours, text } from "@/styles/tokens";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colours.surfaceDark },
          // TODO: fun randomized greetings
          title: "Welcome, fellow gifter.",
          headerTintColor: text.white,
          headerLargeTitle: true,
          headerLargeStyle: { backgroundColor: colours.surfaceDark },
          headerLargeTitleStyle: { color: text.white },
          headerLargeTitleShadowVisible: true,
          headerRight: () => (
            <Button
              variant="unstyled"
              size="sm"
              onPress={() => router.push("/(auth)/register")}
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
