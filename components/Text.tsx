import { colours, text } from "@/styles/tokens";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

export interface TextProps extends RNTextProps {
  variant?: "regular" | "italic" | "error";
}

export function Text({ variant = "regular", ...rest }: TextProps) {
  return <RNText style={styles[variant]} {...rest} />;
}

const styles = StyleSheet.create({
  regular: {
    color: text.black,
  },
  italic: {
    fontStyle: "italic",
  },
  error: {
    color: colours.error,
  },
});
