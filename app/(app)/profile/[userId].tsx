import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChevronUp, UserPlus, UserCheck } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  Loading,
  ProfileCard,
  Text,
  WishlistItemEditModal,
  WishlistSection,
} from "@/components";
import { Features } from "@/config";
import {
  follows,
  profiles,
  shareTokens,
  wishlistItems as wishlistItemsApi,
  wishlists as wishlistsApi,
} from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useCollapsibleHeader } from "@/lib/hooks/useCollapsibleHeader";
import type { Profile, Wishlist, WishlistItem } from "@/lib/schemas";
import { assert } from "@/lib/utils";
import { colours, spacing, text } from "@/styles/tokens";

const PROFILE_CARD_HEIGHT = 320;

function FollowButton({
  isFollowing,
  isLoading,
  onPress,
}: {
  isFollowing: boolean;
  isLoading: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={styles.followButton}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={text.black} />
      ) : isFollowing ? (
        <UserCheck size={20} color={text.black} />
      ) : (
        <UserPlus size={20} color={text.black} />
      )}
      <Text variant="semibold" fontSize="sm">
        {isFollowing ? "Unfollow" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  // Note: this is the currently logged in user, not necessarily the one whose profile we're rendering
  const { session, profile: currentProfile } = useAuthContext();
  assert(
    session && currentProfile,
    "UserProfileScreen should be authenticated and have profile context"
  );

  const { userId, list: wishlistId, share: shareToken } = useLocalSearchParams<{
    userId: string;
    list?: string;
    share?: string;
  }>();
  const navigation = useNavigation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [viewingItem, setViewingItem] = useState<WishlistItem | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const firstName = profile?.name.split(" ")[0] || "Profile";

  // Check if this is a shared wishlist view (has share token)
  const isSharedView = !!shareToken && !!wishlistId;

  const {
    gesture,
    animatedProfileCardStyle,
    animatedSpacerStyle,
    animatedChevronStyle,
    toggleExpand,
    isCollapsed,
  } = useCollapsibleHeader({
    cardHeight: PROFILE_CARD_HEIGHT,
    initialExpanded: isSharedView
  });

  const handleFollowToggle = useCallback(async () => {
    if (isFollowLoading) return;

    // Optimistic update
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);
    setIsFollowLoading(true);

    try {
      if (previousState) {
        const { error } = await follows.delete(userId);
        if (error) throw error;
      } else {
        const { error } = await follows.create(userId);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      // Revert on error
      setIsFollowing(previousState);
    } finally {
      setIsFollowLoading(false);
    }
  }, [isFollowLoading, isFollowing, userId]);

  useEffect(() => {
    const isOwnProfile = session.user.id === userId;

    navigation.setOptions({
      headerTransparent: false,
      headerStyle: {
        backgroundColor: colours.surface,
      },
      headerTitle: () => (
        <TouchableOpacity
          onPress={toggleExpand}
          style={[styles.collapsedHeaderContent]}
        >
          <Text variant="semibold" fontSize="lg">
            {firstName}
          </Text>
          <Animated.View style={animatedChevronStyle}>
            <ChevronUp size={16} color={text.black} />
          </Animated.View>
        </TouchableOpacity>
      ),
      headerRight: !isOwnProfile
        ? () => (
            <FollowButton
              isFollowing={isFollowing}
              isLoading={isFollowLoading}
              onPress={handleFollowToggle}
            />
          )
        : undefined,
    });
  }, [
    navigation,
    firstName,
    isCollapsed,
    toggleExpand,
    animatedChevronStyle,
    userId,
    isFollowing,
    isFollowLoading,
    handleFollowToggle,
  ]);

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        setLoading(true);

        // Check if user has access to this profile
        const currentUser = session.user;
        let userHasAccess = false;

        // User viewing their own profile - always has access
        if (currentUser.id === userId) {
          userHasAccess = true;
        } else if (wishlistId && shareToken && typeof shareToken === "string") {
          // Validate share token for specific wishlist
          const { data: isValid } = await shareTokens.validateFor(
            wishlistId,
            shareToken
          );
          userHasAccess = Boolean(isValid);
        }

        setHasAccess(userHasAccess);

        // If we don't have access, stop here
        if (!userHasAccess) {
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } =
          await profiles.getById(userId);
        if (profileError) throw profileError;
        if (!profileData) throw new Error("Profile not found");
        setProfile(profileData);

        // Fetch wishlists
        const { data: wishlistsData, error: wishlistsError } =
          await wishlistsApi.getByUserId(userId);
        if (wishlistsError) throw wishlistsError;
        setWishlists(wishlistsData || []);

        // Fetch wishlist items for the first wishlist (single wishlist mode)
        if (
          wishlistsData &&
          wishlistsData.length > 0 &&
          !Features["multi-wishlists"]
        ) {
          const wishlist = wishlistsData[0];
          const { data: itemsData, error: itemsError } =
            await wishlistItemsApi.getByWishlistId(wishlist.id);
          if (itemsError) throw itemsError;
          setWishlistItems(itemsData || []);
        }

        // Check if currently following this user (only if not own profile)
        if (userHasAccess && currentUser.id !== userId) {
          const { data: followingStatus } = await follows.isFollowing(userId);
          setIsFollowing(followingStatus ?? false);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    checkAccessAndFetchData();
  }, [userId, shareToken]);

  const refetchWishlistItems = useCallback(async (wishlistId: string) => {
    try {
      const { data: itemsData, error: itemsError } =
        await wishlistItemsApi.getByWishlistId(wishlistId);
      if (itemsError) throw itemsError;
      setWishlistItems(itemsData || []);
    } catch (err) {
      console.error("Error refetching wishlist items:", err);
    }
  }, []);

  const handleItemPress = (item: WishlistItem) => {
    setViewingItem(item);
    setIsViewModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Loading />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View style={styles.centerContainer}>
        <Text fontSize="lg" style={{ marginBottom: spacing.md }}>
          This wishlist is private
        </Text>
        <Text style={{ color: colours.text, opacity: 0.6 }}>
          Ask the owner to share it with you
        </Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text>
          Error loading profile: {error?.message || "Profile not found"}
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colours.background }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <Animated.View style={animatedSpacerStyle} />
          <View style={styles.content}>
            <WishlistSection
              wishlists={wishlists}
              wishlistItems={wishlistItems}
              error={error}
              onItemPress={handleItemPress}
              refetch={refetchWishlistItems}
              readOnly
            />
          </View>
        </Pressable>
      </ScrollView>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.profileCardContainer, animatedProfileCardStyle]}
        >
          <ProfileCard
            profile={profile}
            cardHeight={PROFILE_CARD_HEIGHT}
            readOnly
          />
        </Animated.View>
      </GestureDetector>

      <WishlistItemEditModal
        visible={isViewModalVisible}
        item={viewingItem}
        onClose={() => {
          setIsViewModalVisible(false);
          setViewingItem(null);
        }}
        readOnly
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: "100%",
    backgroundColor: colours.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.background,
  },
  profileCardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: PROFILE_CARD_HEIGHT,
  },
  collapsedHeaderContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.md,
    width: 150,
    gap: 0,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
