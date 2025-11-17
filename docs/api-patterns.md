## Common Patterns

See data access [here](./data-access.md)

### Pattern: Optimistic UI Updates

```typescript
const handleUpdateEvent = async (eventId: string, updates: UpdateEvent) => {
  // Update UI immediately
  setEvent((prev) => ({ ...prev, ...updates }));

  // Sync to DB
  const { data, error } = await events.update(eventId, updates, userId);

  if (error) {
    // Rollback on error
    setEvent(prevEvent);
    alert("Failed to update event");
  } else {
    // Confirm with server data
    setEvent(data);
  }
};
```

### Pattern: Pagination

```typescript
const { data, error } = await supabase
  .from("events")
  .select("*")
  .range(0, 9) // First 10 items
  .order("created_at", { ascending: false });
```

### Pattern: Complex Joins (use generated types)

```typescript
import { Database } from "./database.types";

// When you need joins, Supabase generated types are helpful
const { data } = await supabase
  .from("events")
  .select(
    `
    *,
    host:users!events_host_id_fkey(*),
    participants(*)
  `
  )
  .eq("id", eventId);

// Then validate the parts you care about with Zod
const event = EventSchema.parse(data);
```

---
