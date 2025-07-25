import { borderRadius, colors, spacing } from "@/lib/tokens";
import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  style,
}: CardProps) {
  return (
    <View style={[styles.base, styles[variant], styles[padding], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Base card styles
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
  },

  // Variants
  default: {
    backgroundColor: colors.surface,
  },
  elevated: {
    backgroundColor: colors.surface,
    // iOS shadow
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  outlined: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Padding options
  sm: {
    padding: spacing.md,
  },
  md: {
    padding: spacing.lg,
  },
  lg: {
    padding: spacing.xl,
  },
});
