import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { colours } from "@/lib/tokens";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colours.primaryDark,
        headerStyle: {
          backgroundColor: colours.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colours.text,
        tabBarStyle: {
          backgroundColor: colours.surface,
          paddingLeft: 16,
          paddingRight: 16,
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
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      {__DEV__ && (
        <Tabs.Screen
          name="component-preview"
          options={{
            title: "Components",
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
