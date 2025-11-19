import { router, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "@/components";
import { profiles } from "@/lib/api";
import { CreateProfileSchema, type CreateProfile } from "@/lib/schemas";
import { colours, palette, text } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const Submit = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={{
        width: 44,
      }}
      onPress={() => {
        console.log("test");
        router.replace("/");
      }}
    >
      <Text style={{ textAlign: "center" }}>Save</Text>
    </TouchableOpacity>
  );
};

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerStyle: {
        backgroundColor: palette.primary1,
      },
      headerTintColor: text.white,
      headerRight: () => <Submit />,
    });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProfile>({
    resolver: zodResolver(CreateProfileSchema),
  });

  const onSubmit = async (data: CreateProfile) => {
    try {
      console.log("onSubmit");
      const { data: result, error } = await profiles.createProfile(data);

      console.log({ profileCreated: result });

      if (error) throw error;

      // Navigate to main app
      router.replace("/(app)");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* TODO: illustration */}

        <Text style={styles.title}>Welcome, fellow gifter!</Text>

        {/* Name field (required) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name *</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="What's your name?"
                autoCapitalize="words"
              />
            )}
          />
          {errors.name && (
            <Text variant="error" style={styles.errorText}>
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Bio field (optional) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            )}
          />
        </View>

        {/* Submit button */}
        <Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
          Let&apos;s go!
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: colours.background,
  // },
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colours.background,
  },
  scrollContent: {
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: colours.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
});
