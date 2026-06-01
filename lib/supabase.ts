import { createClient } from '@supabase/supabase-js';

// Get env vars - may be empty during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazy initialization - only create clients when actually used
let supabaseClient: any = null;
let supabaseAdminClient: any = null;

export const supabase = new Proxy(
  {},
  {
    get: () => {
      if (!supabaseClient) {
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase credentials');
        }
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      }
      return supabaseClient;
    },
  }
) as any;

export const supabaseAdmin = new Proxy(
  {},
  {
    get: () => {
      if (!supabaseAdminClient) {
        if (!supabaseUrl || !serviceRoleKey) {
          throw new Error('Missing Supabase credentials');
        }
        supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      }
      return supabaseAdminClient;
    },
  }
) as any;
