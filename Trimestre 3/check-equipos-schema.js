const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.argv[2];
const supabaseServiceKey = process.argv[3];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log('--- BUSCANDO COLUMNAS EQUIPOS ---');
  const { data, error } = await supabase.from('rendimiento_equipos').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columnas:', Object.keys(data[0]).join(', '));
  } else {
    // Si la tabla está vacía, intentamos ver el error al insertar
    const { error: err } = await supabase.from('rendimiento_equipos').insert({ equipo: 'test' });
    console.log('Tabla vacía o error:', err?.message);
  }
}

check();
