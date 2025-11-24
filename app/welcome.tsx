import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { Button, Input, Text } from "@/components";
import { Features } from "@/config";
import { profiles, wishlistItems, wishlists } from "@/lib/api";
import { CreateProfileSchema, CreateWishlistItemSchema } from "@/lib/schemas";
import { spacing } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";

import { useAuthContext } from "@/lib/auth";
import { fullPageStyles, largeHeaderStyles } from "../styles/styles";

// Combined schema for onboarding
const OnboardingSchema = z.object({
  name: CreateProfileSchema.shape.name,
  bio: CreateProfileSchema.shape.bio,
  firstItemName: CreateWishlistItemSchema.shape.name
    .optional()
    .or(z.literal("")),
});

type OnboardingForm = z.infer<typeof OnboardingSchema>;

export default function WelcomeScreen() {
  const { setProfile } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      ...largeHeaderStyles,
      title: "Welcome",
      headerRight: () => (
        <Button.Unstyled onPress={handleSubmit(onSubmit)}>
          <Text variant="semibold">Let&apos;s go!</Text>
        </Button.Unstyled>
      ),
      headerLeft: () => {
        const { signOut } = useAuthContext();

        return (
          <Button.Unstyled onPress={async () => await signOut()}>
            <Text variant="semibold">Sign out</Text>
          </Button.Unstyled>
        );
      },
    });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      bio: "",
      firstItemName: "",
    },
  });

  const onSubmit = async (data: OnboardingForm) => {
    try {
      const { data: profileData, error } = await profiles.createProfile({
        name: data.name,
        bio: data.bio,
      });

      if (error) throw error;
      if (!profileData)
        throw new Error("No profile data returned from createProfile");

      // Seed default wishlist if multi-wishlist feature is off
      if (!Features["multi-wishlists"]) {
        const { data: wishlistData, error: wishlistError } =
          await wishlists.create({
            name: "My Wishlist",
          });

        if (wishlistError) {
          console.error("Error creating default wishlist:", wishlistError);
        } else if (wishlistData && data.firstItemName) {
          // Add first item if provided
          const { error: itemError } = await wishlistItems.create(
            wishlistData.id,
            {
              name: data.firstItemName,
            }
          );

          if (itemError) {
            console.error("Error creating first wishlist item:", itemError);
          }
        }
      }

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About you</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name"
                placeholder="What's your name?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                autoCapitalize="words"
                autoFocus
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bio (optional)"
                placeholder="Tell us about yourself"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.bio?.message}
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>

        {!Features["multi-wishlists"] && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your first wish</Text>

            <Controller
              control={control}
              name="firstItemName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Item name (optional)"
                  placeholder="What do you want?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstItemName?.message}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
});
