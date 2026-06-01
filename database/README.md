# Database Schema Documentation

## Overview

This directory contains all database schema and migration files for Life in Numbers.

### Database Type
- **PostgreSQL** via Supabase
- **Extensions:** uuid-ossp, pgcrypto

## Files

- `001_initial_schema.sql` - Initial schema with all tables, indexes, and RLS policies
- `../lib/database.types.ts` - TypeScript types generated from schema

## Schema Overview

### Core Tables

#### users
- Stores user account information
- Linked to Clerk authentication
- Indexes: clerk_id, email, created_at

#### daily_stats
- Daily activity statistics for each user
- Data: keyboard presses, tabs opened, browsing time, session duration
- Unique constraint: (user_id, date)
- Indexes: user_id, date, combined user_id+date

#### weekly_stats & monthly_stats
- Aggregated statistics for weekly and monthly periods
- Used for trend analysis and reports
- Generated from daily_stats

#### insights
- Generated insights and observations about user activity
- Types: keyboard, browsing, tabs, session, general
- Linked to daily/weekly/monthly periods
- Indexes: user_id, period_date, created_at

#### share_cards
- Shareable statistics cards
- Unique slug for public sharing
- Contains stats_json for flexible data storage
- View tracking for analytics

#### activity_logs
- Raw browser activity from extension (keyboard, tab events)
- Archived after retention period (configurable in user_settings)
- JSONB for flexible activity data

#### user_settings
- Per-user configuration and preferences
- Tracking toggles (keyboard, browsing, tabs)
- Privacy mode and domain exclusion
- Dark mode and notification preferences

#### excluded_domains
- Sites excluded from tracking (for privacy)
- One domain per row for easy querying

#### feedback
- User feedback, bug reports, and feature requests
- Status tracking (open, in_review, resolved, closed)

## Setup Instructions

### 1. Create Tables in Supabase

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire contents of `001_initial_schema.sql`
5. Paste into the SQL editor
6. Click "Run"

The schema will be created with all tables, indexes, and RLS policies.

### 2. Enable RLS (Row Level Security)

RLS is configured in the schema file. Supabase will:
- Require authentication for all tables
- Isolate user data (users can only see their own data)
- Allow public read on share_cards

### 3. Generate TypeScript Types

The types are already generated in `lib/database.types.ts`. Keep these in sync with the schema.

## Important Concepts

### Indexes
Strategic indexes are created for:
- **Foreign key lookups:** user_id indexes
- **Date-based queries:** date, created_at, period_date indexes
- **Compound queries:** user_id + date combinations

### Row Level Security (RLS)
- **users table:** Users can only read their own record
- **daily_stats:** Users can only read their own stats
- **insights:** Users can only read their own insights
- **share_cards:** Public by default, but user_id indicates owner
- **activity_logs:** Users can only read their own activity

### Automatic Timestamps
The `update_updated_at_column()` trigger automatically updates the `updated_at` field on:
- users
- daily_stats
- user_settings

### Data Types
- **UUID:** Primary keys and foreign keys
- **DATE:** For daily records (no time component needed)
- **TIMESTAMP WITH TIME ZONE:** For detailed logging
- **JSONB:** For flexible activity data storage

## Common Queries

### Get today's stats for current user
```sql
SELECT * FROM daily_stats 
WHERE user_id = $1 AND date = CURRENT_DATE;
```

### Get weekly summary
```sql
SELECT * FROM weekly_stats 
WHERE user_id = $1 AND week_start_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY week_start_date DESC;
```

### Get recent insights
```sql
SELECT * FROM insights 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 10;
```

### Get user's settings
```sql
SELECT * FROM user_settings WHERE user_id = $1;
```

## Maintenance

### Data Retention
- Raw activity logs in `activity_logs` are kept based on `user_settings.data_retention_days` (default: 365)
- Daily/weekly/monthly stats are kept indefinitely
- Old activity logs should be deleted by a scheduled job

### Backups
- Supabase automatically backs up your database daily
- Manual backups can be triggered from the dashboard

## Migration Notes

If updating the schema:
1. Create a new file: `002_migration_name.sql`
2. Test locally or in a development Supabase project first
3. Document the migration purpose
4. Follow the same format as `001_initial_schema.sql`

## Support

For Supabase-specific questions:
- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase
