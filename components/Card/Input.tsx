import { Input as BaseInput, InputProps } from "@/components/Input";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export const Input = (props: InputProps) => (
  <BaseInput
    {...props}
    labelStyle={{ color: useSurfaceColourContext().textColour }}
  />
);
