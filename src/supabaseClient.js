import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mzxtpakxtuqzhrpgwoef.supabase.co'
const supabaseKey = 'sb_publishable_Kpce4vaaXAwwhPtKsJto3g_vutAmPiG'

export const supabase = createClient(supabaseUrl, supabaseKey)