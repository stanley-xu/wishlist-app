import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { Button, Input, Text } from "@/components";
import { profiles } from "@/lib/api";
import { CreateProfileSchema, type CreateProfile } from "@/lib/schemas";
import { colours, spacing } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useAuthContext } from "@/lib/auth";
import { fullPageStyles, largeHeaderStyles } from "../styles/styles";

export default function WelcomeScreen() {
  const { setProfile } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      ...largeHeaderStyles,
      title: "Welcome",
      headerRight: () => (
        <Button variant="unstyled" size="sm" onPress={handleSubmit(onSubmit)}>
          Let&apos;s go!
        </Button>
      ),
      headerLeft: () => {
        const { signOut } = useAuthContext();

        return (
          <Button
            variant="unstyled"
            size="sm"
            onPress={async () => await signOut()}
          >
            Sign out
          </Button>
        );
      },
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
      const { data: profileData, error } = await profiles.createProfile(data);

      if (error) throw error;
      if (!profileData)
        throw new Error("No profile data returned from createProfile");

      setProfile(profileData);

      // Navigation to app route happens automatically via session state change
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={fullPageStyles.container}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {/* TODO: illustration */}

        {/* Name field (required) */}
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
            <Input
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

        {/* Bio field (optional) */}
        <Text style={styles.label}>Bio</Text>
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: spacing["xl"],
    gap: spacing.md,
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
