import { createClient } from '@supabase/supabase-js'

export const getSupabaseClient = () => {
  return createClient(
    "https://wwtiyupjfpdkzzgvwalm.supabase.co",
    "sb_publishable_dcFO5ewSyXaOVoRvQxVp0w_rWr830DU"
  )
}
