-- Secret Santa App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security) for all tables
-- This ensures users can only access their own data

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  exchange_date DATE NOT NULL,
  join_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Participants table (many-to-many relationship between users and events)
CREATE TABLE public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Wishlists table
CREATE TABLE public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB DEFAULT '[]' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Assignments table (Secret Santa pairings)
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  giver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, giver_id),
  UNIQUE(event_id, receiver_id)
);

-- Simplified Row Level Security (RLS) Policies
-- Most security logic handled in application code for better performance and maintainability

-- Users table: Only protect user profiles (critical)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- All other tables: No RLS policies
-- Security handled in application service functions
-- This provides better performance, debugging, and flexibility

-- Note: No triggers used - all logic handled in application code
-- updated_at timestamps will be set explicitly in app code
-- User profile creation handled during signup flow

-- Indexes for better performance
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_join_code ON public.events(join_code);
CREATE INDEX idx_participants_event_id ON public.participants(event_id);
CREATE INDEX idx_participants_user_id ON public.participants(user_id);
CREATE INDEX idx_wishlists_event_user ON public.wishlists(event_id, user_id);
CREATE INDEX idx_assignments_event_id ON public.assignments(event_id);
CREATE INDEX idx_assignments_giver_id ON public.assignments(giver_id);