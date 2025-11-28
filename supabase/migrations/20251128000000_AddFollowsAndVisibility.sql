-- Add visibility column to wishlists table
ALTER TABLE public.wishlists
  ADD COLUMN visibility TEXT DEFAULT 'private' NOT NULL
  CHECK (visibility IN ('private', 'follower', 'public'));

-- Create follows table for user-to-user following relationships
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notify_on_update BOOLEAN DEFAULT TRUE NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id) -- Can't follow yourself
);

-- Enable RLS on follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows table
-- Users can view their own follows (people they're following)
CREATE POLICY "Users can view who they are following"
  ON public.follows FOR SELECT
  USING (follower_id = auth.uid());

-- Users can view who's following them
CREATE POLICY "Users can view their followers"
  ON public.follows FOR SELECT
  USING (following_id = auth.uid());

-- Users can create follows (follow someone)
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

-- Users can delete their own follows (unfollow)
CREATE POLICY "Users can unfollow others"
  ON public.follows FOR DELETE
  USING (follower_id = auth.uid());

-- Indexes for better performance
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_wishlists_visibility ON public.wishlists(visibility);
