import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Card, Input } from "@/components";
import Avatar from "@/components/Avatar/Avatar";
import { cardTitleStyles } from "@/components/Card/Title";
import { profiles } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { UpdateProfile, UpdateProfileSchema } from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const ProfileFormSchema = UpdateProfileSchema.pick({ name: true, bio: true });
type ProfileForm = z.infer<typeof ProfileFormSchema>;

export default function ProfileScreen() {
  const { profile, setProfile } = useAuthContext();
  if (!profile) {
    throw new Error("[Panic] rendering ProfileScreen without a profile");
  }

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url ?? null
  );

  const [editingField, setEditingField] = useState<keyof UpdateProfile | null>(
    null
  );

  const {
    control,
    getValues,
    trigger,
    formState: { errors: formErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio ?? "",
    },
  });

  const hasFormErrors = Object.keys(formErrors).length > 0;

  const handleSave = async (field: keyof ProfileForm) => {
    const isValid = await trigger(field);
    if (!isValid) return;

    const value = getValues(field);
    setEditingField(null);

    // Optimistic update
    const previousProfile = profile;
    setProfile({ ...profile, [field]: value });

    // Persist to network
    try {
      await profiles.updateProfile({ [field]: value });
    } catch (error) {
      // Rollback on error
      setProfile(previousProfile);
      console.error(error);
    }
  };

  const abbreviatedName = profile.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const profileCardSection = (
    <Card
      variant="elevated"
      corners="squared"
      style={{
        borderBottomStartRadius: borderRadius.lg,
        borderBottomEndRadius: borderRadius.lg,
      }}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Avatar
            url={avatarUrl}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              profiles.updateProfile({ avatar_url: url });
            }}
            fallbackText={abbreviatedName}
          />
        </View>

        {/* Editable Name */}
        <View style={styles.profileName}>
          <Controller
            control={control}
            name="name"
            render={({
              field: { onChange, value },
              fieldState: { error, isDirty },
            }) =>
              editingField === "name" ? (
                <Input.Unstyled
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => handleSave("name")}
                  autoFocus
                  error={error?.message}
                  style={[
                    cardTitleStyles.title,
                    styles.fieldElement,
                    styles.profileInput,
                    isDirty && { borderColor: text.black },
                    error && { borderColor: colours.error, borderWidth: 2 },
                  ]}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setEditingField("name")}
                  disabled={hasFormErrors}
                  style={styles.fieldElement}
                >
                  <Card.Title>{value}</Card.Title>
                </TouchableOpacity>
              )
            }
          />
        </View>

        {/* Editable Bio */}
        <Controller
          control={control}
          name="bio"
          render={({
            field: { onChange, value },
            fieldState: { error, isDirty },
          }) =>
            editingField === "bio" ? (
              <Input.Unstyled
                value={value}
                onChangeText={onChange}
                onBlur={() => handleSave("bio")}
                autoFocus
                error={error?.message}
                style={[
                  styles.fieldElement,
                  styles.profileInput,
                  isDirty && { borderColor: text.black },
                  error && { borderColor: colours.error, borderWidth: 2 },
                ]}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setEditingField("bio")}
                disabled={hasFormErrors}
                style={styles.fieldElement}
              >
                <Card.Text variant="italic">
                  {value || "Add a bio..."}
                </Card.Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
    </Card>
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => Keyboard.dismiss()}>
        {profileCardSection}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.background,
  },
  fieldElement: {
    borderWidth: 1, // Used for consistent layout spacing in both regular and editing states
    borderColor: "transparent",
    minWidth: 150,
    padding: spacing.sm,
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileAvatar: {
    marginBottom: spacing.md,
  },
  profileName: {},
  profileInput: {
    borderStyle: "dashed",
    borderColor: colours.accent,
    borderRadius: borderRadius.md,
  },
});
