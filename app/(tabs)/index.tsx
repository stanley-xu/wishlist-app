import { StyleSheet } from "react-native";

import { MaxWidthWrapper } from "@/components";

import { Logout } from "@/components/buttons";
import { colours } from "@/styles/tokens";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <MaxWidthWrapper>
      <Stack.Screen
        options={{
          headerRight: () => <Logout />,
        }}
      />
    </MaxWidthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
