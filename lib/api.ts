/**
 * Type-safe database helpers using Zod + Supabase
 *
 * Pattern:
 * 1. Use Zod schemas for validation at API boundaries
 * 2. Supabase handles the DB interaction
 * 3. Validate responses before returning to app code
 */

import { supabase } from "@/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { z } from "zod";
import { isPostgresError, PostgresErrorCodes } from "../data/postgres-errors";
import {
  CreateEventSchema,
  CreateParticipantSchema,
  CreateProfile,
  EventSchema,
  ParticipantSchema,
  ProfileSchema,
  UpdateEventSchema,
  WishlistSchema,
  type CreateEvent,
  type CreateParticipant,
  type Event,
  type Participant,
  type Profile,
  type UpdateEvent,
  type Wishlist,
} from "./schemas";

// ============================================================================
// Generic helper types
// ============================================================================

type DbResult<T> = {
  data: T | null;
  error: Error | null;
};

type DbListResult<T> = {
  data: T[] | null;
  error: Error | null;
};

// ============================================================================
// Auth
// ============================================================================

export const auth = {
  /**
   * Get session
   * @returns The session or null if there is no session
   */
  async getSession(): Promise<DbResult<Session | null>> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      return { data: session, error: null };
    } catch (error) {
      console.error("Error fetching session:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<DbResult<User>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user");

      return { data: user, error: null };
    } catch (error) {
      console.error("Error fetching current user:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Sign up a new user with email and password
   */
  async signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<DbResult<Session>> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "giftful://welcome",
        },
      });

      if (error) throw error;

      // Note: this is to be expected if the user is not verified yet
      if (!session) {
        console.warn(`[Sign Up] check email for verification link`);
      }

      return { data: session, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<DbResult<Session>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("No session returned from sign in");
      }

      return { data: data.session, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<DbResult<boolean>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error("Error signing out:", error);
      return { data: null, error: error as Error };
    }
  },
};

// ============================================================================
// Profiles
// ============================================================================

