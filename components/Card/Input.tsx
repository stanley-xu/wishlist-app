import { Input as BaseInput, InputProps } from "@/components/Input";
import { useCardContext } from "./context";

export const Input = (props: InputProps) => (
  <BaseInput {...props} labelStyle={{ color: useCardContext().textColour }} />
);
