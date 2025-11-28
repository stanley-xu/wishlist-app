import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { ReactNode, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SurfaceColourContext } from "../SurfaceColourContext";
import { UnstyledButton } from "./Unstyled/Unstyled";

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  fullWidth?: boolean;
  variant?: "primary" | "outline" | "dev" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ON_PRESS_STYLES: ViewStyle = {
  opacity: 0.7,
};

const HUG_STYLES: ViewStyle = {
  marginHorizontal: "auto",
};

export function Button({
  children,
  onPress,
  fullWidth = false,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style: styleOverrides,
}: ButtonProps) {
  const hug = !fullWidth;
  const isDisabled = disabled || loading;

  const onPressStyles = useCallback((args: PressableStateCallbackType) => {
    return {
      ...(hug ? HUG_STYLES : null),
      ...(args.pressed ? ON_PRESS_STYLES : null),
    };
  }, []);

  const buttonMarkup = (
    <Pressable onPress={onPress} disabled={isDisabled} style={onPressStyles}>
      <View
        style={[
          styles.base,
          styles[variant],
          styles[size],
          isDisabled && styles.disabled,
          styles.contentContainer,
          styleOverrides,
        ]}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === "primary" || variant === "destructive" ? text.white : undefined}
            style={styles.spinner}
          />
        )}
        {children}
      </View>
    </Pressable>
  );

  if (variant === "primary" || variant === "destructive") {
    return (
      <SurfaceColourContext.Provider value={{ textColour: text.white }}>
        {buttonMarkup}
      </SurfaceColourContext.Provider>
    );
  }

  return buttonMarkup;
}

const styles = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.full,
  },

  // Variants
  primary: {
    backgroundColor: colours.accent,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: text.black,
  },
  destructive: {
    backgroundColor: colours.error,
  },
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
  },
  spinner: {
    position: "absolute",
  },
});

Button.Unstyled = UnstyledButton;
