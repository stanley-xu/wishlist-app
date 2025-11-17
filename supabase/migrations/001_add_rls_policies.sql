-- Migration: Add Row Level Security (RLS) Policies
-- This replaces the dangerous "application-level security" approach
-- with proper database-level security enforced by Postgres

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

-- Users already has RLS enabled in base schema
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; -- Already enabled

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Events Policies
-- ============================================================================

-- Users can view events they're hosting OR events they're participating in
CREATE POLICY "Users can view own or participated events"
  ON public.events
  FOR SELECT
  USING (
    auth.uid() = host_id OR
    EXISTS (
      SELECT 1 FROM public.participants
      WHERE participants.event_id = events.id
        AND participants.user_id = auth.uid()
    )
  );

-- Users can create events (they become the host)
CREATE POLICY "Users can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Only the host can update their event
CREATE POLICY "Hosts can update own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Only the host can delete their event
CREATE POLICY "Hosts can delete own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================================================
-- Participants Policies
-- ============================================================================

-- Users can view participants for events they're part of
CREATE POLICY "Users can view participants of their events"
  ON public.participants
  FOR SELECT
  USING (
    -- User is the host of this event
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
        AND events.host_id = auth.uid()
    ) OR
    -- User is a participant in this event
    EXISTS (
      SELECT 1 FROM public.participants p2
      WHERE p2.event_id = participants.event_id
        AND p2.user_id = auth.uid()
    )
  );

-- Users can join events (insert themselves as participant)
CREATE POLICY "Users can join events"
  ON public.participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can leave events they joined (delete their participation)
CREATE POLICY "Users can leave events"
  ON public.participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Wishlists Policies
-- ============================================================================

-- Users can view:
-- 1. Their own wishlist
-- 2. The wishlist of the person they're assigned to give a gift to
CREATE POLICY "Users can view own wishlist or assigned recipient"
  ON public.wishlists
  FOR SELECT
  USING (
    -- User owns this wishlist
    auth.uid() = user_id OR
    -- User is assigned to give a gift to this wishlist owner
    EXISTS (
      SELECT 1 FROM public.assignments
      WHERE assignments.event_id = wishlists.event_id
        AND assignments.giver_id = auth.uid()
        AND assignments.receiver_id = wishlists.user_id
    )
  );

-- Users can create/update their own wishlist
CREATE POLICY "Users can manage own wishlist"
  ON public.wishlists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Assignments Policies
-- ============================================================================

-- Users can ONLY view their own assignment (who they're giving to)
-- They CANNOT see who is giving to them (that would spoil the surprise!)
CREATE POLICY "Users can view own assignment"
  ON public.assignments
  FOR SELECT
  USING (auth.uid() = giver_id);

-- Only event hosts can create/manage assignments
-- In practice, this should be done via an Edge Function for fairness
CREATE POLICY "Hosts can manage event assignments"
  ON public.assignments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = assignments.event_id
        AND events.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = assignments.event_id
        AND events.host_id = auth.uid()
    )
  );

-- ============================================================================
-- Notes for future improvements
-- ============================================================================

-- TODO: Move assignment creation to a Supabase Edge Function
-- This will ensure:
-- 1. Fair random assignment algorithm
-- 2. Host cannot manipulate assignments
-- 3. Atomic transaction (all or nothing)
-- 4. Proper validation

-- TODO: Add policy for hosts to view all wishlists in their events
-- Currently hosts can only see wishlists if they're assigned to that person
-- This might be desirable for event management

-- TODO: Consider adding updated_at triggers instead of manual management
-- This would prevent client clock drift issues
