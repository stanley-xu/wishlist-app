-- Migration: Make status nullable to allow unpinned items
-- This allows items to have no status (null) instead of "pending"

-- Drop the check constraint
ALTER TABLE public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_status_check;

-- Make status nullable
ALTER TABLE public.wishlist_items ALTER COLUMN status DROP NOT NULL;

-- Change default from 'pending' to NULL
ALTER TABLE public.wishlist_items ALTER COLUMN status SET DEFAULT NULL;

-- Add new check constraint allowing NULL
ALTER TABLE public.wishlist_items ADD CONSTRAINT wishlist_items_status_check
  CHECK (status IS NULL OR status IN ('claimed', 'pinned'));

-- Update existing 'pending' items to NULL
UPDATE public.wishlist_items SET status = NULL WHERE status = 'pending';
