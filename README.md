# PunchCard LK

A multi-tenant digital loyalty card platform for Sri Lankan businesses. Customers collect stamps via QR code scanning, and businesses manage their loyalty programs through a web dashboard.

---

## Monorepo Structure

```
punchcardlkfinal/
├── apps/
│   ├── web/                  # Next.js 14 admin/staff/superadmin web app
│   └── customer/             # Expo React Native customer mobile app
├── packages/
│   ├── types/                # Shared TypeScript interfaces
│   ├── supabase/             # Supabase client factory + generated types
│   └── utils/                # Shared utilities (phone formatting, SMS abstraction)
├── supabase/
│   ├── config.toml           # Local Supabase config
│   ├── migrations/           # Versioned SQL migrations
│   └── functions/            # Deno edge function scaffolds
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Docker (for local Supabase)

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_ORG/punchcardlkfinal.git
cd punchcardlkfinal
pnpm install
```

### 2. Start Supabase locally

```bash
supabase start
```

This will print your local `SUPABASE_URL` and keys. Copy them.

### 3. Environment variables

```bash
# apps/web
cp apps/web/.env.local.example apps/web/.env.local
# Fill in values from `supabase start` output

# apps/customer
cp apps/customer/.env.local.example apps/customer/.env.local
# Fill in values from `supabase start` output
```

### 4. Apply migrations

```bash
supabase db push
# or for local dev:
supabase migration up
```

### 5. Run the web app

```bash
pnpm --filter @punchcard/web dev
# Open http://localhost:3000
```

### 6. Run the Expo app

```bash
pnpm --filter @punchcard/customer start
# Scan QR with Expo Go, or press `i` for iOS simulator, `a` for Android
```

---

## Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Monorepo | Turborepo | Fast incremental builds, excellent pnpm support |
| Package manager | pnpm | Strict dependency resolution, disk-efficient |
| Auth | Supabase Auth | Native phone OTP, email/password, JWT — no extra service |
| Database | Supabase (Postgres) | RLS for multi-tenancy, real-time support, hosted |
| Web framework | Next.js 14 (App Router) | SSR for admin, Server Actions, Vercel deployment |
| Mobile | Expo (SDK 51) | Cross-platform, Expo Router for file-based nav |
| Styling | Tailwind CSS | Fast, consistent, no CSS-in-JS overhead |

---

## SMS / OTP Provider

Supabase phone auth handles OTP delivery natively via its configured SMS provider (Twilio by default). The `packages/utils/src/notifications.ts` module provides an abstraction layer for **custom SMS routing** — useful when you need to send via a local Sri Lankan provider (Dialog, Mobitel) for better delivery rates or compliance.

### How to add a new SMS provider

1. Add env vars to `.env.local`:
   ```
   SMS_PROVIDER=dialog          # or: mobitel, twilio, custom
   SMS_API_KEY=your_key_here
   SMS_SENDER_ID=PUNCHCARD
   ```

2. Open `packages/utils/src/notifications.ts` and replace the `TODO` block in `sendSMS()` with the provider's API call.

3. For OTP flows, if you want to bypass Supabase's built-in OTP delivery:
   - Disable Supabase's SMS provider in the project dashboard
   - Create a Supabase Auth hook (database webhook) that calls the `send-invite-sms` edge function on phone signup
   - Your edge function calls `sendOTP()` from `@punchcard/utils`

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — deploys to Vercel prod + Supabase prod |
| `develop` | Integration branch — all feature branches merge here |
| `feature/*` | Individual features |
| `hotfix/*` | Production bug fixes |

Use `develop` as the default branch for PRs. Merge `develop → main` for production releases.

---

## Scripts

```bash
pnpm build           # Build all packages and apps
pnpm dev             # Start all apps in dev mode
pnpm type-check      # TypeScript check across the monorepo
pnpm lint            # Lint all packages
```
