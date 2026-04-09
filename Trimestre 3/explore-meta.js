const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.argv[2];
const supabaseServiceKey = process.argv[3];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAuthMetadata() {
  console.log('--- EXPLORANDO NUBE DE SEGURIDAD (AUTH) ---');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (users && users.length > 0) {
    const userWithData = users.find(u => Object.keys(u.user_metadata || {}).length > 0) || users[0];
    console.log(`Usuario: ${userWithData.email}`);
    console.log('Metadatos encontrados (Claves Reales):');
    console.log(JSON.stringify(userWithData.user_metadata, null, 2));
  } else {
    console.log('No hay usuarios en la base de datos.');
  }
}

checkAuthMetadata();
