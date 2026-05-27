import { createClient } from '@supabase/supabase-js';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/private';

const supabaseUrl = PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY  || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

export const supabase = createClient(supabaseUrl, supabaseKey);
