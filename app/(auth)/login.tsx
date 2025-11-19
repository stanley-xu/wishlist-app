import { Card, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { Link } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AuthWrapper from "./wrapper";

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

  return (
    <AuthWrapper>
      <Card variant="elevated">
        <View style={{ position: "relative" }}>
          {/* TODO: fun daily greeting */}
          <Card.Title>Welcome</Card.Title>
          <Link
            href="/(auth)/register"
            style={{ position: "absolute", right: 0 }}
            asChild
          >
            <TouchableOpacity>
              <Text>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>

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

        {__DEV__ && (
          <Card.Button
            variant="dev"
            loading={submitting || loading}
            onPress={handleDevLogin}
          >
            Login as Dev
          </Card.Button>
        )}
      </Card>
    </AuthWrapper>
  );
}
