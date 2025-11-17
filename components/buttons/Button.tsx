import {
  borderRadius,
  colours,
  palette,
  spacing,
  text,
  typography,
} from "@/styles/tokens";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "unstyled" | "dev";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  textStyle: textStyleOverrides,
  style: styleOverrides,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
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
        <Text style={[textStyles.text, textStyleOverrides]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const textStyles = StyleSheet.create({
  // Text styles
  text: {
    color: text.white,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },

  // Text variants
  primary: {
    fontSize: typography.fontSize.base,
  },

  // Text sizes
  sm: {
    fontSize: typography.fontSize.sm,
  },
  md: {
    fontSize: typography.fontSize.base,
  },
  lg: {
    fontSize: typography.fontSize.lg,
  },
});

const styles = StyleSheet.create({
  // Base styles
  base: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Variants
  primary: {
    backgroundColor: palette.primary2,
  },
  unstyled: {
    backgroundColor: "none",
    padding: 0,
  },
  dev: {
    backgroundColor: palette.primary3,
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    position: "absolute",
  },
  hiddenText: {
    opacity: 0,
  },
});
