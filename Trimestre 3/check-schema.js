const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.argv[2];
const supabaseServiceKey = process.argv[3];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Faltan URL o Service Key como argumentos.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log('--- BUSCANDO COLUMNAS ---');
  const { data, error } = await supabase.from('perfiles').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columnas:', Object.keys(data[0]).join(', '));
  } else {
    console.log('Tabla vacía.');
  }
}

check();
