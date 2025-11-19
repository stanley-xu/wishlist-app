import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Button } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { colours, text } from "@/styles/tokens";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colours.surface },
        headerTintColor: text.black,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colours.background,
        tabBarInactiveTintColor: text.black,
        tabBarStyle: {
          backgroundColor: colours.surfaceDark,
        },
        headerRight: () => {
          const { signOut } = useAuthContext();
          return (
            <Button variant="unstyled" size="sm" onPress={signOut}>
              <Ionicons name="log-out-outline" size={24} color={text.black} />
            </Button>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle-sharp" : "person-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar-sharp" : "calendar-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Protected guard={__DEV__}>
        <Tabs.Screen
          name="storybook"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
