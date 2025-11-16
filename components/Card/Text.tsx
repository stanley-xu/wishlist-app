import { Text as BaseText, TextProps } from "@/components/Text";
import { useCardContext } from "./context";

export const Text = (props: TextProps) => {
  const { textColour } = useCardContext();

  return <BaseText {...props} style={{ color: textColour }} />;
};
