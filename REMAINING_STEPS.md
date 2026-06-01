# Remaining Steps to Launch - Roadmap

## Summary
✅ **27/32 MVP tasks complete** (84%)
⏳ **5 tasks remaining** before full launch

---

## Remaining Tasks (In Priority Order)

### 1️⃣ SUPABASE DEPLOYMENT ✅ ALREADY DONE
**Status:** Complete
- [x] Created Supabase project
- [x] Ran database schema (001_initial_schema.sql)
- [x] All 10 tables initialized
- [x] Credentials in `.env.local`

**What's next:** Nothing - move to step 2

---

### 2️⃣ GITHUB & GIT SETUP (PREREQUISITE FOR VERCEL)
**Estimated time:** 10 minutes

**Steps:**

1. **Initialize Git** (if not already done):
   ```bash
   cd 'c:\How cooked am I\life-in-numbers'
   git init
   git config user.name "Your Name"
   git config user.email "your@email.com"
   git add .
   git commit -m "Initial commit: Life in Numbers MVP complete"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `life-in-numbers`
   - Description: "Auto-tracking digital activity statistics"
   - Choose "Public" (for Chrome Web Store later)
   - Click "Create Repository"

3. **Push to GitHub:**
   - Copy the commands from GitHub
   - Run in your terminal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/life-in-numbers.git
   git push -u origin main
   ```

**Verification:** ✅ Code visible on GitHub

---

### 3️⃣ VERCEL DEPLOYMENT (TASK: vercel-deployment)
**Estimated time:** 15 minutes
**Priority:** HIGH - Unblocks everything else

**Steps:**

1. **Create Vercel Account:**
   - Go to https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize and sign up

2. **Deploy Project:**
   - In Vercel dashboard, click **"Add New"** → **"Project"**
   - Select GitHub repository: `life-in-numbers`
   - Click **"Import"**
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Click **"Deploy"** (wait 2-3 minutes)

3. **Add Environment Variables:**
   - After deployment, go to **Settings** → **Environment Variables**
   - Add these (copy from `.env.local`):
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://asqvlbjjmxzatmlrfetn.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
     ```
   - Click **"Save"**
   - Vercel will **auto-redeploy** (~2 min)

4. **Test Deployment:**
   - Visit `https://your-domain.vercel.app`
   - Sign up with test account
   - Check Supabase `users` table
   - User should appear ✅

5. **Update Clerk Webhook URL:**
   - Go to Clerk Dashboard → **Webhooks**
   - Edit webhook endpoint
   - Change URL to: `https://your-domain.vercel.app/api/webhooks/clerk`
   - Save

6. **Update Extension Sync URL:**
   - Edit `extension/src/background.js`
   - Change:
     ```javascript
     const response = await fetch(
       'https://your-domain.vercel.app/api/extension/sync',
       ...
     );
     ```

**Verification:** ✅ App runs on Vercel domain with production credentials

---

### 4️⃣ EXTENSION SUBMISSION PREP (TASK: extension-submission-prep)
**Estimated time:** 30 minutes
**Priority:** MEDIUM

**What needs to be done:**

1. **Create Extension Icons:**
   - Create 3 PNG files:
     - `extension/icons/16.png` (16x16)
     - `extension/icons/48.png` (48x48)
     - `extension/icons/128.png` (128x128)
   - Use a simple icon/logo design
   - Size requirements: Exactly 16×16, 48×48, 128×128 pixels
   - Format: PNG with transparency

   **Options:**
   - Use online tool: https://www.iloveimg.com/icon-maker
   - Design tool: Figma (free)
   - AI tool: OpenAI DALL-E

2. **Update manifest.json:**
   ```json
   {
     "name": "Life in Numbers",
     "version": "1.0.0",
     "description": "Automatically track your keyboard activity, tab usage, and browsing patterns.",
     "icons": {
       "16": "icons/16.png",
       "48": "icons/48.png",
       "128": "icons/128.png"
     },
     ...
   }
   ```

3. **Create Privacy Policy:**
   - Create `PRIVACY_POLICY.md` in project root
   - Include:
     - What data is collected (keyboard presses, tab count, browsing time)
     - How data is stored (locally on device + secure sync to Supabase)
     - User control (can disable tracking anytime)
     - No third-party sharing
     - GDPR compliance

4. **Create Chrome Web Store Assets:**
   - **Screenshot 1:** Dashboard showing stats
   - **Screenshot 2:** Share feature
   - **Screenshot 3:** Insights page
   - Size: 1280×800 PNG

5. **Prepare Description:**
   ```
   Title: Life in Numbers
   
   Description:
   Automatically track your digital activity with privacy-first browser extension.
   
   • ⌨️ Keyboard tracking - Measure typing productivity
   • 📑 Tab intelligence - Monitor browsing patterns  
   • 🌐 Browsing time - See time spent online
   • 💡 Smart insights - Get meaningful observations
   • 📤 Shareable stats - Show off your day
   • 🔒 Privacy first - All data stays on your device
   
   No AI, no cloud uploads, no tracking beyond what you want.
   ```

6. **Test Extension Locally:**
   ```bash
   # In Chrome:
   1. Go to chrome://extensions/
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select "extension/" folder
   5. Test all features:
      - Keyboard tracking works ✅
      - Tab tracking works ✅
      - Popup displays stats ✅
      - Data persists after browser restart ✅
   ```

**Checklist:**
- [ ] 3 icons created (16, 48, 128 PNG)
- [ ] manifest.json updated with icons
- [ ] Privacy policy written
- [ ] 3 screenshots created (1280×800)
- [ ] Description written
- [ ] Extension tested locally

---

### 5️⃣ FINAL TESTING (TASK: final-testing)
**Estimated time:** 20 minutes
**Priority:** CRITICAL

