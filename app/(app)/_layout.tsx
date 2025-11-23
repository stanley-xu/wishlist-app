import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import { Features } from "@/config";
import { colours, text } from "@/styles/tokens";
import { DynamicColorIOS } from "react-native";

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
