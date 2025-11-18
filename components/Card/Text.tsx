import { Text as BaseText, TextProps } from "@/components/Text";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export const Text = (props: TextProps) => {
  const { textColour } = useSurfaceColourContext();

  return <BaseText {...props} style={{ color: textColour }} />;
};
