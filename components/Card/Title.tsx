import { spacing, typography } from "@/styles/tokens";
import { type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { useCardContext } from "./context";

export const Title = ({ children }: { children: ReactNode }) => {
  const { textColour } = useCardContext();

  return (
    <Text style={[cardTitleStyles.title, { color: textColour }]}>
      {children}
    </Text>
  );
};

const cardTitleStyles = StyleSheet.create({
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
});
