// Re-export Supabase auth User type
export type { User } from "@supabase/supabase-js";

// Database types - these will match our Supabase tables
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  host_id: string;
  exchange_date: string;
  join_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
}

export interface Wishlist {
  id: string;
  event_id: string;
  user_id: string;
  items: string[];
  updated_at: string;
}

export interface Assignment {
  id: string;
  event_id: string;
  giver_id: string;
  receiver_id: string;
  created_at: string;
}
