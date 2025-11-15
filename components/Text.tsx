import { colours } from "@/styles/tokens";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

interface TextProps extends RNTextProps {
  variant?: "regular" | "error";
}

export default function Text({ variant = "regular", ...rest }: TextProps) {
  return <RNText style={styles[variant]} {...rest} />;
}

const styles = StyleSheet.create({
  regular: {
    color: "#fff",
  },
  error: {
    color: colours.error,
  },
});
