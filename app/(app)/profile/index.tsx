import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import {
  Button,
  Card,
  Input,
  Text,
  WishlistItemEditModal,
  WishlistSection,
} from "@/components";
import Avatar from "@/components/Avatar/Avatar";
import { cardTitleStyles } from "@/components/Card/Title";
import { Features } from "@/config";
import { profiles } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useCollapsibleHeader } from "@/lib/hooks/useCollapsibleHeader";
import { useWishlists } from "@/lib/hooks/useWishlists";
import {
  UpdateProfile,
  UpdateProfileSchema,
  WishlistItem as WishlistItemType,
} from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation } from "expo-router";
import { ChevronUp } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const PROFILE_CARD_HEIGHT = 320;

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
  const firstName = profile.name.split(" ")[0];
  const abbreviatedName = profile.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const {
    gesture,
    animatedProfileCardStyle,
    animatedSpacerStyle,
    animatedChevronStyle,
    toggleExpand,
    isCollapsed,
  } = useCollapsibleHeader({ cardHeight: PROFILE_CARD_HEIGHT });

  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerStyle: {
        backgroundColor: colours.surface,
      },
      headerTitle: () => (
        <TouchableOpacity
          onPress={toggleExpand}
          style={styles.collapsedHeaderContent}
        >
          <Text style={styles.collapsedHeaderName}>{firstName}</Text>
          <Animated.View style={animatedChevronStyle}>
            <ChevronUp size={20} color={text.black} />
          </Animated.View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isCollapsed, toggleExpand, animatedChevronStyle, firstName]);

  const [editingField, setEditingField] = useState<keyof UpdateProfile | null>(
    null
  );

  const {
    wishlists,
    wishlistItems,
    error,
    refetchWishlistItems,
    updateLocalItem,
    removeLocalItem,
  } = useWishlists();
  const [editingItem, setEditingItem] = useState<WishlistItemType | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const memoRefetchWishlistItems = useCallback(() => {
    if (wishlists.length > 0 && !Features["multi-wishlists"]) {
      refetchWishlistItems(wishlists[0].id);
    }
  }, [refetchWishlistItems, wishlists]);

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

    const previousProfile = profile;
    setProfile({ ...profile, [field]: value });

    try {
      await profiles.updateProfile({ [field]: value });
    } catch (error) {
      setProfile(previousProfile);
      console.error(error);
    }
  };

  const handleItemPress = (item: WishlistItemType) => {
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const profileCardSection = (
    <Card
      corners="squared"
      style={{
        borderBottomStartRadius: borderRadius.lg,
        borderBottomEndRadius: borderRadius.lg,
        height: "100%",
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colours.background }}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Animated.View style={animatedSpacerStyle} />
          <View style={styles.content}>
            <WishlistSection
              wishlists={wishlists}
              wishlistItems={wishlistItems}
              error={error}
              onItemPress={handleItemPress}
              refetch={memoRefetchWishlistItems}
              optimisticUpdateItem={updateLocalItem}
              optimisticRemoveItem={removeLocalItem}
            />
          </View>
        </Pressable>
      </ScrollView>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.profileCardContainer, animatedProfileCardStyle]}
        >
          {profileCardSection}
        </Animated.View>
      </GestureDetector>

      <View style={[styles.bottomButton, { bottom: bottom + 60 }]}>
        <Button onPress={() => router.push("/add-item")}>
          <Text>Add Item</Text>
        </Button>
      </View>

      <WishlistItemEditModal
        visible={isEditModalVisible}
        item={editingItem}
        optimisticUpdateItem={updateLocalItem}
        onSave={memoRefetchWishlistItems}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingItem(null);
        }}
      />
    </GestureHandlerRootView>
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
    borderWidth: 1,
    borderColor: "transparent",
    minWidth: 150,
    padding: spacing.sm,
    alignItems: "center",
    textAlign: "center",
  },
  profileCardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: PROFILE_CARD_HEIGHT,
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
