'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function restaurarRegistro(formData: FormData) {
  const supabase = await createClient()

  const tabla = formData.get('tabla')?.toString()
  const id = formData.get('id')?.toString()
  const path = formData.get('path')?.toString() || '/dashboard/admin/archivo'

  if (!tabla || !id) {
    return { success: false, message: 'Faltan parámetros de restauración.' }
  }

  try {
    let result;

    if (tabla === 'partidos') {
      // Restauramos al estado por defecto 'Programado'
      result = await supabase.from(tabla).update({ estado: 'Programado' }).eq('id', id)
    } else {
      // Para la mayoría de tablas usamos la columna 'activo'
      result = await supabase.from(tabla).update({ activo: true }).eq('id', id)
    }

    if (result.error) throw result.error

    // Revalidamos tanto el archivo como la página de origen
    revalidatePath('/dashboard/admin/archivo')
    revalidatePath(path)

    return { 
      success: true, 
      message: 'Registro restaurado y devuelto a la sección correspondiente.' 
    }

  } catch (err: any) {
    console.error('Error restaurando:', err)
    return { success: false, message: err.message || 'Error al restaurar.' }
  }
}
