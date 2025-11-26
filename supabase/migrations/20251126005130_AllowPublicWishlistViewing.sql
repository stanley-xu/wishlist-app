-- Migration: Allow public wishlist viewing (MVP only)
-- TODO: Replace with assignment-based policy when Secret Santa matching is implemented (Issue #7)
--
-- This migration temporarily allows all users to view all wishlists to enable
-- the profile viewing feature. This is acceptable for MVP development but MUST
-- be replaced with proper assignment-based RLS when implementing Secret Santa.
--
-- See Issue #7 for the proper assignment-based policy that should replace this.

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own wishlists" ON public.wishlists;

-- Create public read access policy (temporary for MVP)
CREATE POLICY "Users can view all wishlists"
  ON public.wishlists
  FOR SELECT
  USING (true);

-- Note: Keep existing INSERT/UPDATE/DELETE policies restrictive
-- Users can still only modify their own wishlists
