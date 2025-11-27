# RLS Data Access Patterns

**Date**: 2025-11-27
**Status**: Active

## Overview

This document describes the Row Level Security (RLS) policies applied to our Supabase database tables and the reasoning behind them.

## Design Principle: Public Read, Owner Write

All tables follow a **least privilege** pattern:
- **SELECT (read)**: Public access - anyone can read
- **INSERT/UPDATE/DELETE (write)**: Owner-only - only the resource owner can modify

### Why Public Read?

1. **React Native Security**: In a native mobile app, the Supabase client is bundled in the app binary. To exploit this, an attacker would need to:
   - Jailbreak their device
   - Decompile the app binary
   - Reverse engineer bundled JavaScript
   - Extract the Supabase anon key
   - Write custom client code to query directly

   This is an extremely high barrier for an MVP wishlist app.

2. **Application-Layer Authorization**: We validate access at the route level (e.g., share token validation in `/profile/[userId]`), not at the database level. Once access is granted, the data needs to be readable.

3. **Data Sensitivity**: Wishlist data is not highly sensitive (no PII, financial data, or private messages). The worst case is someone sees another person's wishlist - which is exactly what the share feature enables.

## Current RLS Policies

### Profiles (`public.profiles`)

```sql
-- Read: Anyone can view profiles
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Write: Only owner can modify
CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);
```

**Reasoning**: Profiles must be viewable when wishlists are shared. There's no sensitive data in profiles (just name, bio, avatar).

---

### Wishlists (`public.wishlists`)

```sql
-- Read: Anyone can view wishlists
CREATE POLICY "Users can view all wishlists"
  ON public.wishlists FOR SELECT
  USING (true);

-- Write: Only owner can modify
CREATE POLICY "Users can manage own wishlist"
  ON public.wishlists
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Reasoning**: Wishlists are the core shareable resource. Authorization is handled via share tokens at the application layer (in `/profile/[userId].tsx`).

---

### Wishlist Items (`public.wishlist_items`)

```sql
-- Read: Anyone can view items
CREATE POLICY "Anyone can view wishlist items"
  ON public.wishlist_items FOR SELECT
  USING (true);

-- Write: Only owner can modify items in their wishlists
CREATE POLICY "Users can manage own wishlist items"
  ON public.wishlist_items
  USING (
    wishlist_id IN (
      SELECT id FROM public.wishlists WHERE user_id = auth.uid()
    )
  );
```

**Reasoning**: Items follow the same pattern as wishlists. The `/profile/[userId]` route is read-only, so write restrictions prevent unauthorized modifications.

---

### Wishlist Permissions (`public.wishlist_permissions`)

```sql
-- Read: Anyone can read share tokens (needed for validation)
CREATE POLICY "Anyone can read share tokens for validation"
  ON public.wishlist_permissions FOR SELECT
  USING (true);

-- Write: Only owner can create/update tokens
CREATE POLICY "Users can create share tokens for their wishlist"
  ON public.wishlist_permissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own share tokens"
  ON public.wishlist_permissions FOR UPDATE
  USING (auth.uid() = user_id);
```

**Reasoning**: Share tokens must be publicly readable for validation to work. When User 1 validates User 2's token, they need to query the `wishlist_permissions` table. The tokens themselves are UUIDs (not secrets), and knowing a token exists doesn't grant access without the actual token value.

---

## Application-Layer Authorization

While RLS policies are permissive (public read), **authorization happens in the application layer**:

### Share Token Validation Flow

1. User 2 generates a share token via `/profile/index.tsx`
2. User 2 shares URL: `giftful.io/profile/{user-2-id}?share={token}`
3. User 1 clicks link → navigates to `/profile/[userId].tsx`
4. Route validates access:
   ```typescript
   if (currentUser.id === userId) {
     userHasAccess = true; // Own profile
   } else if (shareToken) {
     const { data: isValid } = await shareTokens.validateFor(userId, shareToken);
     userHasAccess = Boolean(isValid); // Valid token
   }
   ```
5. If `userHasAccess === false`, show "This wishlist is private" message
6. If `userHasAccess === true`, fetch and display profile/wishlist data

**Key point**: The route controls what's displayed, not RLS. RLS just ensures write operations are protected.

---

## Inspecting Current RLS Policies

### Via CLI

```bash
# View all active RLS policies
npx supabase db dump --linked --schema public | grep "CREATE POLICY"

# More readable format
npx supabase db dump --linked --schema public | grep -E "(CREATE POLICY|ALTER TABLE.*ENABLE ROW LEVEL)"
```

### Via Supabase Dashboard

Navigate to: **Database → Policies**

Shows all tables and their policies in a visual interface.

---

## Future Considerations

### When Secret Santa is Implemented

Currently using public read for MVP development. When Secret Santa matching is added (Issue #7), we may want to:

1. **Restrict wishlist reads** to only matched pairs:
   ```sql
   CREATE POLICY "Users can view assigned wishlists"
     ON public.wishlists FOR SELECT
     USING (
       user_id = auth.uid() OR  -- Own wishlist
       user_id IN (  -- Assigned recipient
         SELECT receiver_id FROM assignments WHERE giver_id = auth.uid()
       )
     );
   ```

2. **Keep share tokens** for additional sharing beyond assignments

3. **Consider separating concerns**: Assignment-based access vs. share-based access

---

## Migration History

Key migrations that established this pattern:

- `20251126005130_AllowPublicWishlistViewing.sql` - Public wishlist reads
- `20251127000000_FixShareTokenRLS.sql` - Public share token reads
- `20251127000001_AllowPublicProfileReads.sql` - Public profile reads
- `20251127000002_AllowPublicWishlistItemReads.sql` - Public item reads

---

## Related Documentation

- [Pinning Semantics](./pinning-semantics.md) - Wishlist item ordering
- [Share Token Implementation](../project.md#share-tokens) - Share token design decisions
