import { Input as BaseInput, InputProps } from "@/components/Input";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export const Input = (props: InputProps) => {
  const context = useSurfaceColourContext();
  return (
    <BaseInput
      {...props}
      labelStyle={{ color: context?.textColour }}
    />
  );
};
