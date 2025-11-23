import { colours } from "@/styles/tokens";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonProps } from "../Button";

export function UnstyledButton({
  children,
  onPress,
  size,
  disabled = false,
  loading = false,
  style: styleOverrides,
}: Omit<ButtonProps, "variant">) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        size && styles[size],
        isDisabled && styles.disabled,
        styleOverrides,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={colours.background}
            style={styles.spinner}
          />
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // Sizes
  sm: {
    minHeight: 36,
  },
  md: {
    minWidth: 44,
  },
  lg: {
    minHeight: 52,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Loading state styles
  contentContainer: {
    // flex: 1,
    position: "relative",
    // alignItems: "center",
    // justifyContent: "center",
  },
  spinner: {
    position: "absolute",
  },
});
