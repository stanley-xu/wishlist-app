import { StyleSheet, Text } from "react-native";

import { MaxWidthWrapper, Spacer } from "@/components";

import { colours } from "@/lib/tokens";

export default function Index() {
  return (
    <MaxWidthWrapper>
      <Spacer />
      <Text>Testing</Text>
      <Spacer />
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
