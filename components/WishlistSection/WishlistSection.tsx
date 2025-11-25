import { StyleSheet, View } from "react-native";

import { Wishlist, WishlistItem as WishlistItemType } from "@/lib/schemas";
import { spacing } from "@/styles/tokens";
import { Text } from "../Text";
import { WishlistItem } from "../WishlistItem";

import { wishlistItems as wishlistItemsApi } from "@/lib/api";

interface WishlistSectionProps {
  wishlists: Wishlist[];
  wishlistItems: WishlistItemType[];
  error: Error | null;
  onItemPress: (item: WishlistItemType) => void;
  refetch: (wishlistId: string) => void;
}

export default function WishlistSection({
  wishlists,
  wishlistItems,
  error,
  onItemPress,
  refetch,
}: WishlistSectionProps) {
  if (error) {
    return null;
  }

  if (wishlists.length === 0) {
    <Text>Looks like there's nothing here yet!</Text>;
  }

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No items yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Tap the button below to add your first wish
        </Text>
      </View>
    );
  }

  const handlePin = async (item: WishlistItemType) => {
    try {
      // Toggle pin status (no reordering needed - sorting happens at query time)
      const { error: toggleError } = await wishlistItemsApi.togglePin(item.id);
      if (toggleError) throw toggleError;
    } catch (error) {
      console.error("Failed to pin item:", error);
    } finally {
      if (wishlists.length > 0) {
        refetch(wishlists[0].id);
      }
    }
  };

  const handleDelete = async (item: WishlistItemType) => {
    // Optimistic delete (would need to expose setWishlists from useWishlists hook)
    // For now, we'll refetch after the API call

    try {
      const { error } = await wishlistItemsApi.delete(item.id);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      if (wishlists.length > 0) {
        refetch(wishlists[0].id);
      }
    }
  };

  return (
    <View style={styles.wishlistSection}>
      {wishlists.map((wishlist) => (
        <View key={wishlist.id}>
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              variant="elevated"
              onPress={onItemPress}
              onPin={handlePin}
              onDelete={handleDelete}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
