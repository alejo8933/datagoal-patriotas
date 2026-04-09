'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearJugador(formData: FormData) {
  const supabase = await createClient()

  // Extrayendo datos robustamente
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const posicion = formData.get('posicion')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const numero_camiseta_raw = formData.get('numero_camiseta')

  // Validación Base de Servidor
  if (!nombre || !apellido || !categoria) {
    return {
      success: false,
      message: 'Nombre, Apellido y Categoría son campos estrictamente obligatorios.',
    }
  }

  // 1. Validación de Rango (Dorsal)
  const numero_camiseta = numero_camiseta_raw ? parseInt(numero_camiseta_raw.toString(), 10) : null
  if (numero_camiseta !== null && (numero_camiseta < 1 || numero_camiseta > 99)) {
    return {
      success: false,
      message: 'El número de camiseta debe estar entre 1 y 99.',
    }
  }

  // 2. Verificación de Duplicados GLOBAL (Asegura una única categoría por jugador)
  const { data: existente } = await supabase
    .from('jugadores')
    .select('id, categoria')
    .eq('nombre', nombre)
    .eq('apellido', apellido)
    .eq('activo', true) // Solo si está activo
    .single()

  if (existente) {
    return {
      success: false,
      message: `El jugador ${nombre} ${apellido} ya está registrado y activo en la categoría ${existente.categoria}. Para moverlo, use la función de 'Trasladar'.`,
    }
  }

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
        activo: true
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

/**
 * Realiza el traslado de un jugador a una nueva categoría en un solo paso.
 */
export async function transferirJugador(id: string, nuevaCategoria: string) {
  if (!id || !nuevaCategoria) return { success: false, message: 'Datos incompletos.' };

  const supabase = await createClient()

  const { error } = await supabase
    .from('jugadores')
    .update({ categoria: nuevaCategoria })
    .eq('id', id);

  if (error) {
    return { success: false, message: 'No se pudo completar el traslado.' };
  }

  revalidatePath('/dashboard/admin/jugadores');
  return { success: true, message: 'Traslado completado exitosamente.' };
}
