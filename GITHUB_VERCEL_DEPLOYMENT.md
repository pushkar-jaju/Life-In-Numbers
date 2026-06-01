# GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web (Recommended)

1. **Go to:** https://github.com/new
2. **Fill in:**
   - Repository name: `life-in-numbers`
   - Description: `Auto-tracking digital activity statistics with privacy-first browser extension`
   - Choose: **Public** (needed for Chrome Web Store)
   - Check: ✅ "Add a README file"
   - Check: ✅ "Add .gitignore" → Select "Node"
   - Check: ✅ "Choose a license" → Select "MIT"
   - Click: **Create repository**

3. **You'll see:**
   ```
   Quick setup — if you've done this kind of thing before
   
   …or push an existing repository from the command line
   
   git remote add origin https://github.com/YOUR_USERNAME/life-in-numbers.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect Local Repo to GitHub

In PowerShell/Terminal:

```bash
cd 'c:\How cooked am I\life-in-numbers'

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/life-in-numbers.git

# Rename branch from master to main
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

### Step 3: Verify on GitHub

- Go to your repository: `https://github.com/YOUR_USERNAME/life-in-numbers`
- You should see:
  - ✅ All files uploaded
  - ✅ Commit history visible
  - ✅ README.md displayed

---

## Step 2: Deploy to Vercel

