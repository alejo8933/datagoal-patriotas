'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearEntrenamiento(formData: FormData) {
  const supabase = await createClient()

  const titulo = formData.get('titulo')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()
  const hora = formData.get('hora')?.toString().trim()
  const lugar = formData.get('lugar')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const descripcion = formData.get('descripcion')?.toString().trim()

  // Validación Básica
  if (!titulo || !fecha || !categoria) {
    return {
      success: false,
      message: 'El Título, la Fecha y la Categoría son campos obligatorios.',
    }
  }

  // Inserción, la tabla es entrenamientos
  const { data, error } = await supabase
    .from('entrenamientos')
    .insert([
      {
        titulo,
        fecha,
        hora: hora || null,
        lugar: lugar || null,
        categoria,
        descripcion: descripcion || null,
        activo: true // Por defecto la sesión está activa al crearse
      },
    ])
    .select()

  if (error) {
    console.error('Error creando entrenamiento:', error)
    return {
      success: false,
      message: 'Ocurrió un error al agendar la sesión en la base de datos.',
      error: error.message,
    }
  }

  revalidatePath('/dashboard/admin/entrenamientos')

  return {
    success: true,
    message: 'Sesión de entrenamiento agendada con éxito.',
    data,
  }
}

export async function editarEntrenamiento(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id')?.toString()
  const titulo = formData.get('titulo')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()
  const hora = formData.get('hora')?.toString().trim()
  const lugar = formData.get('lugar')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const descripcion = formData.get('descripcion')?.toString().trim()

  if (!id || !titulo || !fecha || !categoria) {
    return { success: false, message: 'ID, Título, Fecha y Categoría son obligatorios.' }
  }

  const { error } = await supabase
    .from('entrenamientos')
    .update({
      titulo,
      fecha,
      hora: hora || null,
      lugar: lugar || null,
      categoria,
      descripcion: descripcion || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando entrenamiento:', error)
    return { success: false, message: 'Fallo al actualizar entrenamiento.' }
  }

  revalidatePath('/dashboard/admin/entrenamientos')
  return { success: true, message: 'Entrenamiento actualizado correctamente.' }
}
