import { borderRadius, colours, spacing, text } from "@/lib/tokens";
import React, { type ReactNode, createContext, useContext } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Button } from "./Button";
import { Input } from "./Input";
import { Title } from "./Title";

type CardContextType = {
  textColour: string;
};

const CardContext = createContext<CardContextType | null>(null);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("Card compound components must be used within a Card");
  }
  return context;
};

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
  const textColour = variant === "elevated" ? text.white : text.black;

  return (
    <CardContext.Provider value={{ textColour }}>
      <View style={[styles.base, styles[variant], styles[padding], style]}>
        {children}
      </View>
    </CardContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Base card styles
  base: {
    borderRadius: borderRadius.lg,
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
  outlined: {
    backgroundColor: colours.background,
    borderWidth: 1,
    // borderColor: colours.border,
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
