import {
  borderRadius,
  colours,
  spacing,
  text,
  typography,
} from "@/styles/tokens";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  labelStyle?: StyleProp<TextStyle>;
}

export function Input({
  label,
  error,
  size = "md",
  labelStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TextInput
        style={[
          styles.base,
          styles[size],
          isFocused && styles.focused,
          error && styles.error,
          style,
        ]}
        placeholderTextColor={text.black}
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

      {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginBottom: spacing.xs,
  },

  // Base input styles
  base: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colours.background,
    fontSize: typography.fontSize.base,
    color: text.black,
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
    borderColor: colours.accent,
  },

  error: {
    borderColor: colours.error,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    color: colours.error,
    marginTop: spacing.xs,
  },
});
