import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/lib/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Input({
  label,
  error,
  size = 'md',
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <TextInput
        style={[
          styles.base,
          styles[size],
          isFocused && styles.focused,
          error && styles.error,
          style,
        ]}
        placeholderTextColor={colors.textPlaceholder}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  // Base input styles
  base: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingHorizontal: spacing.md,
  },

  // Sizes
  sm: {
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingVertical: spacing.lg,
    minHeight: 52,
  },

  // States
  focused: {
    borderColor: colors.primary,
  },

  error: {
    borderColor: colors.error,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});