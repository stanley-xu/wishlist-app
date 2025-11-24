import {
  Animated,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Button, Card, Input, Text } from "@/components";
import Avatar from "@/components/Avatar/Avatar";
import { cardTitleStyles } from "@/components/Card/Title";
import { profiles } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useWishlists } from "@/lib/hooks/useWishlists";
import { UpdateProfile, UpdateProfileSchema } from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const PROFILE_CARD_HEIGHT = 280; // Approximate height of profile card
const COLLAPSED_THRESHOLD = PROFILE_CARD_HEIGHT * 0.5;

const ProfileFormSchema = UpdateProfileSchema.pick({ name: true, bio: true });
type ProfileForm = z.infer<typeof ProfileFormSchema>;

export default function ProfileScreen() {
  const { profile, setProfile } = useAuthContext();
  if (!profile) {
    throw new Error("[Panic] rendering ProfileScreen without a profile");
  }

  const navigation = useNavigation();
  // Animated.ScrollView ref forwards to underlying ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(PROFILE_CARD_HEIGHT)).current;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url ?? null
  );

  const { wishlists, refetch: refetchWishlists } = useWishlists();

  // Refetch wishlists when screen gains focus (e.g., after adding item)
  useFocusEffect(
    useCallback(() => {
      refetchWishlists();
    }, [refetchWishlists])
  );

  const { bottom } = useSafeAreaInsets();

  const abbreviatedName = profile.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  // Toggle expand/collapse
  const toggleExpand = useCallback(() => {
    const currentOffset = (scrollY as any)._value;
    const targetOffset =
      currentOffset > COLLAPSED_THRESHOLD ? 0 : PROFILE_CARD_HEIGHT;

    scrollViewRef.current?.scrollTo({
      y: targetOffset,
      animated: true,
    });
  }, [scrollY]);

  // Header opacity interpolation (shows when collapsed)
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSED_THRESHOLD, PROFILE_CARD_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  // Set up navigation header with collapsed view
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.View
          style={[styles.collapsedHeader, { opacity: headerOpacity }]}
        >
          <TouchableOpacity
            onPress={toggleExpand}
            style={styles.collapsedHeaderContent}
          >
            <Avatar url={avatarUrl} size={32} fallbackText={abbreviatedName} />
            <Text style={styles.collapsedHeaderName}>{profile.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      ),
    });
  }, [
    navigation,
    avatarUrl,
    abbreviatedName,
    profile.name,
    headerOpacity,
    toggleExpand,
  ]);


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

  const profileCardSection = (
    <Card
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

  const wishlistSection = (
    <View style={styles.wishlistSection}>
      {wishlists.map((wishlist) => (
        <View key={wishlist.id}>
          {wishlist.items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No items yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the button below to add your first wish
              </Text>
            </View>
          ) : (
            wishlist.items.map((item) => (
              <View key={item.id} style={styles.wishlistItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                {item.url && (
                  <Text style={styles.itemUrl} numberOfLines={1}>
                    {item.url}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colours.surface }}
        contentOffset={{ x: 0, y: PROFILE_CARD_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          {profileCardSection}
          <View style={styles.content}>{wishlistSection}</View>
        </Pressable>
      </Animated.ScrollView>
      <View
        style={[
          styles.bottomButton,
          { bottom: bottom + 60 }, // 60 for tab bar height
        ]}
      >
        <Button onPress={() => router.push("/add-item")}>
          <Text>Add Item</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: "100%",
    backgroundColor: colours.background,
  },
  bottomButton: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
  },
  collapsedHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  collapsedHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  collapsedHeaderName: {
    fontSize: 16,
    fontWeight: "600",
    color: text.black,
  },
  fieldElement: {
    borderWidth: 1, // Used for consistent layout spacing in both regular and editing states
    borderColor: "transparent",
    minWidth: 150,
    padding: spacing.sm,
    alignItems: "center",
    textAlign: "center",
  },
  profileHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: -spacing.xl,
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
  wishlistSection: {
    padding: spacing.md,
  },
  wishlistItem: {
    backgroundColor: colours.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: text.black,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: spacing.xs,
  },
  itemUrl: {
    fontSize: 12,
    color: colours.accent,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
