import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Client-side (browser) - uses anon key with RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (Node.js) - uses service role key (admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
