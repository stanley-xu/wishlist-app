import { Button, Input, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { fullPageStyles } from "@/styles/styles";
import { spacing } from "@/styles/tokens";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, loading } = useAuthContext();

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await signIn({ email, password });
      // Navigation happens automatically via session state change
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await signIn({
        email: "dev@example.com",
        password: "dev@example.com",
      });
      // Navigation happens automatically via session state change
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDev2Login = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await signIn({
        email: "alice@example.com",
        password: "alice@example.com",
      });
      // Navigation happens automatically via session state change
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.form}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* <Text style={styles.title}>Welcome</Text> */}
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button onPress={handleLogin} loading={submitting || loading}>
          <Text variant="semibold">Continue</Text>
        </Button>

        {error && <Text variant="error">{error}</Text>}

        {__DEV__ && (
          <>
            <Button
              variant="dev"
              loading={submitting || loading}
              onPress={handleDevLogin}
            >
              <Text variant="semibold">Login as Dev</Text>
            </Button>
            <Button
              variant="dev"
              loading={submitting || loading}
              onPress={handleDev2Login}
            >
              <Text variant="semibold">Login as Alice</Text>
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: fullPageStyles.container,
  form: {
    paddingTop: spacing["xl"],
    gap: spacing.md,
  },
  title: fullPageStyles.title,
  subtitle: fullPageStyles.subtitle,
});
