# Supabase Setup

This directory contains the Supabase configuration for local development and production.

## Quick Start

```bash
# Start local Supabase
npm run db:start

# Reset database and regenerate types
npm run db:reset

# Generate TypeScript types from local schema
npm run db:types
```

## Important: URL Polyfill

**The `react-native-url-polyfill` import in `client.ts` is REQUIRED.**

React Native doesn't have native `URL` and `URLSearchParams` APIs. Without this polyfill:
- All Supabase queries will silently hang
- No error messages will appear
- The app will appear frozen

The polyfill is verified at runtime in `client.ts` to prevent this issue.

## Type Generation Workflow

After any schema change:

```bash
# Local development
npm run db:types

# After pushing to remote
npm run db:push  # automatically runs db:types:remote
```

The types are automatically regenerated when you run `npm run db:reset`.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `db:start` | Start local Supabase instance |
| `db:status` | Check local Supabase status |
| `db:seed` | Seed database with test data |
| `db:types` | Generate TypeScript types from local schema |
| `db:types:remote` | Generate TypeScript types from remote schema |
| `db:reset` | Reset database, seed, and regenerate types |
| `db:push` | Push migrations to remote and regenerate types |

## Files

- `client.ts` - Supabase client for React Native (with SecureStore)
- `client.web.ts` - Supabase client for web (with AsyncStorage)
- `database.types.ts` - Auto-generated TypeScript types
- `seed.ts` - Test data seeding script
- `migrations/` - Database migration files

## Troubleshooting

### Queries hang or timeout
- Ensure `react-native-url-polyfill/auto` is imported first in `client.ts`
- Check that the polyfill verification passes (no error on app load)

### Types are out of sync
- Run `npm run db:types` to regenerate from local schema
- Or `npm run db:reset` to reset everything and regenerate
