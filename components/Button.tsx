import { borderRadius, colors, spacing, typography } from "@/lib/tokens";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
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
            color={
              variant === "outline"
                ? colors.primaryDark
                : colors.primaryContrast
            }
            style={styles.spinner}
          />
        )}
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            loading && styles.hiddenText,
          ]}
        >
          {title}
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
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primaryDark,
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
    color: colors.text,
    fontSize: typography.fontSize.base,
  },
  secondaryText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
  },
  outlineText: {
    color: colors.primaryDark,
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
