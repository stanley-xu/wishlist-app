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
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWishlists = useCallback(async () => {
    setLoading(true);
    const { data, error } = await wishlistApi.getAll();

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (data == null || data.length === 0) {
      setLoading(false);
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
    setLoading(false);
  }, [singleWishlist]);

  const fetchWishlistItems = useCallback(async (wishlistId: string) => {
    setLoading(true);
    const { data: items, error } = await wishlistItemsApi.getByWishlistId(
      wishlistId
    );

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (items == null || items.length === 0) {
      setLoading(false);
      setWishlistItems([]);
      return;
    }

    setWishlistItems(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  useEffect(() => {
    if (!Features["multi-wishlists"]) {
      const firstWishlist = wishlists?.at(0);
      if (firstWishlist) {
        fetchWishlistItems(firstWishlist.id);
      }
    }
  }, [wishlists, fetchWishlistItems]);

  return {
    wishlists,
    wishlistItems,
    loading,
    error,
    refetchWishlist: fetchWishlists,
    refetchWishlistItems: fetchWishlistItems,
    setWishlistItems, // expose state updater for optimistic UI control
  };
}
