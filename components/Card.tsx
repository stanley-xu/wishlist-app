import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '@/lib/tokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  return (
    <View 
      style={[
        styles.base,
        styles[variant],
        styles[padding],
        style,
      ]}
    >
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
    backgroundColor: colors.background,
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