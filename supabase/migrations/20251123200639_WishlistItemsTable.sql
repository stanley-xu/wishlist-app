-- Migration: Normalize wishlists - add wishlist_items table, make event_id nullable
-- This allows users to have personal wishlists not tied to events

-- 1. Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  "order" INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'claimed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Migrate existing JSONB items to wishlist_items table
INSERT INTO public.wishlist_items (wishlist_id, name, "order", created_at, updated_at)
SELECT
  w.id as wishlist_id,
  item::text as name,
  ordinality - 1 as "order",
  NOW() as created_at,
  NOW() as updated_at
FROM public.wishlists w,
LATERAL jsonb_array_elements_text(w.items) WITH ORDINALITY as item;

-- 3. Drop the unique constraint on (event_id, user_id) since event_id will be nullable
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_event_id_user_id_key;

-- 4. Add name column to wishlists (for identifying personal wishlists)
ALTER TABLE public.wishlists ADD COLUMN name TEXT;

-- 5. Set default name for existing wishlists based on event
UPDATE public.wishlists w
SET name = COALESCE(
  (SELECT e.name || ' Wishlist' FROM public.events e WHERE e.id = w.event_id),
  'My Wishlist'
);

-- 6. Make name NOT NULL after setting defaults
ALTER TABLE public.wishlists ALTER COLUMN name SET NOT NULL;

-- 7. Make event_id nullable
ALTER TABLE public.wishlists ALTER COLUMN event_id DROP NOT NULL;

-- 8. Add created_at to wishlists (was missing)
ALTER TABLE public.wishlists ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- 9. Drop the old items JSONB column
ALTER TABLE public.wishlists DROP COLUMN items;

-- 10. Add indexes for wishlist_items
CREATE INDEX idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_order ON public.wishlist_items(wishlist_id, "order");

-- 11. Enable RLS on wishlist_items
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- 12. RLS policies for wishlist_items
-- Users can manage items in their own wishlists
CREATE POLICY "Users can manage own wishlist items" ON public.wishlist_items
  FOR ALL USING (
    wishlist_id IN (
      SELECT id FROM public.wishlists WHERE user_id = auth.uid()
    )
  );

-- Users can view wishlist items for wishlists they have access to
-- (their own, or event wishlists they're participating in)
CREATE POLICY "Users can view accessible wishlist items" ON public.wishlist_items
  FOR SELECT USING (
    wishlist_id IN (
      SELECT w.id FROM public.wishlists w
      WHERE w.user_id = auth.uid()
      OR (
        w.event_id IS NOT NULL
        AND w.event_id IN (
          SELECT event_id FROM public.participants WHERE user_id = auth.uid()
        )
      )
    )
  );