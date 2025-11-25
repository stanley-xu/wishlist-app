/**
 * Zod schemas for runtime validation + clean type inference
 *
 * Strategy:
 * 1. Define Zod schemas as source of truth for validation
 * 2. Infer TypeScript types from schemas
 * 3. Use for API boundaries, user input, and runtime checks
 * 4. Supabase generated types remain available for complex queries
 */

import { z } from "zod";

// ============================================================================
// Profile schemas (renamed from users -> profiles)
// ============================================================================

/**
 * Base profile schema - matches DB structure
 * Note: email is stored in auth.users, not in profiles table
 */
export const ProfileSchema = z.object({
  id: z.guid(),
  name: z.string().min(1),
  bio: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  created_at: z.string(), // Postgres timestamp, various formats accepted
  updated_at: z.string(), // Postgres timestamp, various formats accepted
});

/**
 * Schema for creating a new profile (during onboarding)
 */
export const CreateProfileSchema = z.object({
  // id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * Schema for updating profile (all fields optional)
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  phone: z.string().optional(),
});

// Infer TypeScript types from schemas
export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// ============================================================================
// Wishlist schemas
// ============================================================================

/**
 * Wishlist - container for items (can be personal or event-tied)
 */
export const WishlistSchema = z.object({
  id: z.guid(),
  user_id: z.guid(),
  event_id: z.guid().nullable(),
  name: z.string().min(1).max(100),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateWishlistSchema = z.object({
  name: z.string().min(1).max(100),
  event_id: z.uuid().optional(),
});

export const UpdateWishlistSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

/**
 * Individual wishlist item
 */
export const WishlistItemSchema = z.object({
  id: z.guid(),
  wishlist_id: z.guid(),
  name: z.string().min(1).max(200),
  url: z.url().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  order: z.number().int().nonnegative(),
  status: z.enum(["claimed", "pinned"]).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateWishlistItemSchema = z.object({
  name: z.string().min(1).max(200),
  url: z
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  description: z.string().max(1000).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const UpdateWishlistItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  url: z.url().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  order: z.number().int().nonnegative().optional(),
  status: z.enum(["claimed", "pinned"]).nullable().optional(),
});

export type Wishlist = z.infer<typeof WishlistSchema>;
export type CreateWishlist = z.infer<typeof CreateWishlistSchema>;
export type UpdateWishlist = z.infer<typeof UpdateWishlistSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type CreateWishlistItem = z.infer<typeof CreateWishlistItemSchema>;
export type UpdateWishlistItem = z.infer<typeof UpdateWishlistItemSchema>;

// ============================================================================
// Event schemas
// ============================================================================

export const EventSchema = z.object({
  id: z.guid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  host_id: z.guid(),
  exchange_date: z.string(), // ISO date string from Postgres
  join_code: z.string(),
  is_active: z.boolean(),
  created_at: z.string(), // Postgres timestamp
  updated_at: z.string(), // Postgres timestamp
});

export const CreateEventSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  exchange_date: z.iso.date(), // YYYY-MM-DD format
  join_code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]+$/), // 6 char alphanumeric
});

export const UpdateEventSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  exchange_date: z.iso.date().optional(),
  is_active: z.boolean().optional(),
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;

// ============================================================================
// Participant schemas
// ============================================================================

export const ParticipantSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  user_id: z.uuid(),
  joined_at: z.string(), // Postgres timestamp
});

export const CreateParticipantSchema = z.object({
  event_id: z.uuid(),
  user_id: z.uuid(),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export type CreateParticipant = z.infer<typeof CreateParticipantSchema>;

// ============================================================================
// Assignment schemas
// ============================================================================

export const AssignmentSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  giver_id: z.uuid(),
  receiver_id: z.uuid(),
  created_at: z.string(), // Postgres timestamp
});

export const CreateAssignmentSchema = z.object({
  event_id: z.uuid(),
  giver_id: z.uuid(),
  receiver_id: z.uuid(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;
