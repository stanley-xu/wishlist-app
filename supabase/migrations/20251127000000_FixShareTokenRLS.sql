-- Fix RLS policies for share token validation
-- Allow anyone to read share tokens for validation, but only owners can manage them

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own share tokens" ON public.wishlist_permissions;

-- Allow anyone to read share tokens (they're meant to be shared)
CREATE POLICY "Anyone can read share tokens for validation"
  ON public.wishlist_permissions FOR SELECT
  USING (true);
