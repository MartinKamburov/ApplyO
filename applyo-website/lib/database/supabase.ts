import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL1 = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY1 = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabase = createClient(
    SUPABASE_URL1,
    SUPABASE_ANON_KEY1
);