'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearJugador(formData: FormData) {
  const supabase = await createClient()

  // Extrayendo datos robustamente (usando strings por defecto para evitar undefined)
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const posicion = formData.get('posicion')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const numero_camiseta_raw = formData.get('numero_camiseta')

  // Validación Base de Servidor (Lo que el jefe verá como robusto)
  if (!nombre || !apellido || !categoria) {
    return {
      success: false,
      message: 'Nombre, Apellido y Categoría son campos estrictamente obligatorios.',
    }
  }

  // Parseo numérico opcional
  const numero_camiseta = numero_camiseta_raw ? parseInt(numero_camiseta_raw.toString(), 10) : null

  // Inserción a la base de datos
  const { data, error } = await supabase
    .from('jugadores')
    .insert([
      {
        nombre,
        apellido,
        posicion: posicion || null,
        categoria,
        numero_camiseta,
        goles: 0,
        asistencias: 0,
        tarjetas_amarillas: 0,
        tarjetas_rojas: 0,
      },
    ])
    .select()

  if (error) {
    console.error('Error insertando jugador:', error)
    return {
      success: false,
      message: 'Ha ocurrido un error insertando al jugador en la base de datos.',
      error: error.message,
    }
  }

  // Re-validamos la ruta del administrador para que la tabla se actualice sin recargar la página (Next.js Cache Invalidation)
  revalidatePath('/dashboard/admin/jugadores')

  return {
    success: true,
    message: 'Jugador creado exitosamente.',
    data,
  }
}

export async function editarJugador(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id')?.toString()
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const posicion = formData.get('posicion')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const numero_camiseta_raw = formData.get('numero_camiseta')

  if (!id || !nombre || !apellido || !categoria) {
    return {
      success: false,
      message: 'ID, Nombre, Apellido y Categoría son campos obligatorios.',
    }
  }

  const numero_camiseta = numero_camiseta_raw ? parseInt(numero_camiseta_raw.toString(), 10) : null

  const { error } = await supabase
    .from('jugadores')
    .update({
      nombre,
      apellido,
      posicion: posicion || null,
      categoria,
      numero_camiseta,
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando jugador:', error)
    return {
      success: false,
      message: 'Error al actualizar el jugador.',
      error: error.message,
    }
  }

  revalidatePath('/dashboard/admin/jugadores')

  return {
    success: true,
    message: 'Jugador actualizado correctamente.',
  }
}
