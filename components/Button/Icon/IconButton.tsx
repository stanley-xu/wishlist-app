import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "../Button";

export function IconButton({ style, ...rest }: ButtonProps) {
  return <Button.Unstyled style={[styles.base, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    minWidth: 44,
  },
});
