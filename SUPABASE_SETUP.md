# Supabase Setup Guide for Life in Numbers

## Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Sign Up"** (or sign in if you have an account)
3. Sign up with GitHub or email
4. Create a new project:
   - **Project Name:** `life-in-numbers` (or any name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your location
   - Click **"Create new project"**
5. Wait for database initialization (~2 minutes)

---

## Step 2: Get API Keys

Once your project is ready:

1. Go to **Settings** → **API** (left sidebar)
2. Under "Project API keys", copy:
   - **`public` (anon key)** → This is `NEXT_PUBLIC_SUPABASE_KEY`
   - **`private` (service role key)** → This is `SUPABASE_SERVICE_ROLE_KEY`
   - **Project URL** → This is `NEXT_PUBLIC_SUPABASE_URL`
      
Example values look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (secret, don't share!)
```

---

## Step 3: Update Environment Variables

### Edit `.env.local`:
```bash
# Clerk keys (you should have these already)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase keys (ADD THESE)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Update `.env.example` too:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## Step 4: Initialize Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `database/001_initial_schema.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** (or Ctrl+Enter)
6. Wait for schema to be created (~30 seconds)

Expected output:
```
✓ Table "users" created
✓ Table "daily_stats" created
✓ Table "share_cards" created
... (10 tables total)
```

---

## Step 5: Verify Tables

1. Go to **Table Editor** (left sidebar)
2. You should see these 10 tables:
   - `users`
   - `daily_stats`
   - `share_cards`
   - `insights`
   - `tab_sessions`
   - `activity_log`
   - `session_history`
   - `stat_snapshots`
   - `user_preferences`
   - `auth_logs`

If all tables exist → ✅ Database setup complete!

---

## Step 6: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side (browser)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side (with admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

---

## Step 7: Update API Routes to Use Real Database

### Example: Update `/api/stats/daily`

**Before (mock):**
```typescript
return NextResponse.json({ success: true, stats: [] });
```

**After (real database):**
```typescript
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const payload = await request.json();

  // Insert into database
  const { data, error } = await supabaseAdmin
    .from('daily_stats')
    .insert({
      user_id: userId,
      date: payload.date,
      keyboard_presses: payload.keyboardPresses,
      tabs_opened: payload.tabsOpened,
      browsing_time_minutes: payload.browsingTimeMinutes,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
```

---

## Step 8: Set Up Clerk Webhook (Auto-sync Users)

When a user signs up in Clerk, auto-create them in Supabase:

### In Supabase:
1. Go to **SQL Editor**
2. Create a function to sync users:

```sql
-- Create function to insert user
CREATE OR REPLACE FUNCTION sync_user_from_clerk(user_id UUID, email TEXT, name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO users (id, email, name, created_at)
  VALUES (user_id, email, name, NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;
END;
$$ LANGUAGE plpgsql;
```

### In Clerk Dashboard:
1. Go to **Webhooks** (Settings → Webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://yourdomain.vercel.app/api/webhooks/clerk`
4. **Events to listen:** `user.created`, `user.updated`

### Create webhook handler at `/api/webhooks/clerk/route.ts`:

```typescript
import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { data } = payload;

  // Sync to Supabase
  const { error } = await supabaseAdmin.rpc('sync_user_from_clerk', {
    user_id: data.id,
    email: data.email_addresses[0].email_address,
    name: data.first_name + ' ' + (data.last_name || ''),
  });

  if (error) console.error('Webhook sync failed:', error);

  return NextResponse.json({ success: true });
}
```

---

## Step 9: Test the Connection

1. In your app, sign up with a new account
2. Check Supabase **Table Editor** → **users** table
3. Your account should appear automatically ✅

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Connection refused` | Check `NEXT_PUBLIC_SUPABASE_URL` is correct |
| `Invalid API key` | Verify you copied the full key (no spaces) |
| `Permission denied` | Use `supabaseAdmin` (service role key) not `supabase` (anon) |
| `Table doesn't exist` | Run schema SQL script again |
| `CORS error` | Supabase should have CORS enabled by default |

---

## Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_KEY` set (anon key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (service role, secret)
- [ ] `.env.local` file created
- [ ] Dev server restarted after env changes
- [ ] Database schema initialized
- [ ] Clerk webhook configured (if auto-sync needed)

---

## What's Next?

After Supabase is set up:

1. **Update API routes** to use real database queries
2. **Test data flow:** Extension → API → Database → Dashboard
3. **Deploy to Vercel** with production Supabase project
4. **Test in production**

---

## Quick Reference

```bash
# Test Supabase connection from CLI
npm install @supabase/supabase-js

# In a test file:
const { supabase } = require('./lib/supabase');
const { data, error } = await supabase.from('users').select();
console.log(data);
```

**Need help?** 
- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.io
