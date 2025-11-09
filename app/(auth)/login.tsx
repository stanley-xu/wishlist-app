import { Card } from "@/components";
import { useAuth } from "@/lib/auth";
import { palette, text } from "@/lib/tokens";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Card variant="elevated" padding="lg" style={styles.card}>
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

              <Card.Button onPress={handleLogin} loading={submitting}>
                Continue
              </Card.Button>
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: Platform.OS === "web" ? 16 : 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: palette.primary1Darkened,
  },
  card: {
    color: text.white,
  },
});
