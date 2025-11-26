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
  ProfileCard,
  Text,
  WishlistItemEditModal,
  WishlistSection,
} from "@/components";
import { Features } from "@/config";
import { profiles } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useCollapsibleHeader } from "@/lib/hooks/useCollapsibleHeader";
import { useWishlists } from "@/lib/hooks/useWishlists";
import { WishlistItem as WishlistItemType } from "@/lib/schemas";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import { router, useNavigation } from "expo-router";
import { ChevronUp, CirclePlus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PROFILE_CARD_HEIGHT = 320;

export default function ProfileScreen() {
  const { profile, setProfile } = useAuthContext();
  if (!profile) {
    throw new Error("[Panic] rendering ProfileScreen without a profile");
  }

  const firstName = profile.name.split(" ")[0];

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
  }, [navigation, isCollapsed, toggleExpand, animatedChevronStyle, firstName]);

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

  const handleProfileUpdate = async (field: string, value: string) => {
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
          <ProfileCard
            profile={profile}
            cardHeight={PROFILE_CARD_HEIGHT}
            onUpdate={handleProfileUpdate}
          />
        </Animated.View>
      </GestureDetector>

      <View style={styles.bottomButtonWrapper}>
        <Button
          onPress={() => router.push("/add-item")}
          style={[styles.bottomButton, { bottom: bottom + 60 }]}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <CirclePlus color={colours.background} />
            <Text variant="bold" fontSize="2xs">
              Add Item
            </Text>
          </View>
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
  bottomButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomButton: {
    position: "absolute",
    borderRadius: borderRadius.full,
    width: 125,
    paddingVertical: spacing.sm,
  },
  collapsedHeaderContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.md, // Used to vertically align on header content baseline
    width: 150,
    gap: 0,
  },
  profileCardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: PROFILE_CARD_HEIGHT,
  },
});
