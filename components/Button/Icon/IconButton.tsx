import { StyleSheet } from "react-native";
import { Button } from "../Button";

import { UnstyledButtonProps } from "../Unstyled/Unstyled";

export function IconButton({ style, ...rest }: UnstyledButtonProps) {
  return <Button.Unstyled style={[styles.base, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    minWidth: 44,
  },
});
