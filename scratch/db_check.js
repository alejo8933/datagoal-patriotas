const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
  console.log('--- AUDITORÍA DE BASE DE DATOS ---');
  
  const tables = ['jugadores', 'asistencias', 'facturas', 'entrenamientos', 'okr_objetivos'];
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`[!] Error en ${table}: ${error.message}`);
    } else {
      console.log(`[✓] ${table}: ${count} registros encontrados.`);
    }
  }

  // Verificar columnas de 'asistencias'
  const { data: colsAsist, error: errAsist } = await supabase.from('asistencias').select('*').limit(1);
  if (colsAsist && colsAsist[0]) {
    console.log('Columnas de asistencias:', Object.keys(colsAsist[0]));
  }
}

checkDB();
