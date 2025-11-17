/**
 * Seed script for local development
 * Uses the official Supabase Admin API to create test users
 *
 * Run with: npx tsx supabase/seed.ts
 */

import { createClient } from '@supabase/supabase-js';

// Local Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'dev@example.com',
    password: 'dev@example.com',
    name: 'Dev User',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'alice@example.com',
    password: 'alice@example.com',
    name: 'Alice',
  },
];

async function seed() {
  console.log('🌱 Seeding test users...\n');

  for (const user of testUsers) {
    console.log(`Creating user: ${user.email}`);

    // Create user with admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: user.password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        name: user.name,
      },
    });

    if (authError) {
      console.error(`  ❌ Error creating auth user: ${authError.message}`);
      continue;
    }

    console.log(`  ✅ Auth user created`);

    // Create profile in public.users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
      });

    if (profileError) {
      console.error(`  ❌ Error creating profile: ${profileError.message}`);
    } else {
      console.log(`  ✅ Profile created`);
    }

    console.log('');
  }

  console.log('✨ Seeding complete!\n');
  console.log('Test users:');
  testUsers.forEach(u => console.log(`  - ${u.email} / ${u.password}`));
}

seed().catch(console.error);
