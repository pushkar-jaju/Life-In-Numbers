# Authentication Setup Guide

## Overview

This project uses **Clerk** for authentication, providing:
- Email/password authentication
- Google OAuth sign-in
- User session management
- Automatic JWT tokens
- User profile management

## Files Created

### Authentication Files
- `middleware.ts` - Route protection middleware
- `lib/auth.config.ts` - Auth configuration
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Sign-up page
- `app/dashboard/page.tsx` - Protected dashboard example

### What Was Updated
- `app/layout.tsx` - Added ClerkProvider wrapper

## Setup Instructions

### 1. Create Clerk Account and Application

1. Go to [clerk.com](https://clerk.com)
2. Click "Sign up" and create an account
3. Create a new application (choose Next.js)
4. Configure sign-in methods:
   - Email/Password (enabled by default)
   - Google OAuth (recommended)

### 2. Get API Keys

1. In Clerk dashboard, go to **Settings > API Keys**
2. Copy the **Publishable Key** (starts with `pk_`)
3. Copy the **Secret Key** (starts with `sk_`)
4. Paste into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

### 3. Configure Redirect URLs (optional but recommended)

In Clerk dashboard > Settings > URLs:
- **Allowed sign-in URLs:** `http://localhost:3000`
- **Allowed sign-up URLs:** `http://localhost:3000`
- **Allowed logout URLs:** `http://localhost:3000`

For production, add your domain URLs.

### 4. Test the Authentication

```bash
npm run dev
```

Visit:
- `http://localhost:3000/sign-in` - Sign in page
- `http://localhost:3000/sign-up` - Sign up page
- `http://localhost:3000/dashboard` - Protected route (requires login)

## How It Works

### Public Routes
These routes are accessible without authentication:
- `/` - Home page (can be created later)
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/share/*` - Shareable statistics (public)
- `/api/public/*` - Public API endpoints

### Protected Routes
These routes require authentication:
- `/dashboard` - Main dashboard
- `/profile` - User profile (to be created)
- `/settings` - Settings (to be created)
- `/history` - Activity history (to be created)
- `/insights` - Generated insights (to be created)

### Route Protection
The `middleware.ts` file automatically:
1. Checks if a user is authenticated
2. Redirects unauthenticated users to `/sign-in`
3. Allows public routes without authentication

## User Information Access

In any component, use Clerk's hooks:

```tsx
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

export default function MyComponent() {
  const { user, isLoaded } = useUser();
  const { userId, isSignedIn } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

## Database Sync

When a user signs up, their Clerk ID should be synced to the `users` table in the database. This is typically done via:

1. **Webhook:** Clerk sends a webhook when a user is created
2. **Manual sync:** API route that pulls user data from Clerk

A webhook handler will be created in a later task (Task: api-routes-auth).

## Important Notes

- **ClerkProvider wraps the entire app** - All components can access Clerk
- **Middleware runs on every request** - Protects routes automatically
- **Google OAuth recommended** - Easier signup flow for users
- **Never commit secret keys** - Use environment variables
- **Test in development** - Sign in and out to verify setup

## Next Steps

- [ ] Create database sync webhook for Clerk users
- [ ] Create protected API routes
- [ ] Add user profile page
- [ ] Add settings page
- [ ] Integrate with database queries

## Troubleshooting

### Users can't sign in
- Check environment variables are set correctly
- Verify Clerk project is created
- Check network tab in browser for errors

### "Sign up is closed" error
- Go to Clerk dashboard > Settings > General
- Enable "Sign-up enabled"

### Redirect loop
- Check middleware configuration
- Ensure publicRoutes list matches your routes

## Resources

- Clerk Docs: https://clerk.com/docs
- Clerk Next.js Guide: https://clerk.com/docs/references/nextjs/overview
- Support: https://clerk.com/support
