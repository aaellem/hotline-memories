import { createClient } from '@supabase/supabase-js';

export function getAdminClient() {
  const url = process.env.SUPABASE_URL as string;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE as string;
  if (!url || !serviceRole) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  }
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}
