/**
 * Utilities for generating fake data for development
 */

const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Sage",
  "River",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];

/**
 * Generate a random fake user for development
 *
 * Uses Gmail + addressing (user+tag@gmail.com) which:
 * - All go to the same inbox (dev+anything@gmail.com)
 * - Supabase treats them as unique users
 * - Works with local dev (enable_confirmations = false)
 *
 * Replace 'dev' with your actual email prefix if you want to receive emails
 */
export function generateFakeUser() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomNum = Math.floor(Math.random() * 10000);

  // Use Gmail + addressing for local testing
  // All emails go to dev@gmail.com but Supabase sees them as unique
  const email = `dev+${firstName.toLowerCase()}${randomNum}@gmail.com`;
  const password = `${firstName}${lastName}${randomNum}!`;
  const name = `${firstName} ${lastName}`;

  return {
    email,
    password,
    name,
  };
}

/**
 * Generate multiple fake users
 */
export function generateFakeUsers(count: number) {
  return Array.from({ length: count }, () => generateFakeUser());
}
