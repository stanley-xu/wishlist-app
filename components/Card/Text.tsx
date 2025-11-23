import { Text as BaseText, TextProps } from "@/components/Text";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export const Text = ({ style, ...rest }: TextProps) => {
  const textColour = useSurfaceColourContext()?.textColour;

  return <BaseText {...rest} style={[style, { color: textColour }]} />;
};
