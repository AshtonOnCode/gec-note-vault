import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Replace with your actual Supabase project credentials
const SUPABASE_URL = "https://zfiuzdmionjolmbedvpk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaXV6ZG1pb25qb2xtYmVkdnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzk2MzUsImV4cCI6MjA3NzE1NTYzNX0.d2fmy2Fzx26YCJc9tRCykDWrgJHXlzSpXwlnaUj1KrU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
