import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Logout } from "@/components/Button/Logout";
import { colours, palette, text } from "@/styles/tokens";

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
          backgroundColor: colours.surfaceDark,
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
        {/* <Tabs.Screen
          name="test-rls"
          options={{
            title: "Test",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "code-slash" : "code-slash-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        /> */}
      </Tabs.Protected>
    </Tabs>
  );
}
