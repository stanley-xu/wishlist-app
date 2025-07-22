import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enables automatic refresh of the token
    autoRefreshToken: true,
    persistSession: true,
  }
})

// Re-export Supabase auth User type
export type { User } from '@supabase/supabase-js'

// Database types - these will match our Supabase tables
export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  description: string
  host_id: string
  exchange_date: string
  join_code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  event_id: string
  user_id: string
  joined_at: string
}

export interface Wishlist {
  id: string
  event_id: string
  user_id: string
  items: string[]
  updated_at: string
}

export interface Assignment {
  id: string
  event_id: string
  giver_id: string
  receiver_id: string
  created_at: string
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is OK during setup
      console.error('Database connection error:', error)
      return false
    }
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}