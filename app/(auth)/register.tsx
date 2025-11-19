import { Button, Input, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { generateFakeUser } from "@/lib/fake-data";
import { spacing } from "@/styles/tokens";
import { AuthError } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { fullPageStyles } from "../styles";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signUp, loading } = useAuthContext();

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await signUp({ email, password });

      // In local: navigation happens automatically via session state change
      // In prod: email confirmation needs to be done
      router.push("/(auth)/handoff");
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevRegister = async () => {
    const fakeUser = generateFakeUser();

    try {
      setError(null);
      setSubmitting(true);

      // Set form values for visibility
      setEmail(fakeUser.email);
      setPassword(fakeUser.password);
      setConfirmPassword(fakeUser.password);

      await signUp({
        email: fakeUser.email,
        password: fakeUser.password,
      });

      // Navigation happens automatically via session state change
    } catch (e) {
      const authError = e as AuthError;
      console.error(authError);
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create account</Text>

        <Input
          label="Email"
          placeholder="giver@giftful.io"
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

        <Input
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button onPress={handleRegister} loading={submitting || loading}>
          Register
        </Button>

        {error && <Text variant="error">{error}</Text>}

        {__DEV__ && (
          <Button
            loading={submitting || loading}
            onPress={handleDevRegister}
            variant="dev"
          >
            Auto-generate user
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...fullPageStyles.container,
    alignItems: "center",
  },
  form: {
    gap: spacing.md,
    width: "100%",
  },
  title: fullPageStyles.title,
  subtitle: fullPageStyles.subtitle,
});
