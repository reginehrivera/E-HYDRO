//supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kemcjyqlxkaleqhmbsfh.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbWNqeXFseGthbGVxaG1ic2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODA0MjcsImV4cCI6MjA1ODQ1NjQyN30.hKMMtVJQ2ZjuYhfIqBss69jMIKTMEKLah8ntTHqX588'

export const supabase = createClient(supabaseUrl, supabaseKey)
