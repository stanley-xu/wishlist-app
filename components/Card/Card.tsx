import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { type ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { SurfaceColourContext } from "../SurfaceColourContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { Text } from "./Text";
import { Title } from "./Title";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated";
  padding?: "sm" | "md" | "lg";
  corners?: "rounded" | "squared";
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  corners = "rounded",
  style,
}: CardProps) {
  const cornerRadius = corners === "rounded" ? borderRadius.lg : 0;

  return (
    <SurfaceColourContext.Provider value={{ textColour: text.black }}>
      <View
        style={[
          styles.base,
          styles[variant],
          styles[padding],
          { borderRadius: cornerRadius },
          style,
        ]}
      >
        {children}
      </View>
    </SurfaceColourContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Base card styles
  base: {
    backgroundColor: colours.background,
  },

  // Variants
  default: {
    backgroundColor: colours.surface,
  },
  elevated: {
    backgroundColor: colours.surface,
    // iOS shadow
    shadowColor: text.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
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

Card.Title = Title;
Card.Button = Button;
Card.Input = Input;
Card.Text = Text;
