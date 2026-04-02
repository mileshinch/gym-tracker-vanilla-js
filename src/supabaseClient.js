import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmepqxbazheumgcjqrsq.supabase.co';
const supabaseAnonKey = 'sb_publishable_kooNk4ptwxosZfQ1DJwrcg_ZYfaRvM-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);