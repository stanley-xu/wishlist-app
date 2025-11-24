import { Stack } from "expo-router";

export default function AddItemLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Add Item" }} />
    </Stack>
  );
}
