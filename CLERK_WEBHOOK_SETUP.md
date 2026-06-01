# Clerk Webhook Setup - Complete Guide

## Problem: Users Not Being Synced to Supabase

When users sign up in Clerk, they need to be automatically synced to Supabase. This requires:
1. ✅ Webhook code (already implemented)
2. ✅ Webhook signing secret in environment (just added)
3. ⏳ Clerk webhook configuration (needs setup)

---

## Step 1: Configure Webhook in Clerk Dashboard

### Go to Clerk Webhooks
1. **Open:** https://dashboard.clerk.com
2. **Select your application** (top right)
3. **Go to:** Settings → **Webhooks** (left sidebar)

### You Should See
- Existing webhook endpoint(s)
- Button: **+ Create** or **+ Add Endpoint**

### Create New Webhook Endpoint

**Click: "+ Create" or "+ Add Endpoint"**

Fill in:
```
Endpoint URL: http://localhost:3000/api/webhooks/clerk
```

**For events, select:**
- ✅ user.created
- ✅ user.updated
- (Ignore other events)

**Click: Create / Save**

### Get Your Signing Secret

After creating the endpoint, you should see:
```
Signing Secret: whsec_NGGOGqHVwIZ09pqC6oHGa0lYcKJ2Ve5d
```

**Copy this value** - it's already in your `.env.local`

---

## Step 2: Test Webhook Locally

### Start Dev Server
```bash
npm run dev
```

### Sign Up with Test Account

1. Go to http://localhost:3000
2. Click **"Get Started"** or sign-in link
3. Sign up with new email (e.g., test@example.com)
4. Clerk saves the user
5. **Check terminal output** for:
   ```
   [Webhook] User synced: user_xxxxx
   ```

### Verify in Supabase

1. **Open:** https://app.supabase.com
2. **Select your project:** `life-in-numbers`
3. **Go to:** SQL Editor or Table View
4. **Query users table:**
   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```

**Expected:** User row appears ✅

### Check user_settings

```sql
SELECT * FROM user_settings WHERE user_id = 'user_xxxxx';
```

**Expected:** Settings row created ✅

---

## Step 3: Check Webhook Logs

### In Clerk Dashboard

1. **Go to:** Settings → Webhooks
2. **Click on your endpoint**
3. **View:** Logs/Recent Attempts
4. **You should see:**
   - ✅ `user.created` event
   - ✅ HTTP 200 response
   - ✅ Webhook success message

### If You See Errors

**401 Unauthorized:**
- Webhook secret is wrong
- Check `.env.local` has `CLERK_WEBHOOK_SECRET=whsec_...`
- Restart dev server

**500 Internal Server:**
- Check terminal logs
- Verify Supabase credentials
- Check database schema (users table exists)

---

## Step 4: Update for Production (After Vercel Deploy)

### 1. Get Your Production URL
After deploying to Vercel, you'll have:
```
https://your-app.vercel.app
```

### 2. Update Webhook Endpoint in Clerk

1. **In Clerk Dashboard:** Settings → Webhooks
2. **Edit your webhook endpoint**
3. **Change URL to:**
   ```
   https://your-app.vercel.app/api/webhooks/clerk
   ```
4. **Save**

### 3. Add Webhook Secret to Vercel

1. **Go to:** Vercel Dashboard
2. **Click:** Settings → Environment Variables
3. **Add:**
   ```
   CLERK_WEBHOOK_SECRET=whsec_NGGOGqHVwIZ09pqC6oHGa0lYcKJ2Ve5d
   ```
4. **Save**
5. **Vercel auto-redeployes**

### 4. Test Production Webhook

1. Go to production URL
2. Sign up with new email
3. Check Clerk webhook logs (should show 200)
4. Check Supabase - user should appear

---

## Troubleshooting

### Problem: User not appearing in Supabase

**Checklist:**
- [ ] Webhook endpoint configured in Clerk? (Check Settings → Webhooks)
- [ ] Endpoint URL correct? (Should be your app URL + `/api/webhooks/clerk`)
- [ ] Events selected? (user.created + user.updated)
- [ ] Webhook secret in `.env.local`? (CLERK_WEBHOOK_SECRET=whsec_...)
- [ ] Dev server restarted after adding secret?
- [ ] Supabase credentials valid? (Check `.env.local`)
- [ ] users table exists in Supabase?
- [ ] Clerk webhook logs show 200 status?

**Try:**
1. Restart dev server
2. Clear .next cache: `rm -r .next`
3. Sign up with different email
4. Check Clerk webhook logs
5. Check terminal console output

### Problem: Webhook shows 401 Unauthorized

**Cause:** Wrong webhook signing secret

**Fix:**
1. Get correct secret from Clerk Dashboard
2. Update `.env.local`: `CLERK_WEBHOOK_SECRET=whsec_...`
3. Restart dev server
4. Test again

### Problem: Webhook shows 500 Internal Server Error

**Cause:** Database error or missing credentials

**Fix:**
1. Check terminal output for exact error
2. Verify Supabase credentials in `.env.local`
3. Test Supabase connection: `supabase status`
4. Check users table exists: `SELECT * FROM users LIMIT 1;`

### Problem: User created in Clerk but not user_settings

**Cause:** Settings table has issue

**Fix:**
1. Check user was created in Supabase (first step)
2. Verify `user_settings` table schema
3. Check webhook logs for settings creation error
4. May need to manually create settings row

---

## Verification Checklist

| Item | Status | How to Check |
|------|--------|--------------|
| Webhook endpoint configured | ✅ | Clerk Dashboard → Settings → Webhooks |
| Endpoint URL correct | ✅ | Should be `http://localhost:3000/api/webhooks/clerk` |
| user.created event selected | ✅ | Webhook settings → Events |
| user.updated event selected | ✅ | Webhook settings → Events |
| Webhook secret in .env.local | ✅ | Check `.env.local` has `CLERK_WEBHOOK_SECRET=...` |
| Dev server running | ✅ | `npm run dev` running? |
| Supabase connection works | ✅ | Supabase dashboard loads? |
| Users table exists | ✅ | Query in Supabase SQL editor |
| user_settings table exists | ✅ | Query in Supabase SQL editor |

