import { useAuth } from "@/lib/auth";
import TOKENS from "@/lib/tokens";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // Simple declarative redirects based on auth state
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TOKENS.colors.surface,
  },
  text: {
    fontSize: TOKENS.typography.fontSize.base,
    color: TOKENS.colors.textSecondary,
    marginTop: TOKENS.spacing.md,
  },
});
