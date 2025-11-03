import { Button, Card, Input } from "@/components";
import { useAuth } from "@/lib/auth";
import TOKENS from "@/lib/tokens";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await signIn({ email, password });
      // Force navigation after successful login
      router.replace("/(tabs)");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card variant="elevated" padding="lg">
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

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

        <Button title="Sign In" onPress={handleLogin} loading={submitting} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: TOKENS.colours.surface,
    padding: TOKENS.spacing.lg,
  },
  title: {
    fontSize: TOKENS.typography.fontSize["2xl"],
    fontWeight: TOKENS.typography.fontWeight.bold,
    color: TOKENS.colours.text,
    textAlign: "center",
    marginBottom: TOKENS.spacing.xs,
  },
  subtitle: {
    fontSize: TOKENS.typography.fontSize.base,
    color: TOKENS.colours.textSecondary,
    textAlign: "center",
    marginBottom: TOKENS.spacing.xl,
  },
});
