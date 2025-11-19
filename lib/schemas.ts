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
  id: z.string().uuid(),
  name: z.string().min(1),
  bio: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  background_url: z.string().url().nullable().optional(),
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
  avatar_url: z.string().url().optional(),
  background_url: z.string().url().optional(),
  phone: z.string().optional(),
});

/**
 * Schema for updating profile (all fields optional)
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
  background_url: z.string().url().optional(),
  phone: z.string().optional(),
});

// Infer TypeScript types from schemas
export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// ============================================================================
// Event schemas
// ============================================================================

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  host_id: z.string().uuid(),
  exchange_date: z.string(), // ISO date string from Postgres
  join_code: z.string(),
  is_active: z.boolean(),
  created_at: z.string(), // Postgres timestamp
  updated_at: z.string(), // Postgres timestamp
});

export const CreateEventSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  exchange_date: z.string().date(), // YYYY-MM-DD format
  join_code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]+$/), // 6 char alphanumeric
});

export const UpdateEventSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  exchange_date: z.string().date().optional(),
  is_active: z.boolean().optional(),
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;

// ============================================================================
// Participant schemas
// ============================================================================

export const ParticipantSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  joined_at: z.string(), // Postgres timestamp
});

export const CreateParticipantSchema = z.object({
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export type CreateParticipant = z.infer<typeof CreateParticipantSchema>;

// ============================================================================
// Wishlist schemas
// ============================================================================

/**
 * Individual wishlist item
 */
export const WishlistItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional(),
  price: z.number().positive().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const WishlistSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  items: z.array(WishlistItemSchema),
  updated_at: z.string(), // Postgres timestamp
});

export const CreateWishlistItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional(),
  price: z.number().positive().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type CreateWishlistItem = z.infer<typeof CreateWishlistItemSchema>;

// ============================================================================
// Assignment schemas
// ============================================================================

export const AssignmentSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  giver_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  created_at: z.string(), // Postgres timestamp
});

export const CreateAssignmentSchema = z.object({
  event_id: z.string().uuid(),
  giver_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;
