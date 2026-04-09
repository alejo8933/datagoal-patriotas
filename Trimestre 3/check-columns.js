const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Faltan variables de entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log('--- DIAGNÓSTICO DE COLUMNAS ---');
  try {
    const { data, error } = await supabase.from('perfiles').select('*').limit(1);
    
    if (error) {
      console.error('Error de Supabase:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columnas Reales Encontradas:');
      console.log(Object.keys(data[0]).join(' | '));
    } else {
      console.log('La tabla está vacía. No puedo ver las columnas por select.');
    }
  } catch (err) {
    console.error('Error inesperado:', err.message);
  }
}

check();
