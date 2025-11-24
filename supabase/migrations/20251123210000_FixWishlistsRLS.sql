-- Migration: Fix RLS recursion and simplify for current development
-- Drop unused policies that cause recursion, keep only what we need

-- ============================================================================
-- Drop unused RLS policies (will re-add when needed)
-- ============================================================================

-- Participants policies (not needed yet)
DROP POLICY IF EXISTS "Users can view participants of their events" ON public.participants;
DROP POLICY IF EXISTS "Users can join events" ON public.participants;
DROP POLICY IF EXISTS "Users can leave events" ON public.participants;

-- Assignments policies (not needed yet)
DROP POLICY IF EXISTS "Users can view own assignment" ON public.assignments;
DROP POLICY IF EXISTS "Hosts can manage event assignments" ON public.assignments;

-- Events policies (not needed yet)
DROP POLICY IF EXISTS "Users can view own or participated events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Hosts can update own events" ON public.events;
DROP POLICY IF EXISTS "Hosts can delete own events" ON public.events;

-- ============================================================================
-- Fix Wishlists Policy
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own wishlist or assigned recipient" ON public.wishlists;

-- Simple policy: users can only see their own wishlists
CREATE POLICY "Users can view own wishlists"
  ON public.wishlists
  FOR SELECT
  USING (auth.uid() = user_id);
