import {
  borderRadius,
  colours,
  palette,
  spacing,
  text,
  typography,
} from "@/lib/tokens";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<TextStyle>;
}

export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
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
        styles[size],
        isDisabled && styles.disabled,
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
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            loading && styles.hiddenText,
            styleOverrides,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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

  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },

  // Text variants
  primaryText: {
    color: text.white,
    fontSize: typography.fontSize.base,
  },

  // Text sizes
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
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
