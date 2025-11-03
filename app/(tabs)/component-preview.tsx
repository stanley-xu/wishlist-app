import { colours, spacing } from "@/lib/tokens";
import { ScrollView, StyleSheet, View } from "react-native";
import { metadata as buttonMetadata } from "../(component-previews)/button";

import { ShowcaseCard } from "../(component-previews)/_shared";

export default function Index() {
  const metadata = [buttonMetadata];

  const showcases = metadata.map(
    ({ title, subtitle, href, previewComponent }, idx) => (
      <ShowcaseCard
        key={idx}
        title={title}
        subtitle={subtitle}
        href={href}
        previewComponent={previewComponent}
      />
    )
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {showcases}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  content: {
    padding: spacing.lg,
  },
  spacer: {
    height: spacing.xl,
  },
});
