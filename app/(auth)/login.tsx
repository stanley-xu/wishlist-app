import { Card, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { text } from "@/styles/tokens";
import { AuthError } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

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
      const authError = e as AuthError;

      console.error(authError);
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            <Text style={{ color: text.white }}>Sign up</Text>
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
          onPress={async () => {
            setSubmitting(true);
            setEmail("dev@example.com");
            setPassword("dev@example.com");
            await signIn({
              email: "dev@example.com",
              password: "dev@example.com",
            });
          }}
        >
          Login as Dev
        </Card.Button>
      )}
    </Card>
  );
}
