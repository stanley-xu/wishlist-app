import { Card, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { palette } from "@/styles/tokens";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, loading } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await signIn({ email, password });
      // Force navigation after successful login
      router.replace("/(tabs)");
    } catch (e) {
      const authError = e as AuthError;

      console.error(authError);
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <ScrollView>
          <Card variant="elevated">
            <Card.Title>Sign in</Card.Title>

            <Card.Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Card.Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Card.Button onPress={handleLogin} loading={submitting || loading}>
              Continue
            </Card.Button>
            {error && <Text variant="error">{error}</Text>}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: palette.primary1Darkened,
  },
});
