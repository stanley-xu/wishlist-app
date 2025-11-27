-- Migration: Add share tokens for wishlist sharing
-- This enables secure wishlist sharing via generated tokens

-- Create wishlist_permissions table
CREATE TABLE public.wishlist_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  share_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Optional analytics for future use
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Index for fast token lookups
CREATE INDEX idx_wishlist_permissions_token
  ON public.wishlist_permissions(share_token);

-- Index for user lookups
CREATE INDEX idx_wishlist_permissions_user
  ON public.wishlist_permissions(user_id);

-- Enable RLS
ALTER TABLE public.wishlist_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own share tokens"
  ON public.wishlist_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create share tokens for their wishlist"
  ON public.wishlist_permissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own share tokens"
  ON public.wishlist_permissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Note: Token validation will be handled in app layer
-- App will query this table to check if token is valid for a given user_id
