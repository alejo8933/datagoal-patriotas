'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearPartido(formData: FormData) {
  const supabase = await createClient()

  const equipo_local = formData.get('equipo_local')?.toString().trim()
  const equipo_visitante = formData.get('equipo_visitante')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()
  const hora = formData.get('hora')?.toString().trim()
  const lugar = formData.get('lugar')?.toString().trim()
  const descripcion = formData.get('descripcion')?.toString().trim()

  // Validaciones Obligatorias
  if (!equipo_local || !equipo_visitante || !fecha) {
    return {
      success: false,
      message: 'Los equipos (Local y Visitante) y la Fecha son obligatorios.',
    }
  }

  if (equipo_local === equipo_visitante) {
    return {
      success: false,
      message: 'El equipo Local y el Visitante deben ser distintos.',
    }
  }

  // Inserción, la tabla es partidos en el esquema public
  const { data, error } = await supabase
    .from('partidos')
    .insert([
      {
        equipo_local,
        equipo_visitante,
        fecha,
        hora: hora || null,
        lugar: lugar || null,
        categoria: categoria || null,
        descripcion: descripcion || null,
        goles_local: null, // Porque aún no se juega
        goles_visitante: null,
        estado: 'Programado' // Estado nativo al crear
      },
    ])
    .select()

  if (error) {
    console.error('Error insertando partido:', error)
    return {
      success: false,
      message: 'Ha ocurrido un error al programar el partido en la base de datos.',
      error: error.message,
    }
  }

  // Re-validar caché para actualizar la tabla instantáneamente
  revalidatePath('/dashboard/admin/partidos')

  return {
    success: true,
    message: 'Partido programado exitosamente.',
    data,
  }
}

export async function editarPartido(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id')?.toString()
  const equipo_local = formData.get('equipo_local')?.toString().trim()
  const equipo_visitante = formData.get('equipo_visitante')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()
  const hora = formData.get('hora')?.toString().trim()
  const lugar = formData.get('lugar')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const goles_local = formData.get('goles_local')?.toString()
  const goles_visitante = formData.get('goles_visitante')?.toString()
  const estado = formData.get('estado')?.toString()

  if (!id || !equipo_local || !equipo_visitante || !fecha) {
    return { success: false, message: 'ID, Equipos y Fecha son obligatorios.' }
  }

  if (equipo_local === equipo_visitante) {
    return { success: false, message: 'El equipo Local y el Visitante deben ser distintos.' }
  }

  const gLocal = goles_local ? parseInt(goles_local) : null
  const gVisitante = goles_visitante ? parseInt(goles_visitante) : null

  if ((gLocal !== null && gLocal < 0) || (gVisitante !== null && gVisitante < 0)) {
    return {
      success: false,
      message: 'Los goles no pueden ser números negativos.',
    }
  }

  const { error } = await supabase
    .from('partidos')
    .update({
      equipo_local,
      equipo_visitante,
      fecha,
      hora: hora || null,
      lugar: lugar || null,
      categoria: categoria || null,
      goles_local: goles_local ? parseInt(goles_local) : null,
      goles_visitante: goles_visitante ? parseInt(goles_visitante) : null,
      estado: estado || 'Programado'
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando partido:', error)
    return { success: false, message: 'Fallo al actualizar partido.' }
  }

  revalidatePath('/dashboard/admin/partidos')
  return { success: true, message: 'Partido actualizado correctamente.' }
}
