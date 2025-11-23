import { Tabs } from "expo-router";

import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Button } from "@/components";
import { Features } from "@/config";
import { useAuthContext } from "@/lib/auth";
import { colours, text } from "@/styles/tokens";
import { DynamicColorIOS } from "react-native";

function OldLayout() {
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

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // For the text color
        color: DynamicColorIOS({
          dark: text.white,
          light: text.black,
        }),
      }}
      // For the selected icon color
      tintColor={DynamicColorIOS({
        dark: text.white,
        light: colours.accent,
      })}
    >
      <NativeTabs.Trigger name="index" hidden={!Features["home"]}>
        <Label>Home</Label>
        {/* TODO: Android icons
        https://docs.expo.dev/router/advanced/native-tabs/#integration-with-expovector-icons
         */}
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="events">
        <Label>Events</Label>
        <Icon sf="calendar" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="storybook" hidden={!__DEV__}>
        <Label>Storybook</Label>
        <Icon sf="book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
