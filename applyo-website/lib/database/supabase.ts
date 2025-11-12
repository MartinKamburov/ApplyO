import { createClient } from '@supabase/supabase-js';
import { auth } from '@/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseConnection = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);