**End-to-End Test Checklist:**

**Authentication:**
- [ ] Sign up with email works
- [ ] Sign up with Google OAuth works
- [ ] Sign in works
- [ ] Sign out works
- [ ] User appears in Supabase `users` table immediately

**Frontend:**
- [ ] Dashboard loads with user greeting
- [ ] 4 stat cards display (keyboard, tabs, browsing, session)
- [ ] Insights page shows rule-based observations
- [ ] History page loads with charts
- [ ] Profile page shows user info
- [ ] Settings page has toggles
- [ ] Responsive on mobile/tablet

**Share Feature:**
- [ ] "Generate Share Link" button works
- [ ] Link copied to clipboard
- [ ] Public `/share/[id]` page loads
- [ ] Stats display correctly
- [ ] Expires in 30 days message shows
- [ ] View count increments

**Extension:**
- [ ] Extension installs locally
- [ ] Popup shows current stats
- [ ] Keyboard presses counter increments
- [ ] Tab counter increments when opening new tabs
- [ ] Data persists after browser close
- [ ] Auto-syncs to backend at midnight (or manually trigger)
- [ ] Supabase `daily_stats` table gets updated

**API Routes:**
- [ ] GET `/api/extension/sync` returns "ok"
- [ ] POST `/api/extension/sync` creates/updates stats
- [ ] POST `/api/share/generate` creates share card
- [ ] GET `/api/webhooks/clerk` (if applicable)

**Production (Vercel):**
- [ ] Homepage loads without errors
- [ ] Sign up works on production
- [ ] Dashboard loads with production data
- [ ] Share feature works on production
- [ ] No console errors
- [ ] Loading time < 3 seconds

**Verification Steps:**
```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:3001

# 3. Test full flow
# - Sign up
# - Check Supabase
# - Generate share
# - Test share link

# 4. Build for production
npm run build

# 5. Check Vercel deployment
# https://your-domain.vercel.app
```

---

### 6️⃣ CHROME WEB STORE SUBMISSION (TASK: extension-publish)
**Estimated time:** 45 minutes
**Priority:** MEDIUM (post-launch)

**Steps:**

1. **Create Chrome Web Store Developer Account:**
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay $5 registration fee
   - Accept terms

2. **Prepare Extension ZIP:**
   ```bash
   # Zip the extension folder
   cd 'c:\How cooked am I\life-in-numbers'
   # Create ZIP of extension/ folder
   # Save as: life-in-numbers-extension.zip
   ```

3. **Create New Item:**
   - In Chrome Web Store console, click **"New item"**
   - Upload ZIP file
   - Wait for validation (~5 min)

4. **Fill Store Details:**
   - **Name:** Life in Numbers
   - **Short description:** (140 chars) "Auto-track keyboard activity, tabs, and browsing time with privacy-first browser extension"
   - **Detailed description:** (4000 chars) Use description from step 4
   - **Category:** Productivity
   - **Language:** English
   - **Website:** `https://your-domain.vercel.app`
   - **Support email:** your@email.com

5. **Upload Store Assets:**
   - **128×128 icon:** extension/icons/128.png
   - **Screenshots** (1280×800): 3-5 images
   - **Promotional image** (440×280 optional)

6. **Privacy & Compliance:**
   - Check: "Does this extension handle user data?"
   - Link to privacy policy: `https://your-domain.vercel.app/privacy`
   - Declare: "Data stays on device, no third-party sharing"

7. **Submit for Review:**
   - Click **"Submit for review"**
   - Wait 24-48 hours for approval
   - Google will test functionality

8. **After Approval:**
   - Extension goes live on Chrome Web Store
   - Users can install from: `https://chrome.google.com/webstore/detail/life-in-numbers/[ID]`

---

## Timeline to Launch

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Database Setup | ✅ Done | Complete |
| 2 | Backend Integration | ✅ Done | Complete |
| 3 | GitHub Setup | 10 min | **Next** |
| 4 | Vercel Deployment | 15 min | **After #3** |
| 5 | Extension Prep | 30 min | **After #4** |
| 6 | Final Testing | 20 min | **After #5** |
| 7 | Extension Publish | 45 min | **Post-launch** |

**Total time to MVP launch:** ~75 minutes

**Total time to full launch (with Chrome Store):** ~2 hours

---

## Quick Wins (Do These First)

### Today (10 min):
1. Initialize Git
2. Create GitHub repo
3. Push code

### Today (30 min):
1. Create Vercel account
2. Deploy project
3. Add environment variables
4. Test on Vercel

### Today (30 min):
1. Create 3 extension icons
2. Update manifest.json
3. Write privacy policy
4. Test extension locally

### Tomorrow:
1. Final end-to-end testing
2. Extension submission prep
3. Submit to Chrome Web Store

---

## Critical Path Dependencies

```
GitHub Setup (10 min)
    ↓
Vercel Deploy (15 min) ← Must have GitHub
    ↓
Extension Prep (30 min)
    ↓
Final Testing (20 min)
    ↓
Chrome Store (45 min) ← Can do after launch
```

**Fastest path to MVP launch: 75 minutes** (if doing sequentially)

---

## Important Reminders

✅ **Database:** Already in Supabase
✅ **Backend:** API routes connected
✅ **Frontend:** All pages built
✅ **Extension:** Functional locally
⏳ **Deployment:** Ready for Vercel
⏳ **Submission:** Ready for Chrome Store

**You're at 84% completion!**

---

## Next Command to Run

```bash
# 1. Check git status
git status

# 2. Create GitHub repo (instructions above)

# 3. Push to GitHub
git push -u origin main

# 4. Deploy to Vercel (via Vercel dashboard or CLI)
npm install -g vercel
vercel
```

---

**Ready to launch?** Start with GitHub setup! 🚀
