-- Migration: Refactor wishlist_permissions from user-based to wishlist-based
-- Changes share tokens from per-user to per-wishlist permissions

-- Step 1: Add wishlist_id column (nullable initially for data migration)
ALTER TABLE public.wishlist_permissions
  ADD COLUMN wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE;

-- Step 2: Migrate existing data (if any exists)
-- For each user_id, find their first wishlist and link to it
UPDATE public.wishlist_permissions
SET wishlist_id = (
  SELECT id FROM public.wishlists
  WHERE user_id = wishlist_permissions.user_id
  LIMIT 1
)
WHERE wishlist_id IS NULL;

-- Step 3: Make wishlist_id NOT NULL
ALTER TABLE public.wishlist_permissions
  ALTER COLUMN wishlist_id SET NOT NULL;

-- Step 4: Drop old RLS policies FIRST (they depend on user_id)
DROP POLICY IF EXISTS "Users can view their own share tokens" ON public.wishlist_permissions;
DROP POLICY IF EXISTS "Users can create share tokens for their wishlist" ON public.wishlist_permissions;
DROP POLICY IF EXISTS "Users can update their own share tokens" ON public.wishlist_permissions;
DROP POLICY IF EXISTS "Anyone can read share tokens for validation" ON public.wishlist_permissions;

-- Step 5: Now drop old user_id column and constraints
ALTER TABLE public.wishlist_permissions
  DROP CONSTRAINT IF EXISTS wishlist_permissions_user_id_fkey,
  DROP COLUMN user_id;

-- Step 6: Update indexes
DROP INDEX IF EXISTS idx_wishlist_permissions_user;
CREATE INDEX idx_wishlist_permissions_wishlist
  ON public.wishlist_permissions(wishlist_id);

-- Step 7: Add unique constraint (one token per wishlist)
ALTER TABLE public.wishlist_permissions
  ADD CONSTRAINT unique_wishlist_token UNIQUE(wishlist_id);

-- Step 8: Create new RLS policies

-- Read: Anyone can read (needed for validation)
CREATE POLICY "Anyone can read share tokens for validation"
  ON public.wishlist_permissions FOR SELECT
  USING (true);

-- Write: Only wishlist owner can create/update tokens
CREATE POLICY "Users can create share tokens for their wishlists"
  ON public.wishlist_permissions FOR INSERT
  WITH CHECK (
    wishlist_id IN (
      SELECT id FROM public.wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own wishlist share tokens"
  ON public.wishlist_permissions FOR UPDATE
  USING (
    wishlist_id IN (
      SELECT id FROM public.wishlists WHERE user_id = auth.uid()
    )
  );
