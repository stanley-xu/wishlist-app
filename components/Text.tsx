import { ReactNode } from "react";
import { Text as RNText, StyleSheet } from "react-native";

interface TextProps {
  children: ReactNode;
}

export default function Text({ children }: TextProps) {
  return <RNText style={styles.text}>{children}</RNText>;
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
