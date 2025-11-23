import { colours, spacing } from "@/styles/tokens";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "outline" | "unstyled" | "dev";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size,
  disabled = false,
  loading = false,
  style: styleOverrides,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        size && styles[size],
        isDisabled && styles.disabled,
        styleOverrides,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={colours.background}
            style={styles.spinner}
          />
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // Variants
  primary: {
    backgroundColor: colours.accent,
  },
  outline: {},
  unstyled: {
    backgroundColor: "transparent",
    padding: 0,
  },
  dev: {
    backgroundColor: colours.accent,
  },

  // Sizes
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Loading state styles
  contentContainer: {
    // flex: 1,
    position: "relative",
    // alignItems: "center",
    // justifyContent: "center",
  },
  spinner: {
    position: "absolute",
  },
});
