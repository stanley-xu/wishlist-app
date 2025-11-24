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

import { Button, Card, Input, Text, WishlistItem, EditItemModal } from "@/components";
import Avatar from "@/components/Avatar/Avatar";
import { cardTitleStyles } from "@/components/Card/Title";
import { profiles, wishlistItems as wishlistItemsApi } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useCollapsibleHeader } from "@/lib/hooks/useCollapsibleHeader";
import { useWishlists } from "@/lib/hooks/useWishlists";
import { UpdateProfile, UpdateProfileSchema, WishlistItem as WishlistItemType } from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect, useNavigation } from "expo-router";
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

  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const {
    gesture,
    animatedProfileCardStyle,
    animatedSpacerStyle,
    animatedChevronStyle,
    toggleExpand,
    isCollapsed,
  } = useCollapsibleHeader({ cardHeight: PROFILE_CARD_HEIGHT });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url ?? null
  );

  const { wishlists, refetch: refetchWishlists } = useWishlists();

  useFocusEffect(
    useCallback(() => {
      refetchWishlists();
    }, [refetchWishlists])
  );

  const firstName = profile.name.split(" ")[0];

  const abbreviatedName = profile.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity
          onPress={toggleExpand}
          style={styles.collapsedHeaderContent}
        >
          <Text style={styles.collapsedHeaderName}>{firstName}</Text>
          <Animated.View style={animatedChevronStyle}>
            <Feather name="chevron-up" size={20} color={text.black} />
          </Animated.View>
        </TouchableOpacity>
      ),
      headerTransparent: false,
      headerStyle: {
        backgroundColor: colours.surface,
      },
    });
  }, [
    navigation,
    profile.name,
    isCollapsed,
    toggleExpand,
    animatedChevronStyle,
  ]);

  const [editingField, setEditingField] = useState<keyof UpdateProfile | null>(
    null
  );

  const [editingItem, setEditingItem] = useState<WishlistItemType | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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

  const handleEditItem = (item: WishlistItemType) => {
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const handleSaveItem = async (
    item: WishlistItemType,
    updates: { name: string; url?: string; description?: string }
  ) => {
    const { data, error } = await wishlistItemsApi.update(item.id, updates);
    if (!error) {
      await refetchWishlists();
    } else {
      console.error("Failed to update item:", error);
      throw error;
    }
  };

  const handlePinItem = async (item: WishlistItemType) => {
    const wishlist = wishlists.find((w) =>
      w.items.some((i) => i.id === item.id)
    );
    if (!wishlist) return;

    const newStatus = item.status === "pinned" ? "pending" : "pinned";

    try {
      // Update the status first
      const { error: updateError } = await wishlistItemsApi.update(item.id, {
        status: newStatus as any,
      });
      if (updateError) throw updateError;

      // Reorder items: pinned items at the top, then unpinned items
      const items = wishlist.items.map((i) =>
        i.id === item.id ? { ...i, status: newStatus as any } : i
      );

      // Sort: pinned items first, maintaining relative order
      const pinnedItems = items.filter((i) => i.status === "pinned");
      const unpinnedItems = items.filter((i) => i.status !== "pinned");
      const reorderedItems = [...pinnedItems, ...unpinnedItems];

      // Update order for all items
      const { error: reorderError } = await wishlistItemsApi.reorder(
        wishlist.id,
        reorderedItems.map((i) => i.id)
      );
      if (reorderError) throw reorderError;

      await refetchWishlists();
    } catch (error) {
      console.error("Failed to pin item:", error);
      await refetchWishlists();
    }
  };

  const handleDeleteItem = async (item: WishlistItemType) => {
    // Optimistic delete (would need to expose setWishlists from useWishlists hook)
    // For now, we'll refetch after the API call

    try {
      const { error } = await wishlistItemsApi.delete(item.id);
      if (error) throw error;
      await refetchWishlists();
    } catch (error) {
      console.error("Failed to delete item:", error);
      await refetchWishlists();
    }
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
              <WishlistItem
                key={item.id}
                item={item}
                variant="elevated"
                onPress={handleEditItem}
                onPin={handlePinItem}
                onDelete={handleDeleteItem}
              />
            ))
          )}
        </View>
      ))}
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colours.background }}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Animated.View style={animatedSpacerStyle} />
          <View style={styles.content}>{wishlistSection}</View>
        </Pressable>
      </ScrollView>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.profileCardContainer,
            { top: 0 },
            animatedProfileCardStyle,
          ]}
        >
          {profileCardSection}
        </Animated.View>
      </GestureDetector>

      <View style={[styles.bottomButton, { bottom: bottom + 60 }]}>
        <Button onPress={() => router.push("/add-item")}>
          <Text>Add Item</Text>
        </Button>
      </View>

      <EditItemModal
        visible={isEditModalVisible}
        item={editingItem}
        onSave={handleSaveItem}
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
  wishlistSection: {
    padding: spacing.md,
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
  },
});
