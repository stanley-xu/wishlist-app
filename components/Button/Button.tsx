import {
  borderRadius,
  colours,
  spacing,
  text,
  typography,
} from "@/styles/tokens";
import { ReactNode } from "react";
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
import { useSurfaceColourContext } from "../SurfaceColourContext";

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "outline" | "unstyled" | "dev";
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

  const parentSurfaceColourValue = useSurfaceColourContext();
  let contextualTextStyles = null;
  if (variant === "outline") {
    contextualTextStyles = StyleSheet.compose(textStyleOverrides, {
      color: parentSurfaceColourValue?.textColour,
    });
  }

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
        <Text
          style={[
            textStyles.text,
            textStyles[variant],
            contextualTextStyles,
            textStyleOverrides,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const textStyles = StyleSheet.create({
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },
  // Variants
  primary: {
    color: text.white,
  },
  outline: {},
  unstyled: {},
  dev: {
    color: text.white,
  },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    position: "absolute",
  },
});
