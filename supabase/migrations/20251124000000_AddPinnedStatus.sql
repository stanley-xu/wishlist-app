-- Migration: Add 'pinned' status to wishlist_items
-- This allows users to pin items to the top of their wishlist

-- Drop existing check constraint
ALTER TABLE public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_status_check;

-- Add new check constraint with 'pinned' status
ALTER TABLE public.wishlist_items ADD CONSTRAINT wishlist_items_status_check
  CHECK (status IN ('pending', 'claimed', 'pinned'));
