# Environment Configuration Guide

## Setup Instructions

### 1. Copy .env.example to .env.local
```bash
cp .env.example .env.local
```

### 2. Fill in Required Values

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anonymous key from Settings > API
4. Paste into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Get service role key from the same location and paste into `SUPABASE_SERVICE_ROLE_KEY`

#### Clerk Setup
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Go to API Keys
4. Copy the publishable key and paste into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Copy the secret key and paste into `CLERK_SECRET_KEY`

#### Groq Setup
1. Go to [console.groq.com](https://console.groq.com)
2. Create an API key
3. Paste into `NEXT_PUBLIC_GROQ_API_KEY`

### 3. Local Development
- `NODE_ENV=development` is set by default
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### 4. Environment Variables Types

**Public (NEXT_PUBLIC_):**
- Visible in browser (safe for public keys and URLs)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- NEXT_PUBLIC_GROQ_API_KEY
- NEXT_PUBLIC_CLERK_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
- NEXT_PUBLIC_APP_URL

**Private (Server-only):**
- Never exposed to browser
- SUPABASE_SERVICE_ROLE_KEY
- CLERK_SECRET_KEY
- DATABASE_URL

### 5. Verification

Run the dev server to verify setup:
```bash
npm run dev
```

If environment variables are missing, you'll see errors in the console.

## Notes
- Never commit .env.local to git
- Always use .env.example as reference
- For production, set environment variables via deployment platform (Vercel, etc.)
