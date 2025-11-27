-- Allow anyone to read wishlist items (needed for shared wishlists)
-- Keep write operations restricted to owner only

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view accessible wishlist items" ON public.wishlist_items;

-- Allow anyone to read wishlist items (consistent with public wishlist viewing)
-- The "Users can manage own wishlist items" policy already restricts writes
CREATE POLICY "Anyone can view wishlist items"
  ON public.wishlist_items
  FOR SELECT
  USING (true);
