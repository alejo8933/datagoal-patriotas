import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getColumns() {
  console.log('--- BUSCANDO COLUMNAS REALES ---')
  const { data, error } = await supabase.from('perfiles').select('*').limit(1)
  
  if (error) {
    console.error('Error:', error)
    return
  }

  if (data && data.length > 0) {
    console.log('Columnas encontradas en la tabla perfiles:')
    console.log(Object.keys(data[0]).join(', '))
  } else {
    console.log('La tabla está vacía. Intentaré ver el esquema de otra forma.')
    // Si está vacía, intentamos insertar algo temporal para ver qué falla
    const { error: insertError } = await supabase.from('perfiles').insert({ id: '00000000-0000-0000-0000-000000000000' })
    console.log('Error de inserción (para ver columnas):', insertError?.message)
  }
}

getColumns()
