# How env loading is done

## Local Development

```
npm start       # General dev server
npm run ios     # Launch iOS simulator
```

Uses: `.env.local` → `http://<your-ip-address>:54321`

Both simulator and physical devices use your local IP address. This simplifies configuration—no separate `:device` scripts needed.

The `precheck` script automatically updates your IP in `.env.local` when it changes.

## Production Testing

```
npm run start:prod   # Production environment
npm run ios:prod     # iOS with production
```

Uses: `.env.production` → `https://<supabase-url>.supabase.co`

## How It Works

- Each script sets `APP_VARIANT=local|production`
- `app.config.js` loads the corresponding `.env.*` file
- Your app connects to the right Supabase instance

---

## Decision Record: Consolidate to single local env file (2025-11-28)

**Context:** Previously had separate `.env.local` (using `localhost`) and `.env.device` (using IP address), with corresponding `:device` script variants.

**Decision:** Consolidated to just `.env.local` using the local IP address.

**Rationale:**

- Simulators work fine with IP addresses (not just `localhost`)
- Physical devices require IP addresses
- Using IP for both means one env file and simpler scripts
- IP rarely changes on home networks; `precheck` auto-updates it on each `npm start`

**Removed:**

- `.env.device` file
- `start:device`, `ios:device` scripts
- Standalone `update-ip` script (merged into `precheck.js`)
