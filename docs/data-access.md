# Supabase + Zod Workflow Guide

## Overview

This project uses a hybrid approach:

- **Supabase** for database schema and infrastructure
- **Zod** for runtime validation and clean TypeScript types
- **Generated types** (`database.types.ts`) available but rarely used directly

---

## Quick Reference Commands

```bash
# Local development setup (first time)
npx supabase init
npx supabase start

# Apply schema changes locally
npx supabase db reset

# Generate types from local DB
npx supabase gen types typescript --local > supabase/database.types.ts

# Create a new migration
npx supabase migration new migration_name

# Push to production
npx supabase db push

# Generate types from production
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > supabase/database.types.ts
```

---

## Best Practices

1. **Always validate with Zod at API boundaries**

   - User input forms
   - API responses from Supabase
   - External API data

2. **Use db-helpers instead of raw Supabase calls**

   - Centralized error handling
   - Automatic validation
   - Easier to test and maintain

3. **Keep schemas.ts in sync with SQL**

   - Update Zod schemas whenever you change SQL
   - Use Zod's validation errors to catch mismatches early

4. **Generated types are a backup**

   - Useful for complex joins
   - Reference when Zod schemas get out of sync
   - But prefer Zod for day-to-day development

5. **Test migrations locally first**

   - Use `supabase db reset` to test locally
   - Only push to production after testing

6. **Use transactions for multi-step operations**
   ```typescript
   // Example: Create event + add host as participant
   const { data: event, error: eventError } = await supabase.rpc(
     "create_event_with_host",
     { event_data, host_id }
   );
   ```

---

## Workflow 1: Changing an Existing Table Schema

### Step 1: Update the SQL schema

Edit `supabase/schemas/schema.sql`:

```sql
-- Example: Add a new column to events table
ALTER TABLE public.events
ADD COLUMN budget NUMERIC;

-- Or modify existing column
ALTER TABLE public.events
ALTER COLUMN description TYPE TEXT;
```

### Step 2: Apply the migration

**Option A: Local development (if using local Supabase)**

```bash
supabase db reset  # Resets local DB with updated schema
```

**Option B: Production (push to hosted Supabase)**

```bash
# Create a migration file
supabase migration new add_budget_to_events

# Edit the generated file in supabase/migrations/
# Then push to remote
supabase db push
```

**Option C: Use Supabase Dashboard**

- Go to SQL Editor in Supabase Dashboard
- Run your ALTER TABLE command directly
- Supabase will auto-generate migration files

### Step 3: Regenerate TypeScript types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > supabase/database.types.ts
```

Or if using local Supabase:

```bash
npx supabase gen types typescript --local > supabase/database.types.ts
```

### Step 4: Update Zod schemas

Edit `data/schemas.ts` to match your new schema:

```typescript
export const EventSchema = z.object({
  // ... existing fields
  budget: z.number().positive().optional(), // Add new field
});

export const CreateEventSchema = z.object({
  // ... existing fields
  budget: z.number().positive().optional(),
});

