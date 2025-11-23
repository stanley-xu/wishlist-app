import { colours, text, typography } from "@/styles/tokens";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export interface TextProps extends RNTextProps {
  variant?: "regular" | "bold" | "italic" | "error" | "button";
}

export function Text({ variant = "regular", style, ...rest }: TextProps) {
  let textColour = useSurfaceColourContext()?.textColour;

  if (variant === "error") {
    textColour = colours.error;
  }

  return (
    <RNText style={[styles[variant], { color: textColour }, style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  regular: {
    color: text.black,
  },
  bold: {
    fontWeight: typography.fontWeight.bold,
  },
  italic: {
    fontStyle: "italic",
  },
  error: {
    color: colours.error,
    fontWeight: typography.fontWeight.bold,
  },

  button: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
});
