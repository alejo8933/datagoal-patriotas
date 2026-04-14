const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sozsuvajuqpnmodzrhtz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvenN1dmFqdXFwbm1vZHpyaHR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxMTIyOCwiZXhwIjoyMDg4OTg3MjI4fQ.PFHnheo_dZ4Yj56-zyvqmokQE9EwxwCHXeV12K5zMTE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRpc() {
    console.log('Checking for execute_sql RPC...');
    const { data, error } = await supabase.rpc('execute_sql', { 
        sql_query: 'SELECT 1' 
    });
    
    if (error) {
        console.error('RPC execute_sql failed or doesn\'t exist:', error.message);
        return false;
    }
    console.log('RPC execute_sql exists!');
    return true;
}

checkRpc();
