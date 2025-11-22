import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkqnjgmqdanegdupuvfr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcW5qZ21xZGFuZWdkdXB1dmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzE5NzMsImV4cCI6MjA3OTI0Nzk3M30.-ICB5VZ9L25g7LYEqB5arMwbOuJyWJoQX50vuXBJb1Y'

export const supabase = createClient(supabaseUrl, supabaseKey)
