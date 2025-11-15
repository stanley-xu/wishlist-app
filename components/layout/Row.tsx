import { Children, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { spacing } from "@/styles/tokens";

interface RowProps {
  children: ReactNode;
  /** Spacing between children. Defaults to 'md' */
  spacing?: keyof typeof spacing;
  /** Vertical alignment. Defaults to 'center' */
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  /** Horizontal distribution. Defaults to 'flex-start' */
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  /** Allow wrapping to next line. Defaults to false */
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Row
 *
 * Arranges children horizontally with consistent spacing.
 * Supports alignment, justification, and wrapping.
 *
 * Example:
 * <Row spacing="sm" justify="space-between" align="center">
 *   <Text>Left</Text>
 *   <Button title="Right" />
 * </Row>
 */
export default function Row({
  children,
  spacing: space = "md",
  align = "center",
  justify = "flex-start",
  wrap = false,
  style,
}: RowProps) {
  const childArray = Children.toArray(children);

  return (
    <View
      style={[
        styles.row,
        {
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
    >
      {childArray.map((child, index) => (
        <View
          key={index}
          style={
            index < childArray.length - 1
              ? { marginRight: spacing[space] }
              : undefined
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
