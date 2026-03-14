import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ywkfkqkoauwslcmvnxid.supabase.co'

// Service-role key — bypasses RLS. Only used in the admin panel.
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a2ZrcWtvYXV3c2xjbXZueGlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI1NDE4MywiZXhwIjoyMDg4ODMwMTgzfQ.RdQyxChWQipWXCGz6R2h2r4tWQIIuo4PgS3fGBcf46s'

export const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
