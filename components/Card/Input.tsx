import { Input as BaseInput, InputProps } from "@/components";
import { useCardContext } from "./Card";

export const Input = (props: InputProps) => (
  <BaseInput {...props} style={{ color: useCardContext().textColour }} />
);
