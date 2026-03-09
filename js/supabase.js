import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ffsefgtplwwjzeufanmh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmc2VmZ3RwbHd3anpldWZhbm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTY0NjUsImV4cCI6MjA4ODYzMjQ2NX0.UzW8D1By8H_2-dndtMc6-KT03u3w6JCcPKvpeG9XpnQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
