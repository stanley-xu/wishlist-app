import { Features } from "@/config";
import {
  wishlists as wishlistApi,
  wishlistItems as wishlistItemsApi,
} from "@/lib/api";
import { WishlistItem, type Wishlist } from "@/lib/schemas";
import { useCallback, useEffect, useState } from "react";

export function useWishlists(
  singleWishlist: boolean = !Features["multi-wishlists"]
) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [wishlistsLoading, setWishlistsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistItemsLoading, setWishlistItemsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWishlists = useCallback(async () => {
    setWishlistsLoading(true);
    const { data, error } = await wishlistApi.getAll();

    if (error) {
      setError(error);
      setWishlistsLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setWishlistsLoading(false);
      setWishlists([]);
      return;
    }

    if (singleWishlist) {
      // Fetch items for the wishlist (the default wishlist when multi-wishlists is off)
      const wishlist = data.at(0)!;
      setWishlists([wishlist]);
    } else {
      throw new Error("Multi-wishlist mode not supported");
    }
    setWishlistsLoading(false);
  }, [singleWishlist]);

  const fetchWishlistItems = useCallback(async (wishlistId: string) => {
    setWishlistItemsLoading(true);
    const { data: items, error } = await wishlistItemsApi.getByWishlistId(
      wishlistId
    );

    if (error) {
      setError(error);
      setWishlistItemsLoading(false);
      return;
    }

    if (!items || items.length === 0) {
      setWishlistItemsLoading(false);
      setWishlistItems([]);
      return;
    }

    setWishlistItems(items);
    setWishlistItemsLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  useEffect(() => {
    if (!Features["multi-wishlists"]) {
      const firstWishlist = wishlists.at(0);
      if (firstWishlist) {
        fetchWishlistItems(firstWishlist.id);
      }
    }
  }, [wishlists, fetchWishlistItems]);

  // Optimistic updates
  const updateLocalItem = useCallback(
    (itemId: string, updates: Partial<WishlistItem>) => {
      setWishlistItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === itemId ? { ...prevItem, ...updates } : prevItem
        )
      );
    },
    []
  );

  // Optimistic updates
  const removeLocalItem = useCallback((itemId: string) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((prevItem) => prevItem.id !== itemId)
    );
  }, []);

  return {
    wishlists,
    wishlistItems,
    loading: wishlistsLoading || wishlistItemsLoading,
    error,
    refetchWishlist: fetchWishlists,
    refetchWishlistItems: fetchWishlistItems,
    updateLocalItem,
    removeLocalItem,
  };
}
