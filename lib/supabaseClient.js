import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wwtiyupjfpdkzzgvwalm.supabase.co"
const supabaseKey = "sb_publishable_dcFO5ewSyXaOVoRvQxVp0w_rWr830DU"

export const supabase = createClient(supabaseUrl, supabaseKey)