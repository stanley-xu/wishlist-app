import { colours, text, typography } from "@/styles/tokens";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export interface TextProps extends RNTextProps {
  variant?:
    | "regular"
    | "bold"
    | "semibold"
    | "italic"
    | "error"
    | "destructive";
  fontSize?: keyof typeof typography.fontSize;
}

export function Text({
  variant = "regular",
  fontSize = "base",
  style,
  ...rest
}: TextProps) {
  let textColour = useSurfaceColourContext()?.textColour;

  if (variant === "error") {
    textColour = colours.error;
  }

  return (
    <RNText
      style={[
        styles[variant],
        { fontSize: typography.fontSize[fontSize] },
        textColour && { color: textColour },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  regular: {
    color: text.black,
  },
  bold: {
    fontWeight: typography.fontWeight.bold,
  },
  semibold: {
    fontWeight: typography.fontWeight.semibold,
  },
  italic: {
    fontStyle: "italic",
  },
  error: {
    color: colours.error,
    fontWeight: typography.fontWeight.bold,
  },
  destructive: {
    color: colours.error,
    fontWeight: typography.fontWeight.bold,
  },
});
