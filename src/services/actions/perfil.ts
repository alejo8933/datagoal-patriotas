'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function actualizarMiPerfil(formData: FormData) {
  const supabase = await createClient()

  // Obtener el usuario autenticado para seguridad
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Sesión no válida.' }
  }

  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const telefono = formData.get('telefono')?.toString().trim()
  const genero = formData.get('genero')?.toString()
  const documento = formData.get('documento')?.toString().trim()
  const fecha_nacimiento = formData.get('fecha_nacimiento')?.toString()

  if (!nombre || !apellido) {
    return { success: false, message: 'Nombre y Apellido son obligatorios.' }
  }

  const { error } = await supabase
    .from('perfiles')
    .update({
      nombre,
      apellido,
      telefono: telefono || null,
      genero: genero || null,
      documento: documento || null,
      fecha_nacimiento: fecha_nacimiento || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error actualizando perfil:', error)
    return { success: false, message: 'No se pudieron guardar los cambios.' }
  }

  // Revalidar para actualizar toda la UI (Header incluído)
  revalidatePath('/dashboard', 'layout')
  
  return { 
    success: true, 
    message: 'Perfil actualizado correctamente.' 
  }
}

export async function cambiarPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password')?.toString()
  const confirmPassword = formData.get('confirmPassword')?.toString()

  if (!password || !confirmPassword) {
    return { success: false, message: 'Todos los campos son obligatorios.' }
  }

  if (password.length < 6) {
    return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Las contraseñas no coinciden.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Error actualizando password:', error)
    return { success: false, message: error.message }
  }

  return { 
    success: true, 
    message: 'Contraseña actualizada correctamente.' 
  }
}
