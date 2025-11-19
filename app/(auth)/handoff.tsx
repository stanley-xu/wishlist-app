import { StyleSheet, View } from "react-native";

import { Text } from "@/components";
import { colours, typography } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fullPageStyles } from "@/styles/styles";

// TODO: make this a sheet that is half the height of a modal
export default function HandoffScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="paper-plane" size={96} color={colours.accent} />
      <Text style={styles.title}>Hang tight!</Text>
      <Text style={styles.subtitle}>Check your email.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...fullPageStyles.container,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize["xl"],
    fontWeight: typography.fontWeight.normal,
    textAlign: "center",
  },
});
