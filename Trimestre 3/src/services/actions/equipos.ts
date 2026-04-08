'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Crea un nuevo equipo con validaciones de integridad y relación con técnico
 */
export async function crearEquipo(formData: FormData) {
  try {
    const supabase = createClient()
    
    const equipo = formData.get('equipo') as string
    const categoria = formData.get('categoria') as string
    const tecnico_id = formData.get('tecnico_id') as string
    const sede = formData.get('sede') as string
    const fundacion = parseInt(formData.get('fundacion') as string) || 2024

    // Validaciones de Servidor
    if (!equipo || !categoria) {
      return { success: false, message: 'Nombre y categoría son obligatorios.' }
    }

    // Verificar unicidad de equipo + categoría
    const { data: existente } = await supabase
      .from('rendimiento_equipos')
      .select('id')
      .eq('equipo', equipo)
      .eq('categoria', categoria)
      .single()

    if (existente) {
      return { success: false, message: 'Ya existe este equipo en la categoría seleccionada.' }
    }

    const { error } = await supabase
      .from('rendimiento_equipos')
      .insert([
        { 
          equipo, 
          categoria, 
          tecnico_id: tecnico_id || null, 
          sede: sede || 'Sede Principal', 
          fundacion 
        }
      ])

    if (error) throw error

    revalidatePath('/dashboard/admin/equipos')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating team:', error)
    return { success: false, message: error.message }
  }
}

/**
 * Edita un equipo existente
 */
export async function editarEquipo(formData: FormData) {
  try {
    const supabase = createClient()
    
    const id = formData.get('id') as string
    const equipo = formData.get('equipo') as string
    const categoria = formData.get('categoria') as string
    const tecnico_id = formData.get('tecnico_id') as string
    const sede = formData.get('sede') as string
    const fundacion = parseInt(formData.get('fundacion') as string) || 2024

    if (!id || !equipo) {
      return { success: false, message: 'Datos incompletos para actualizar.' }
    }

    const { error } = await supabase
      .from('rendimiento_equipos')
      .update({ 
        equipo, 
        categoria, 
        tecnico_id: tecnico_id || null, 
        sede, 
        fundacion 
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/equipos')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating team:', error)
    return { success: false, message: error.message }
  }
}
