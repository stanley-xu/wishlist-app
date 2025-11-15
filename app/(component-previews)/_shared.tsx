import { Card } from "@/components";
import { colours, spacing, typography } from "@/styles/tokens";
import { Link, LinkProps } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface ShowcaseCardProps {
  title: string;
  subtitle: string;
  href: LinkProps["href"];
  previewComponent: ReactNode;
}

export function ShowcaseCard({
  title,
  subtitle,
  href,
  previewComponent,
}: ShowcaseCardProps) {
  return (
    <Card variant="elevated" style={styles.card}>
      <Link href={href} asChild>
        <View style={styles.link}>
          <View style={styles.previewThumbnail}>{previewComponent}</View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </Link>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0, // Remove Card's default padding
  },
  link: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 120,
    padding: spacing.lg, // Add padding to the link instead
  },
  textContainer: {
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  previewThumbnail: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
    pointerEvents: "none", // Make preview non-interactive
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colours.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colours.textSecondary,
    textAlign: "center",
  },
});