### Prerequisites
- GitHub repository created (from Step 1 above)
- Vercel account (free at https://vercel.com)

### Deployment Steps

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click **Sign Up**
   - Choose **Continue with GitHub**
   - Authorize Vercel to access your GitHub
   - Verify your email

2. **Create New Project:**
   - In Vercel dashboard, click **Add New** → **Project**
   - Find **life-in-numbers** repository
   - Click **Import**

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - Click **Deploy**

4. **Wait for Build:**
   - Vercel will compile your project (~2-3 minutes)
   - You'll see "Deployment successful!" when done
   - Copy your deployment URL: `https://your-domain.vercel.app`

5. **Add Environment Variables:**
   - Click **Settings** (top menu)
   - Go to **Environment Variables** (left sidebar)
   - Add each variable (copy from `.env.local`):

   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://asqvlbjjmxzatmlrfetn.supabase.co
   
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   Value: pk_test_Y3Jpc3Atc2F3Zmx5...
   
   Key: CLERK_SECRET_KEY
   Value: sk_test_mrJRCht8Yw6VmL7...
   
   Key: NEXT_PUBLIC_APP_URL
   Value: https://YOUR_VERCEL_DOMAIN.vercel.app
   ```

   - Click **Save**
   - Vercel will **auto-redeploy** (~1-2 minutes)

6. **Wait for Redeploy:**
   - Check the **Deployments** tab
   - When status is "Ready", your app is live!

7. **Test Deployment:**
   - Click your deployment URL
   - Should see home page
   - Try signing up with email/Google
   - Check Supabase `users` table for new user ✅

---

## Step 3: Update Clerk Webhook

Now that you have a production URL, update Clerk webhook:

1. **Go to Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Select your application

2. **Navigate to Webhooks:**
   - Settings (bottom left) → **Webhooks**
   - Find your webhook endpoint

3. **Edit Webhook URL:**
   - Change from: `http://localhost:3001/api/webhooks/clerk`
   - Change to: `https://YOUR_VERCEL_DOMAIN.vercel.app/api/webhooks/clerk`
   - Click **Save**

4. **Test Webhook:**
   - Go to your production URL
   - Sign up with new email
   - Wait 5 seconds
   - Check Supabase `users` table
   - New user should appear with auto-created `user_settings` ✅

---

## Step 4: Update Extension for Production

Update extension to sync with production API:

**File:** `extension/src/background.js`

**Find this line** (~line 23):
```javascript
const response = await fetch('http://localhost:3000/api/extension/sync', {
```

**Replace with:**
```javascript
const response = await fetch('https://YOUR_VERCEL_DOMAIN.vercel.app/api/extension/sync', {
```

**Push update to GitHub:**
```bash
git add extension/src/background.js
git commit -m "Update extension sync URL to production"
git push origin main
```

Vercel will **auto-redeploy** when you push.

---

## Step 5: Test Full Production Flow

### Test 1: Sign Up Flow
1. Visit `https://YOUR_VERCEL_DOMAIN.vercel.app`
2. Click "Get Started"                                                        
3. Sign up with new email
4. Verify in Supabase `users` table ✅

### Test 2: Dashboard
1. After sign-up, dashboard loads
2. See 4 stat cards
3. Sidebar navigation works
4. All pages accessible ✅

### Test 3: Share Feature
1. On dashboard, click "Generate Share Link"
2. Link copied to clipboard
3. Open link in incognito mode
4. See stats displayed
5. Check Supabase `share_cards` table ✅

### Test 4: Extension (Local)
1. In Chrome, load extension from `extension/` folder
2. Open popup
3. See current stats
4. Click various tabs and type
5. Stats increment
6. Wait for midnight or trigger manual sync
7. Check Supabase `daily_stats` table ✅

---

## Troubleshooting

### Build Failed
- Check **Deployments** tab for error logs
- Common issues:
  - Missing environment variable → Add to Vercel Settings
  - TypeScript error → Check `npm run build` locally
  - Module not found → Run `npm install` locally

### App Shows Blank Page
- Check browser console (F12) for errors
- Check Vercel logs: Deployments → Click failed deployment
- Verify all environment variables are set

### Sign Up Not Working
- Check Clerk is properly configured
- Verify CLERK keys in environment variables
- Check browser console for auth errors

### Webhook Not Syncing
- Verify webhook URL in Clerk is correct
- Check Vercel logs for webhook errors
- Test in Supabase by manually signing up

---

## Vercel Dashboard Features

After deployment, you have access to:
- **Deployments:** View build history and logs
- **Preview URLs:** Each git push creates a preview
- **Environment Variables:** Manage secrets
- **Settings:** Configure builds, domains, etc.
- **Analytics:** View traffic and performance
- **Monitoring:** Track errors and performance

---

## Commands Reference

```bash
# Check git remote
git remote -v

# Push changes to GitHub
git push origin main

# Pull latest from GitHub
git pull origin main

# View deployment logs locally
vercel logs

# Deploy from CLI (optional)
vercel --prod

# Set environment variable from CLI (optional)
vercel env add VARIABLE_NAME
```

---

## Next Steps After Deployment

1. ✅ **GitHub:** Code pushed
2. ✅ **Vercel:** App deployed and live
3. ✅ **Clerk:** Webhook updated
4. ⏳ **Extension:** Update sync URL and test
5. ⏳ **Extension Prep:** Create icons and prepare for Web Store
6. ⏳ **Final Testing:** Test full end-to-end flow
7. ⏳ **Chrome Store:** Submit extension

---

## Status Check

After completing this guide:

| Component | Status |
|-----------|--------|
| GitHub Repository | ✅ Created |
| Code Pushed | ✅ Done |
| Vercel Deployed | ✅ Live |
| Production URL | ✅ Working |
| Environment Variables | ✅ Configured |
| Clerk Webhook | ✅ Updated |
| Extension Updated | ⏳ Next |
| Production Testing | ⏳ Next |

**You're now live on production!** 🎉

---

## Important Notes

- **Vercel auto-deploys** when you push to main branch
- **Environment variables** don't require redeploy after first save
- **GitHub integration** keeps Vercel and GitHub in sync
- **Domain:** You get free `*.vercel.app` domain
- **Scaling:** Vercel handles load automatically (free tier sufficient)

---

## Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/YOUR_USERNAME/life-in-numbers
- Clerk Dashboard: https://dashboard.clerk.com
- Supabase Dashboard: https://app.supabase.com
- Your Live App: https://YOUR_VERCEL_DOMAIN.vercel.app

---

**Status:** Ready to deploy! Follow the steps above in order. 🚀
