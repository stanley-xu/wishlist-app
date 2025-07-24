import { colors } from "@/lib/tokens";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Container({ children, style }: ContainerProps) {
  return <View style={[styles.base, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
  },
});
