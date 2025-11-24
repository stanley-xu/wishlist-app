import { useCallback, useEffect, useState } from "react";
import { Features } from "@/config";
import { wishlists as wishlistApi } from "@/lib/api";

type WishlistType = {
  id: string;
  name: string;
  eventId: string | null;
};

export function useWishlists() {
  const [wishlists, setWishlists] = useState<WishlistType[]>([]);
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

    const normalized =
      data?.map((w) => ({
        id: w.id,
        name: w.name,
        eventId: w.event_id ?? null,
      })) ?? [];

    if (Features["multi-wishlists"]) {
      setWishlists(normalized);
    } else {
      setWishlists(normalized.length > 0 ? [normalized[0]] : []);
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
