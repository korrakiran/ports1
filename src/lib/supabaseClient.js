import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcsmwgpfizmrevqziayf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc213Z3BmaXptcmV2cXppYXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NDY0ODQsImV4cCI6MjEwMTMyMjQ4NH0.e-9gUaOgmrnVZeAFx0c37bUpUbKr1b--NMXCPgGw1NI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
