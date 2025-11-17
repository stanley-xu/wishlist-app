-- Fix RLS policy to allow users to create their own profile during signup
-- The existing policy only works for SELECT/UPDATE/DELETE, not INSERT

-- Drop the existing policy
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;

-- Create separate policies for different operations

-- Allow users to insert their own profile (during signup)
CREATE POLICY "Users can create own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);
