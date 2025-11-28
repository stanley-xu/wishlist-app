import { colours, spacing, typography } from "@/styles/tokens";
import { StyleSheet, TextInput, View } from "react-native";
import { Text } from "../Text";
import { InputProps } from "./Input";

interface UnstyledInputProps extends InputProps {
  error?: string;
}

export function Unstyled({ error, size, style, ...props }: UnstyledInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.base, size && styles[size], style]}
        {...props}
      />
      {error && (
        <Text variant="error" style={styles.textField}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // TODO: provide enough default spacing so there's no shifting when error text is rendered
    // marginBottom: spacing.sm, // To create space for textField
  },

  base: {
    padding: 0,
    margin: 0,
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

  // Subcomponents
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  textField: {
    marginTop: spacing.sm,
  },
});
