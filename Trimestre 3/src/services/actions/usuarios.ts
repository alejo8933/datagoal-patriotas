'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function crearUsuario(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()
  const rol = formData.get('rol')?.toString().trim()

  if (!email || !password || !rol) {
    return {
      success: false,
      message: 'Email, Contraseña y Rol son requeridos.',
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres.',
    }
  }

  // Para crear usuarios sin desloguear al administrador actual, requerimos el Service Role Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.')
    return {
      success: false,
      message: 'Falta configurar TU KEY SECRETA DE ADMINISTRADOR en Supabase (.env: SUPABASE_SERVICE_ROLE_KEY) para habilitar esta fusión.',
    }
  }

  // Cliente de Super Administrador (Ignora RLS)
  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  // 1. Crear el usuario en Auth (Identidad)
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Confirmar automáticamente para no obligarlo a ir a su correo
  })

  if (authError || !newUser.user) {
    console.error('Error Auth:', authError)
    return {
      success: false,
      message: 'Error creando la identidad del usuario.',
      error: authError?.message || 'Fallo desconocido.',
    }
  }

  // 2. Asociar el rol en la tabla `perfiles`
  // Supabase Triggers usualmente crean el perfil, pero actualizaríamos el rol.
  // Pero si el Trigger no existe, lo insertamos nosotros (El SuperAdmin pasa RLS preventivamente).
  
  const { error: profileError } = await supabaseAdmin
    .from('perfiles')
    .upsert([
      {
        id: newUser.user.id,
        rol,
        estado: 'activo',
        // Podemos guardar el email como nombre base mientras ellos lo actualizan
        nombre: email.split('@')[0].toUpperCase(), 
        apellido: 'N/A'
      }
    ])

  if (profileError) {
    // Nota: Si el Trigger insertó, entonces Upsert actualizará.
    console.error('Error Perfil:', profileError)
  }

  revalidatePath('/dashboard/admin/usuarios')

  return {
    success: true,
    message: `Cuenta de ${rol} generada y asociada con éxito.`,
  }
}

export async function editarUsuario(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, message: 'Falta configuración de administrador.' }
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  const id = formData.get('id')?.toString()
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const rol = formData.get('rol')?.toString().trim()

  if (!id || !rol) {
    return { success: false, message: 'ID y Rol son obligatorios.' }
  }

  const { error } = await supabaseAdmin
    .from('perfiles')
    .update({
      nombre: nombre || null,
      apellido: apellido || null,
      rol,
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando perfil:', error)
    return { success: false, message: 'No se pudo actualizar el perfil.' }
  }

  revalidatePath('/dashboard/admin/usuarios')
  return { success: true, message: 'Perfil de usuario actualizado.' }
}
