import { Features } from "@/config";
import {
  wishlists as wishlistApi,
  wishlistItems as wishlistItemsApi,
} from "@/lib/api";
import type { WishlistItem } from "@/lib/schemas";
import { useCallback, useEffect, useState } from "react";

type WishlistWithItems = {
  id: string;
  name: string;
  eventId: string | null;
  items: WishlistItem[];
};

export function useWishlists(
  singleWishlist: boolean = !Features["multi-wishlists"]
) {
  const [wishlists, setWishlists] = useState<WishlistWithItems[]>([]);
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

    let normalized = data ?? [];

    // Filter to first wishlist if multi-wishlists is off
    if (!Features["multi-wishlists"] && normalized.length > 0) {
      normalized = [normalized[0]];
    }

    if (singleWishlist) {
      // Fetch items for the wishlist (typically just one when multi-wishlists is off)
      const wishlist = normalized[0];
      if (!wishlist) {
        setWishlists([]);
        setLoading(false);
        return;
      }

      const { data: items } = await wishlistItemsApi.getByWishlistId(
        wishlist.id
      );

      setWishlists([
        {
          id: wishlist.id,
          name: wishlist.name,
          eventId: wishlist.event_id ?? null,
          items: items ?? [],
        },
      ]);
    } else {
      throw new Error("Multi-wishlist mode not supported");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  return {
    wishlists,
    loading,
    error,
    refetch: fetchWishlists,
  };
}
