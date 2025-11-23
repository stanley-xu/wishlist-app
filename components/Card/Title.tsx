import { typography } from "@/styles/tokens";
import { type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { useSurfaceColourContext } from "../SurfaceColourContext";

export const Title = ({ children }: { children: ReactNode }) => {
  const textColour = useSurfaceColourContext()?.textColour;

  return (
    <Text style={[cardTitleStyles.title, { color: textColour }]}>
      {children}
    </Text>
  );
};

export const cardTitleStyles = StyleSheet.create({
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },
});
