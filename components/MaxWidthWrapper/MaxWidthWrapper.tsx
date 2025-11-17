import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { spacing } from "@/styles/tokens";

interface MaxWidthWrapperProps {
  children: ReactNode;
  /** Maximum width in pixels. Defaults to 600 (good for mobile-first design) */
  maxWidth?: number;
  /** Horizontal padding. Defaults to 'lg' */
  paddingX?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
}

/**
 * MaxWidthWrapper
 *
 * Constrains content width and centers it horizontally.
 * Useful for preventing content from getting too wide on tablets/web.
 *
 * Example:
 * <MaxWidthWrapper maxWidth={800}>
 *   <Text>Centered content that won't exceed 800px</Text>
 * </MaxWidthWrapper>
 */
export default function MaxWidthWrapper({
  children,
  maxWidth = 600,
  paddingX = "lg",
  style,
}: MaxWidthWrapperProps) {
  return (
    <View
      style={[
        styles.wrapper,
        {
          maxWidth,
          paddingHorizontal: spacing[paddingX],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "center",
  },
});
