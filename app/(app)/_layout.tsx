import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Logout } from "@/components/buttons";
import { palette, text } from "@/styles/tokens";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.primary1,
        },
        headerTintColor: text.white,
        headerRight: () => <Logout variant="unstyled" size="sm" />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: text.white,
        tabBarStyle: {
          backgroundColor: palette.primary1Darkened,
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
          name="dev"
          options={{
            title: "Preview",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "code-slash" : "code-slash-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="storybook"
          options={{
            title: "Storybook",
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
