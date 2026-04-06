import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Key está faltando no .env. O sistema funcionará apenas offline até a configuração.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
