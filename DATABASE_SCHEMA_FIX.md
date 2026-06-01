# Database Schema Fix - Completed ✅

## Problem
When running `database/001_initial_schema.sql` in Supabase, the error occurred:
```
ERROR: 42P16: multiple primary keys for table "users" are not allowed
```

## Root Cause
The schema file had **duplicate PRIMARY KEY definitions** for each table:
- Line 12: `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- Line 23: `CONSTRAINT users_pkey PRIMARY KEY (id)` ← **DUPLICATE!**

PostgreSQL doesn't allow defining a primary key twice on the same column.

## Solution
Removed all redundant `CONSTRAINT <table>_pkey PRIMARY KEY (id)` lines from all 9 tables:
- ✅ users
- ✅ daily_stats
- ✅ weekly_stats
- ✅ monthly_stats
- ✅ insights
- ✅ share_cards
- ✅ activity_logs
- ✅ user_settings
- ✅ excluded_domains
- ✅ feedback

Each table now has **only one PRIMARY KEY definition** in the column definition.

---

## How to Apply the Fix

### Option 1: Use Updated Schema (RECOMMENDED)
The schema file has been fixed. Now run it again:

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy entire contents of `database/001_initial_schema.sql`
5. Paste into editor
6. Click **Run**
7. Wait for completion (~30 seconds)

Expected output: ✅ All 10 tables created successfully

### Option 2: Manual Fix (if schema already partially ran)
If some tables exist, in Supabase SQL Editor run:

```sql
-- Drop all existing tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS excluded_domains CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS share_cards CASCADE;
DROP TABLE IF EXISTS insights CASCADE;
DROP TABLE IF EXISTS monthly_stats CASCADE;
DROP TABLE IF EXISTS weekly_stats CASCADE;
DROP TABLE IF EXISTS daily_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then run the fixed schema
-- [Paste entire 001_initial_schema.sql here]
```

---

## Verification

After running the schema, verify in Supabase:

1. Go to **Table Editor** (left sidebar)
2. You should see exactly **10 tables**:
   - [ ] users
   - [ ] daily_stats
   - [ ] weekly_stats
   - [ ] monthly_stats
   - [ ] insights
   - [ ] share_cards
   - [ ] activity_logs
   - [ ] user_settings
   - [ ] excluded_domains
   - [ ] feedback

3. Click each table and verify columns are correct
4. ✅ If all exist: Database setup complete!

---

## Next Steps

1. **Create Supabase Client** - `lib/supabase.ts`
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Connect API Routes** to use real database

3. **Test Sign-Up Flow** - User should appear in `users` table

---

## Files Modified
- `database/001_initial_schema.sql` - Removed all redundant PRIMARY KEY constraints

---

## Lesson Learned
When defining a PRIMARY KEY in PostgreSQL:
- ❌ DON'T do this:
  ```sql
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  CONSTRAINT table_pkey PRIMARY KEY (id)  -- Duplicate!
  ```
- ✅ DO this:
  ```sql
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  ```

The PRIMARY KEY constraint is already defined on the column, so the separate CONSTRAINT line is unnecessary.