export const UpdateEventSchema = z.object({
  // ... existing fields
  budget: z.number().positive().optional(),
});
```

### Step 5: Update db-helpers (if needed)

If you added new queries or the schema change affects existing queries, update `data/db-helpers.ts`:

```typescript
export const events = {
  // ... existing methods

  async updateBudget(id: string, budget: number): Promise<DbResult<Event>> {
    try {
      const { data, error } = await supabase
        .from("events")
        .update({ budget, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const validated = EventSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
};
```

**Done!** Your app now has type-safe access to the new schema.

---

## Workflow 2: Adding a New Table

### Example: Adding a "gifts" table for tracking purchased gifts

### Step 1: Add SQL schema

Edit `supabase/schemas/schema.sql`:

```sql
-- Gifts table
CREATE TABLE public.gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  item_id UUID NOT NULL,  -- References wishlist item ID
  purchased BOOLEAN DEFAULT false NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for performance
CREATE INDEX idx_gifts_assignment_id ON public.gifts(assignment_id);
```

### Step 2: Apply migration (same as Workflow 1, Step 2)

```bash
supabase db reset  # or push to production
```

### Step 3: Regenerate types

```bash
npx supabase gen types typescript --local > data/database.types.ts
```

### Step 4: Create Zod schemas

Add to `data/schemas.ts`:

```typescript
// ============================================================================
// Gift schemas
// ============================================================================

export const GiftSchema = z.object({
  id: z.string().uuid(),
  assignment_id: z.string().uuid(),
  item_id: z.string().uuid(),
  purchased: z.boolean(),
  notes: z.string().max(500).nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateGiftSchema = z.object({
  assignment_id: z.string().uuid(),
  item_id: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export const UpdateGiftSchema = z.object({
  purchased: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

export type Gift = z.infer<typeof GiftSchema>;
export type CreateGift = z.infer<typeof CreateGiftSchema>;
export type UpdateGift = z.infer<typeof UpdateGiftSchema>;
```

### Step 5: Create db-helpers

Add to `data/db-helpers.ts`:

```typescript
export const gifts = {
  /**
   * Get all gifts for an assignment
   */
  async listByAssignment(assignmentId: string): Promise<DbListResult<Gift>> {
    try {
      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .eq("assignment_id", assignmentId);

      if (error) throw error;

      const validated = z.array(GiftSchema).parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching gifts:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Mark gift as purchased
   */
  async create(input: CreateGift): Promise<DbResult<Gift>> {
    try {
      const validated = CreateGiftSchema.parse(input);

      const { data, error } = await supabase
        .from("gifts")
        .insert(validated)
        .select()
        .single();

      if (error) throw error;

      const gift = GiftSchema.parse(data);
      return { data: gift, error: null };
    } catch (error) {
      console.error("Error creating gift:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Update gift status
   */
  async update(id: string, input: UpdateGift): Promise<DbResult<Gift>> {
    try {
      const validated = UpdateGiftSchema.parse(input);

      const { data, error } = await supabase
        .from("gifts")
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const gift = GiftSchema.parse(data);
      return { data: gift, error: null };
    } catch (error) {
      console.error("Error updating gift:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Delete a gift record
   */
  async delete(id: string): Promise<DbResult<boolean>> {
    try {
      const { error } = await supabase.from("gifts").delete().eq("id", id);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error("Error deleting gift:", error);
      return { data: null, error: error as Error };
    }
  },
};
```

### Step 6: Use in your app

```typescript
// In your React component or hook
import { gifts } from "@/data/db-helpers";

export function GiftTracker({ assignmentId }: { assignmentId: string }) {
  const [giftList, setGiftList] = useState<Gift[]>([]);

  useEffect(() => {
    async function loadGifts() {
      const { data, error } = await gifts.listByAssignment(assignmentId);

      if (error) {
        console.error("Failed to load gifts:", error);
        return;
      }

      setGiftList(data || []);
    }

    loadGifts();
  }, [assignmentId]);

  const handleMarkPurchased = async (giftId: string) => {
    const { data, error } = await gifts.update(giftId, { purchased: true });

    if (error) {
      alert("Failed to mark as purchased");
      return;
    }

    // Update local state
    setGiftList((prev) =>
      prev.map((g) => (g.id === giftId ? { ...g, purchased: true } : g))
    );
  };

  // ... render UI
}
```

---

## Troubleshooting

**Types don't match after schema change?**

- Regenerate: `npx supabase gen types typescript --local > data/database.types.ts`
- Update Zod schemas in `data/schemas.ts`

**Zod validation failing?**

- Check schema.sql matches your Zod schema
- Look at the Zod error message - it tells you exactly what's wrong
- Use `.safeParse()` during debugging to see errors without throwing

**Local Supabase not running?**

- `npx supabase start`
- Check Docker is running

**Migration conflicts?**

- List migrations: `npx supabase migration list`
- Repair: `npx supabase migration repair`
