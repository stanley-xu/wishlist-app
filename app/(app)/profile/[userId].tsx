import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChevronUp } from "lucide-react-native";
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
  Loading,
  ProfileCard,
  Text,
  WishlistItemEditModal,
  WishlistSection,
} from "@/components";
import { Features } from "@/config";
import {
  profiles,
  wishlistItems as wishlistItemsApi,
  wishlists as wishlistsApi,
} from "@/lib/api";
import { useCollapsibleHeader } from "@/lib/hooks/useCollapsibleHeader";
import type { Profile, Wishlist, WishlistItem } from "@/lib/schemas";
import { colours, spacing, text } from "@/styles/tokens";

const PROFILE_CARD_HEIGHT = 320;

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const navigation = useNavigation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewingItem, setViewingItem] = useState<WishlistItem | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const firstName = profile?.name.split(" ")[0] || "Profile";

  const {
    gesture,
    animatedProfileCardStyle,
    animatedSpacerStyle,
    animatedChevronStyle,
    toggleExpand,
    isCollapsed,
  } = useCollapsibleHeader({ cardHeight: PROFILE_CARD_HEIGHT });

  useEffect(() => {
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
    });
  }, [navigation, firstName, isCollapsed, toggleExpand, animatedChevronStyle]);

  useEffect(() => {
    if (!userId) {
      setError(new Error("No user ID provided"));
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

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

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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
});
