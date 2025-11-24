import { useCallback, useEffect, useState } from "react";
import { Features } from "@/config";
import {
  wishlists as wishlistApi,
  wishlistItems as wishlistItemsApi,
} from "@/lib/api";
import type { WishlistItem } from "@/lib/schemas";

type WishlistWithItems = {
  id: string;
  name: string;
  eventId: string | null;
  items: WishlistItem[];
};

export function useWishlists() {
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

    // Fetch items for each wishlist
    const wishlistsWithItems = await Promise.all(
      normalized.map(async (w) => {
        const { data: items } = await wishlistItemsApi.getByWishlistId(w.id);
        return {
          id: w.id,
          name: w.name,
          eventId: w.event_id ?? null,
          items: items ?? [],
        };
      })
    );

    setWishlists(wishlistsWithItems);
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