export const profiles = {
  /**
   * Get user profile by ID
   */
  async getById(id: string): Promise<DbResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const validated = ProfileSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<DbResult<Profile>> {
    try {
      const { data: currentUser, error: getCurrentUserError } =
        await auth.getCurrentUser();

      if (!currentUser || getCurrentUserError) {
        return { data: null, error: getCurrentUserError };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;
      if (!data) {
        return { data: null, error: null };
      }

      const validated = ProfileSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get user profile by user ID
   */
  async getByUserId(userId: string): Promise<DbResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const validated = ProfileSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching user profile by user ID:", error);
      return { data: null, error: error as Error };
    }
  },

  async createProfile(data: CreateProfile): Promise<DbResult<Profile>> {
    try {
      console.debug("createProfile");
      const { data: currentUser, error: getCurrentUserError } =
        await auth.getCurrentUser();
      console.debug("createProfile", { currentUser, getCurrentUserError });

      if (!currentUser || getCurrentUserError) {
        throw new Error(
          `[createProfile] failed to retrieve current user: ${getCurrentUserError}`
        );
      }

      const { data: resultData, error } = await supabase
        .from("profiles")
        .insert({
          id: currentUser.id,
          name: data.name,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null,
          background_url: data.background_url || null,
        });

      if (error) throw error;

      return { data: resultData, error: null };
    } catch (error) {
      console.error("Error creating user profile:", error);
      return { data: null, error: error as Error };
    }
  },
};

// ============================================================================
// Events - Full CRUD example
// ============================================================================

export const events = {
  /**
   * Get all events for current user (either as host or participant)
   */
  async list(): Promise<DbListResult<Event>> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Validate response with Zod
      const validated = z.array(EventSchema).parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get a single event by ID
   */
  async getById(id: string): Promise<DbResult<Event>> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Validate response
      const validated = EventSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching event:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get event by join code
   */
  async getByJoinCode(joinCode: string): Promise<DbResult<Event>> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("join_code", joinCode.toUpperCase())
        .single();

      if (error) throw error;

      const validated = EventSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching event by join code:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Create a new event
   */
  async create(input: CreateEvent, hostId: string): Promise<DbResult<Event>> {
    try {
      // Validate input with Zod
      const validated = CreateEventSchema.parse(input);

      const { data, error } = await supabase
        .from("events")
        .insert({
          ...validated,
          host_id: hostId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Validate response
      const event = EventSchema.parse(data);
      return { data: event, error: null };
    } catch (error) {
      console.error("Error creating event:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Update an existing event
   *
   * Note: With RLS enabled, only the host can update their event.
   * The database will enforce this, so the manual check is redundant
   * but provides better error messages.
   */
  async update(
    id: string,
    input: UpdateEvent,
    userId: string
  ): Promise<DbResult<Event>> {
    try {
      // Validate input
      const validated = UpdateEventSchema.parse(input);

      // Update the event - RLS will block if user isn't the host
      const { data, error } = await supabase
        .from("events")
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        // Check if it's a permission error (user isn't the host)
        if (
          isPostgresError(error) &&
          error.code === PostgresErrorCodes.INSUFFICIENT_PRIVILEGE
        ) {
          throw new Error("Only the event host can update the event");
        }
        throw error;
      }

      const updated = EventSchema.parse(data);
      return { data: updated, error: null };
    } catch (error) {
      console.error("Error updating event:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Delete an event (soft delete by marking inactive)
   *
   * Note: With RLS enabled, only the host can delete their event.
   * The database will enforce this automatically. The userId parameter
   * is kept for API consistency but is not strictly needed.
   */
  async delete(id: string, _userId?: string): Promise<DbResult<boolean>> {
    try {
      // Soft delete - RLS will block if user isn't the host
      const { error } = await supabase
        .from("events")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        // Check if it's a permission error (user isn't the host)
        if (
          isPostgresError(error) &&
          error.code === PostgresErrorCodes.INSUFFICIENT_PRIVILEGE
        ) {
          throw new Error("Only the event host can delete the event");
        }
        throw error;
      }

      return { data: true, error: null };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { data: null, error: error as Error };
    }
  },
};

// ============================================================================
// Participants
// ============================================================================

export const participants = {
  /**
   * Join an event as a participant
   */
  async join(input: CreateParticipant): Promise<DbResult<Participant>> {
    try {
      const validated = CreateParticipantSchema.parse(input);

      const { data, error } = await supabase
        .from("participants")
        .insert(validated)
        .select()
        .single();

      if (error) throw error;

      const participant = ParticipantSchema.parse(data);
      return { data: participant, error: null };
    } catch (error) {
      console.error("Error joining event:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Get all participants for an event
   */
  async listByEvent(eventId: string): Promise<DbListResult<Participant>> {
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;

      const validated = z.array(ParticipantSchema).parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching participants:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Leave an event
   */
  async leave(eventId: string, userId: string): Promise<DbResult<boolean>> {
    try {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error("Error leaving event:", error);
      return { data: null, error: error as Error };
    }
  },
};

// ============================================================================
// Wishlists
// ============================================================================

export const wishlists = {
  /**
   * Get wishlist for a user in a specific event
   */
  async get(eventId: string, userId: string): Promise<DbResult<Wishlist>> {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      const validated = WishlistSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Update wishlist items (creates if doesn't exist)
   */
  async upsert(
    eventId: string,
    userId: string,
    items: Wishlist["items"]
  ): Promise<DbResult<Wishlist>> {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .upsert(
          {
            event_id: eventId,
            user_id: userId,
            items,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "event_id,user_id",
          }
        )
        .select()
        .single();

      if (error) throw error;

      const validated = WishlistSchema.parse(data);
      return { data: validated, error: null };
    } catch (error) {
      console.error("Error updating wishlist:", error);
      return { data: null, error: error as Error };
    }
  },
};
