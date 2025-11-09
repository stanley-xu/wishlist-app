import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@/components";
import { useCardContext } from "./Card";

export const Button = (props: BaseButtonProps) => {
  return (
    <BaseButton {...props} style={{ color: useCardContext().textColour }} />
  );
};
