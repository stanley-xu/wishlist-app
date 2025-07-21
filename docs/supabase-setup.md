# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a name like "wishlist-app" 
4. Wait for project to be ready (2-3 minutes)

## 2. Get API Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOi...`)

## 3. Configure App

Replace the placeholders in `app.json`:

```json
"extra": {
  "supabaseUrl": "https://your-project.supabase.co",
  "supabaseAnonKey": "your-anon-key-here"
}
```

## 4. Set up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `lib/schema.sql`
3. Click "Run" to create all tables and policies

## 5. Test Connection

Once configured, you can test the connection by running the test in your app.

## 6. Enable Auth

1. Go to Authentication > Settings
2. Enable Email auth
3. Optionally configure other auth providers later

## Files Created

- `lib/database.ts` - Supabase client and types
- `lib/schema.sql` - Database schema 
- `lib/test-connection.ts` - Connection test
- `docs/supabase-setup.md` - This setup guide

## Next Steps

After completing this setup:
1. Test the connection works
2. Move to Session 1B (Authentication Core)

## Security Notes

- Never commit real API keys to git
- The anon key is safe for client-side use
- Row Level Security (RLS) is enabled for data protection