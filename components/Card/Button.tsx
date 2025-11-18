import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@/components/Button";
import { spacing } from "@/styles/tokens";

export const Button = (props: BaseButtonProps) => {
  return <BaseButton {...props} style={{ margin: spacing.sm }} />;
};
