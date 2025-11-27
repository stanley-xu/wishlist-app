-- Allow anyone to read profiles (needed for shared wishlists)
-- Only the owner can modify their profile

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow anyone to read profiles (they're visible when wishlists are shared)
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);
