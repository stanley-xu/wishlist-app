import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { palette, text } from "@/styles/tokens";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.primary1Darkened,
        },
        headerTintColor: text.white,
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
      {__DEV__ && (
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
      )}
    </Tabs>
  );
}
