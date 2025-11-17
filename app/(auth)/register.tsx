import { Card, Spacer, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { generateFakeUser } from "@/lib/fake-data";
import { text } from "@/styles/tokens";
import { AuthError } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

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
      setError(null);
      setSubmitting(true);
      await signUp({ email, password });
      // Navigation happens automatically via session state change
    } catch (e) {
      const authError = e as AuthError;
      console.error(authError);
      setError(authError.message);
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
    <Card variant="elevated">
      <View style={{ display: "flex" }}>
        <Spacer />
        <Card.Title>Create account</Card.Title>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={{ color: text.white, alignSelf: "center" }}>
              Already signed up? Login
            </Text>
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

      <Card.Input
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Card.Button onPress={handleRegister} loading={submitting || loading}>
        Register
      </Card.Button>

      {error && <Text variant="error">{error}</Text>}

      {__DEV__ && (
        <Card.Button
          loading={submitting || loading}
          onPress={handleDevRegister}
          variant="dev"
        >
          Auto-generate user
        </Card.Button>
      )}
    </Card>
  );
}
