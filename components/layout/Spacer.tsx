import { View } from "react-native";

import { spacing } from "@/lib/tokens";

interface SpacerProps {
  /** Size of the spacer. Defaults to 'md' */
  size?: keyof typeof spacing;
  /** Direction of spacer. 'vertical' adds height, 'horizontal' adds width */
  direction?: "vertical" | "horizontal";
}

/**
 * Spacer
 *
 * Adds fixed spacing in vertical or horizontal layouts.
 * Alternative to marginTop/marginBottom when you want explicit spacing.
 *
 * Example:
 * <Text>First</Text>
 * <Spacer size="lg" />
 * <Text>Second</Text>
 */
export default function Spacer({
  size = "md",
  direction = "vertical",
}: SpacerProps) {
  const spacerSize = spacing[size];

  return (
    <View
      style={
        direction === "vertical"
          ? { height: spacerSize }
          : { width: spacerSize }
      }
    />
  );
}
