# Add drag-to-reorder functionality for wishlist items

## Feature Request: Drag-to-Reorder Wishlist Items

### Overview
Add the ability to manually reorder wishlist items by dragging them within the list.

### Context
This feature was descoped during the initial wishlist item refinement to keep the implementation simple and maintainable. Currently, users can reorder items indirectly by pinning/unpinning them, but manual reordering would provide more control.

### Requirements
- [ ] Long-press on a wishlist item to initiate drag mode
- [ ] Visual feedback during drag (item follows finger, other items shift)
- [ ] Drop item at new position to reorder
- [ ] **Special behavior for pinned items:**
  - If a pinned item is dragged below the lowest pinned item, it becomes unpinned
  - Unpinned items cannot be dragged into the pinned section (or they automatically become pinned)
- [ ] Optimistic UI update with error handling
- [ ] Update `order` column in database via `wishlistItems.reorder` API
- [ ] On error, revert to previous list order and display error message

### Technical Considerations

**Why this was descoped:**
This feature requires multiple moving pieces that make it difficult to reason about:
- Long-press detection + drag tracking
- Animating item positions as drag happens
- Calculating drop zones between items
- Handling pinned/unpinned boundary logic
- Managing gesture conflicts with swipe left/right
- Edge cases around fast drags, boundary conditions, etc.

Following the principle of Ockham's razor and preferring simplicity/understandability, this was left for future consideration.

**Implementation approach:**
- Use `react-native-gesture-handler` for long-press and drag detection
- Use `react-native-reanimated` for smooth drag animations
- Be careful about gesture conflicts with existing swipe gestures (may need simultaneous handlers)
- Keep implementation simple to maintain readability
- **If the implementation becomes too complex, consider simpler alternatives:**
  - Up/down arrow buttons on each item
  - Drag handle icon that's separate from the main item tap area
  - Reorder-only mode that user enters explicitly

### Related Files
- `components/WishlistItem/WishlistItem.tsx` - Item component with gestures
- `app/(app)/profile/index.tsx` - Profile screen with wishlist
- `lib/api.ts` - `wishlistItems.reorder()` API method (already exists)

### Priority
Nice-to-have. Current pin/unpin functionality provides basic reordering capability (pinned items move to top).

### Labels
- `enhancement`
- `ui/ux`
