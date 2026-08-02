import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gioxgsgiihqtbtbljnil.supabase.co';
const supabaseAnonKey = 'sb_publishable_nQlLJaj1mr2XdhA7YZFl2w_0_hGf_57';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