---

## Testing Checklist

### Local Testing (Development)

- [ ] Dev server running: `npm run dev`
- [ ] Webhook configured in Clerk
- [ ] Sign up with new email
- [ ] Check terminal for `[Webhook] User synced`
- [ ] Query Supabase: User appears in `users` table
- [ ] Query Supabase: Row created in `user_settings` table

### Production Testing (After Vercel Deploy)

- [ ] Production URL updated in Clerk webhook
- [ ] Webhook secret added to Vercel env vars
- [ ] Go to production URL
- [ ] Sign up with new email
- [ ] Check Clerk webhook logs (200 status)
- [ ] Query Supabase: User appears in `users` table
- [ ] Query Supabase: Row created in `user_settings` table

---

## How It Works

### Sequence Diagram

```
1. User signs up on website
   ↓
2. Clerk processes signup
   ↓
3. Clerk fires user.created webhook
   ↓
4. POST to /api/webhooks/clerk
   ↓
5. Webhook verifies signature (svix library)
   ↓
6. Extract user data from Clerk
   ↓
7. Upsert to Supabase users table
   ↓
8. Create user_settings (if new user)
   ↓
9. Return 200 OK
```

### What Gets Synced

**From Clerk to Supabase `users` table:**
- `id` (Clerk user ID)
- `clerk_id` (Same as ID)
- `email` (Primary email)
- `first_name` (From profile)
- `last_name` (From profile)
- `avatar_url` (Profile picture)
- `updated_at` (Sync timestamp)

**Auto-created in `user_settings`:**
- `user_id` → Links to users table
- `tracking_enabled` → TRUE
- `dark_mode` → TRUE
- `notifications_enabled` → TRUE
- `keyboard_tracking` → TRUE
- `tab_tracking` → TRUE
- `browsing_time_tracking` → TRUE
- `privacy_mode` → FALSE
- `data_retention_days` → 365

---

## Webhook Secret Reference

Your webhook secret (for reference):
```
whsec_NGGOGqHVwIZ09pqC6oHGa0lYcKJ2Ve5d
```

This is also in your `.env.local` as:
```
CLERK_WEBHOOK_SECRET=whsec_NGGOGqHVwIZ09pqC6oHGa0lYcKJ2Ve5d
```

---

## Next Steps

1. ✅ **Webhook code:** Already implemented and verified
2. ✅ **Signing secret:** Added to `.env.local`
3. ⏳ **Configure in Clerk:** Use steps above
4. ⏳ **Test locally:** Sign up and verify sync
5. ⏳ **Deploy to Vercel:** Then update webhook URL for production
6. ⏳ **Test in production:** Verify webhook fires

---

**Status:** Ready to configure webhook in Clerk! Follow the steps above. 🚀
