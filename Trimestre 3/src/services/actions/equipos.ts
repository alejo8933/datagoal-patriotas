'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearEquipo(formData: FormData) {
  const supabase = await createClient()

  const equipo = formData.get('equipo')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()

  // Validación
  if (!equipo || !categoria) {
    return {
      success: false,
      message: 'El Nombre del Equipo y la Categoría son obligatorios.',
    }
  }

  // Inserción, la tabla es rendimiento_equipos en el esquema public
  const { data, error } = await supabase
    .from('rendimiento_equipos')
    .insert([
      {
        equipo,
        categoria,
        partidos: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0,
        goles_favor: 0,
        goles_contra: 0,
        puntos: 0
      },
    ])
    .select()

  if (error) {
    console.error('Error insertando equipo:', error)
    return {
      success: false,
      message: 'Ha ocurrido un error insertando el equipo en la base de datos.',
      error: error.message,
    }
  }

  // Revalidar caché de Next.js
  revalidatePath('/dashboard/admin/equipos')

  return {
    success: true,
    message: 'Equipo creado exitosamente.',
    data,
  }
}

export async function editarEquipo(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id')?.toString()
  const equipo = formData.get('equipo')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()

  if (!id || !equipo || !categoria) {
    return {
      success: false,
      message: 'ID, Nombre del Equipo y Categoría son obligatorios.',
    }
  }

  const { error } = await supabase
    .from('rendimiento_equipos')
    .update({ equipo, categoria })
    .eq('id', id)

  if (error) {
    console.error('Error editando equipo:', error)
    return {
      success: false,
      message: 'Error al actualizar el equipo.',
      error: error.message,
    }
  }

  revalidatePath('/dashboard/admin/equipos')

  return {
    success: true,
    message: 'Equipo actualizado correctamente.',
  }
}
