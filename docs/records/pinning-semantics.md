# Pinning Semantics

## Overview

Wishlist items can be "pinned" to keep them at the top of the list. This document explains how pinning works with the `order` and `status` fields.

## Data Model

Each wishlist item has two fields that affect display order:
- **`status`**: `null` (unpinned), `"pinned"`, or `"claimed"`
- **`order`**: numeric field (0, 1, 2, 3...)

## Sorting Strategy

Items are fetched with a **multi-key sort**:
```sql
ORDER BY (status = 'pinned') DESC, order ASC
```

This means:
1. **Primary sort**: Pinned items appear first
2. **Secondary sort**: Within each section (pinned/unpinned), items are sorted by their `order` value

**Important**: The `order` field represents the item's *natural position within its section*, not its absolute visual position in the list.

## Example Interaction

### Initial State (all unpinned)
```
Your Wishlist:
[0] Nintendo Switch     (status: null, order: 0)
[1] Zelda Game         (status: null, order: 1)
[2] Headphones         (status: null, order: 2)
[3] Coffee Maker       (status: null, order: 3)
[4] Book: Dune         (status: null, order: 4)
```

Query returns them sorted by `order ASC`: 0, 1, 2, 3, 4

---

### User pins "Headphones" (order: 2)

**What happens:**
1. API call: `togglePin(headphones.id)` → sets `status = 'pinned'`
2. **NO reorder needed!** The order field stays at 2
3. Refetch items

**New State:**
```
Database rows (order values unchanged):
- Nintendo Switch:  status=null,   order=0
- Zelda Game:      status=null,   order=1
- Headphones:      status=pinned, order=2  ← status changed, order unchanged
- Coffee Maker:    status=null,   order=3
- Book: Dune:      status=null,   order=4

Visual order (sorted by pinned DESC, order ASC):
[0] Headphones         (status: pinned, order: 2)  ← appears first!
[1] Nintendo Switch    (status: null, order: 0)
[2] Zelda Game        (status: null, order: 1)
[3] Coffee Maker      (status: null, order: 3)
[4] Book: Dune        (status: null, order: 4)
```

Headphones appears at the top even though its `order` is still 2!

---

### User pins "Book: Dune" (order: 4)

**What happens:**
1. API call: `togglePin(dune.id)` → sets `status = 'pinned'`
2. **NO reorder needed!** The order field stays at 4
3. Refetch items

**New State:**
```
Database rows:
- Nintendo Switch:  status=null,   order=0
- Zelda Game:      status=null,   order=1
- Headphones:      status=pinned, order=2
- Coffee Maker:    status=null,   order=3
- Book: Dune:      status=pinned, order=4  ← status changed

Visual order (sorted by pinned DESC, then order ASC):
[0] Headphones         (status: pinned, order: 2)  ← pinned items sorted by order
[1] Book: Dune         (status: pinned, order: 4)  ← pinned items sorted by order
[2] Nintendo Switch    (status: null, order: 0)    ← unpinned items sorted by order
[3] Zelda Game        (status: null, order: 1)
[4] Coffee Maker      (status: null, order: 3)
```

Notice: **Pinned section is sorted by original order** (2, 4), **Unpinned section is also sorted by original order** (0, 1, 3).

---

### User unpins "Headphones"

**What happens:**
1. API call: `togglePin(headphones.id)` → sets `status = null`
2. **NO reorder needed!** Order stays at 2
3. Refetch items

**New State:**
```
Database rows:
- Nintendo Switch:  status=null,   order=0
- Zelda Game:      status=null,   order=1
- Headphones:      status=null,   order=2  ← unpinned, order unchanged
- Coffee Maker:    status=null,   order=3
- Book: Dune:      status=pinned, order=4

Visual order:
[0] Book: Dune         (status: pinned, order: 4)
[1] Nintendo Switch    (status: null, order: 0)
[2] Zelda Game        (status: null, order: 1)
[3] Headphones        (status: null, order: 2)  ← back in unpinned section at its original position!
[4] Coffee Maker      (status: null, order: 3)
```

Headphones returns to its "natural" position in the unpinned section (between Zelda and Coffee Maker).

## Key Insights

- **Pinning/unpinning is just a status toggle** - no order changes needed
- Items "remember" their relative position via the `order` field
- The sort happens at query time, so pinned items naturally float to top
- When drag-to-reorder is implemented, it will update `order` values within sections

## Trade-offs

**Pros:**
- Simple toggle operation (just update status)
- No cascading order updates when pinning/unpinning
- Clear separation between pinned and unpinned sections
- Preserves relative ordering within sections

**Cons:**
- The `order` field doesn't strictly match visual position - it represents "natural ordering within section"
- Cross-section drag-and-drop will require special handling (future feature)
