import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wwtiyupjfpdkzzgvwalm.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3dGl5dXBqZnBka3p6Z3Z3YWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDE5NjksImV4cCI6MjA4Njg3Nzk2OX0.C2wCmN0mc6RMiErI_TSRlTbGOyEpYdKsdLEBSRn_PFc"

export const supabase = createClient(supabaseUrl, supabaseKey,{
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })