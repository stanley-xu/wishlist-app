import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@/components/buttons/Button";
import { useCardContext } from "./context";

export const Button = (props: BaseButtonProps) => {
  return (
    <BaseButton {...props} style={{ color: useCardContext().textColour }} />
  );
};
