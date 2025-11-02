import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface CenterProps {
  children: ReactNode;
  /** Take up full parent height. Defaults to true */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Center
 *
 * Centers children both horizontally and vertically.
 * Useful for loading states, empty states, or centered modals.
 *
 * Example:
 * <Center>
 *   <LoadingSpinner />
 * </Center>
 */
export default function Center({ children, fill = true, style }: CenterProps) {
  return (
    <View style={[fill && styles.fill, styles.center, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
