import { Children, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { spacing } from "@/styles/tokens";

interface StackProps {
  children: ReactNode;
  /** Spacing between children. Defaults to 'md' */
  spacing?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
}

/**
 * Stack
 *
 * Arranges children vertically with consistent spacing between them.
 * Think of it like flexbox with gap, but for React Native.
 *
 * Example:
 * <Stack spacing="lg">
 *   <Button title="First" />
 *   <Button title="Second" />
 *   <Button title="Third" />
 * </Stack>
 */
export default function Stack({
  children,
  spacing: space = "md",
  style,
}: StackProps) {
  const childArray = Children.toArray(children);

  return (
    <View style={style}>
      {childArray.map((child, index) => (
        <View
          key={index}
          style={
            index < childArray.length - 1
              ? { marginBottom: spacing[space] }
              : undefined
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
}
