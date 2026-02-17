const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase Admin client with Service Role Key
// This client bypasses RLS policies!
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

module.exports = supabaseAdmin;
