# Applying RLS Migration

## What This Does

This migration adds Row Level Security (RLS) policies to all tables, fixing the critical security vulnerability where any authenticated user could access all data.

## Before RLS (DANGEROUS ⚠️)

```javascript
// Any authenticated user could do this:
const { data } = await supabase.from('events').select('*')
// Returns ALL events, not just theirs

const { data } = await supabase.from('wishlists').select('*')
// Returns EVERYONE'S wishlists - spoils all Secret Santa gifts!
```

## After RLS (SECURE ✅)

```javascript
// Same query, but Postgres enforces security:
const { data } = await supabase.from('events').select('*')
// Returns ONLY events the user hosts or participates in

const { data } = await supabase.from('wishlists').select('*')
// Returns ONLY the user's own wishlist + assigned recipient's wishlist
```

---

## How to Apply

### Option 1: Supabase Dashboard (Recommended for testing)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_add_rls_policies.sql`
5. Paste and click **Run**
6. Verify with test queries (see below)

### Option 2: Supabase CLI (For local development)

```bash
# If using local Supabase
npx supabase db reset

# Or apply just the migration
npx supabase migration up
```

### Option 3: Production Deployment

```bash
# Push migration to production
npx supabase db push
```

---

## Testing RLS Policies

**⚠️ Important**: You cannot test RLS from the Supabase SQL Editor - it runs with admin privileges and bypasses RLS completely!

### Method 1: Use the Test Screen (Easiest)

A visual testing screen was created at `app/(app)/test-rls.tsx`.

**Testing workflow:**

1. Navigate to `/test-rls` in your app
2. **As User A:**
   - Run Test 1 (Create Event) → note the event ID
   - Run Test 2 (View Events) → should see your event
3. Sign out and create a new account **User B**
4. **As User B:**
   - Run Test 3 (View Event by ID) → ❌ should NOT see User A's event
   - Run Test 4 (Join Event with code TEST99) → ✅ joins the event
   - Run Test 3 again → ✅ NOW you should see it!
   - Run Test 5 (Try to update) → ❌ should fail (not the host)

**Expected behavior:**
- ✅ Users cannot see events they're not involved in
- ✅ Users CAN see events after joining as participant
- ✅ Only hosts can modify their events
- ✅ RLS blocks unauthorized access automatically

### Method 2: Manual Testing in Your App

Create two test accounts and verify:

```typescript
// User A: Create an event
const { data: event } = await events.create({
  name: 'Test Event',
  description: 'Testing RLS',
  exchange_date: '2024-12-25',
  join_code: 'ABC123'
}, userA.id);

console.log('Event ID:', event.id); // Copy this

// User B: Try to access User A's event
const { data } = await events.getById('PASTE_EVENT_ID_HERE');
console.log(data); // Should be null - RLS blocked it!

// User B: Join the event
await participants.join({
  event_id: 'PASTE_EVENT_ID_HERE',
  user_id: userB.id
});

// User B: Try again
const { data: event2 } = await events.getById('PASTE_EVENT_ID_HERE');
console.log(event2); // Now it works! ✅

// User B: Try to modify User A's event (should fail)
const { error } = await events.update(
  'PASTE_EVENT_ID_HERE',
  { name: 'Hacked!' },
  userB.id
);
console.log(error); // "Only the event host can update" ✅
```

### Method 3: Verify RLS is Enabled (SQL)

You can verify RLS is enabled, but not test actual security:

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All tables should show rowsecurity = true

-- List all policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- Should see all the policies from the migration
```

This confirms policies exist, but doesn't test they're working - use Method 1 or 2 for that!

---

## What Each Policy Does

### Events
- **View**: Users can see events they host OR participate in
- **Create**: Any user can create an event (becomes the host)
- **Update**: Only the host can update their event
- **Delete**: Only the host can delete their event

### Participants
- **View**: Users can see participants of events they're in
- **Create**: Users can join events (add themselves)
- **Delete**: Users can leave events (remove themselves)

### Wishlists
- **View**: Users can see their own wishlist + wishlist of person they're giving to
- **Create/Update/Delete**: Users can only manage their own wishlist

### Assignments
- **View**: Users can ONLY see their assignment (who they're giving to)
  - They CANNOT see who is giving to them (Secret Santa rules!)
- **Create/Update/Delete**: Only event hosts can manage assignments

---

## Important Notes

### 1. Your app code doesn't need to change!

The db-helpers you wrote will work exactly the same. The difference is:
- **Before**: Security checks in app code (easily bypassed)
- **After**: Security enforced by Postgres (cannot be bypassed)

### 2. Errors will change

Before RLS, bad queries would return data they shouldn't.
After RLS, bad queries will return empty results or permission errors.

**Example:**
```typescript
// Trying to access someone else's wishlist
const { data, error } = await wishlists.get(eventId, otherUserId);

// Before RLS: Returns their wishlist (BAD!)
// After RLS: Returns null with permission error (GOOD!)
```

### 3. Assignment creation needs special handling

The current policy allows hosts to create assignments, but this should really be done via a Supabase Edge Function to ensure:
- Fair random assignment
- No manual manipulation
- Atomic transactions

**TODO**: Create Edge Function for assignment generation

### 4. Performance impact

RLS policies add a small overhead (extra WHERE clauses), but:
- The indexes we created will mitigate this
- Security is worth the tiny performance cost
- Mobile apps won't notice the difference

---

## Rollback (If Needed)

If something breaks, you can temporarily disable RLS:

```sql
-- ONLY FOR DEBUGGING - DO NOT LEAVE DISABLED!
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
```

Then fix the issue and re-enable:

```sql
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
```

---

## Next Steps

1. ✅ Apply migration
2. ✅ Test in development
3. ✅ Verify app still works
4. 🔄 Create Edge Function for assignment generation (future improvement)
5. 🔄 Add tests for RLS policies (future improvement)
