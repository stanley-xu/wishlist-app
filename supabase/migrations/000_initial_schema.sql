-- Secret Santa App Database Schema
-- Initial schema for all tables

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

-- Enable RLS on users table and add basic policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Indexes for better performance
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_join_code ON public.events(join_code);
CREATE INDEX idx_participants_event_id ON public.participants(event_id);
CREATE INDEX idx_participants_user_id ON public.participants(user_id);
CREATE INDEX idx_wishlists_event_user ON public.wishlists(event_id, user_id);
CREATE INDEX idx_assignments_event_id ON public.assignments(event_id);
CREATE INDEX idx_assignments_giver_id ON public.assignments(giver_id);
