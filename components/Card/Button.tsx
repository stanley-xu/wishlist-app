import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@/components/Button";
import { spacing } from "@/styles/tokens";
import { useCardContext } from "./context";

export const Button = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      textStyle={{ color: useCardContext().textColour }}
      style={{ margin: spacing.sm }}
    />
  );
};
