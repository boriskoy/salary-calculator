import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(
  "https://ehoymzjawsjwnajpjdtq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVob3ltemphd3Nqd25hanBqZHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM5MDQ0ODEsImV4cCI6MTk3OTQ4MDQ4MX0.jNxOS9G8LkkwsN-ZvYL54WKTQOGlD8dwfrdvlJJfGoU", 
  {
    schema: 'public',
    headers: {'x-my-custom-header': 'salary-calculator' },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
)