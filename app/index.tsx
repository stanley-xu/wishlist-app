import { useAuthContext } from "@/lib/auth";
import { colours } from "@/styles/tokens";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuthContext();

  // Show loading while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Simple declarative redirects based on auth state
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.background,
  },
});
