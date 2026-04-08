'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function crearUsuario(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()
  const rol = formData.get('rol')?.toString().trim()
  
  // Nuevos campos expandidos
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const telefono = formData.get('telefono')?.toString().trim()
  const fecha_nacimiento = formData.get('fecha_nacimiento')?.toString()
  const posicion = formData.get('posicion')?.toString()
  const categoria = formData.get('categoria')?.toString()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: 'Por favor, ingresa un correo electrónico válido.',
    }
  }

  if (!password || password.length < 8) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres para mayor seguridad.',
    }
  }

  const rolesPermitidos = ['admin', 'entrenador', 'jugador', 'auxiliar', 'coordinador']
  if (!rol || !rolesPermitidos.includes(rol)) {
    return {
      success: false,
      message: 'El rol seleccionado no es válido.',
    }
  }

  if (!nombre || !apellido) {
    return {
      success: false,
      message: 'Nombre y Apellido son obligatorios.',
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      success: false,
      message: 'Falta configuración del servidor (Service Role Key).',
    }
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  // 1. Crear el usuario en Auth (Identidad)
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      rol,
      nombre,
      apellido
    }
  })

  if (authError || !newUser.user) {
    return {
      success: false,
      message: 'Error creando la identidad: ' + (authError?.message || 'Fallo desconocido'),
    }
  }

  // 2. Crear/Actualizar el perfil con TODOS los datos
  const { error: profileError } = await supabaseAdmin
    .from('perfiles')
    .upsert([
      {
        id: newUser.user.id,
        rol,
        email,
        nombre,
        apellido,
        telefono,
        fecha_nacimiento,
        posicion: (rol === 'jugador') ? posicion : null,
        categoria: (rol !== 'admin') ? categoria : null,
        activo: true
      }
    ])

  if (profileError) {
    console.error('Error al guardar perfil:', profileError)
  }

  revalidatePath('/dashboard/admin/usuarios')

  return {
    success: true,
    message: `Perfil de ${rol} creado exitosamente.`,
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
  const telefono = formData.get('telefono')?.toString().trim()
  const fecha_nacimiento = formData.get('fecha_nacimiento')?.toString()
  const posicion = formData.get('posicion')?.toString()
  const categoria = formData.get('categoria')?.toString()

  if (!id || !rol) {
    return { success: false, message: 'ID y Rol son obligatorios.' }
  }

  if (telefono && (!/^\d+$/.test(telefono) || telefono.length < 7 || telefono.length > 15)) {
    return {
      success: false,
      message: 'El teléfono debe contener solo números (entre 7 y 15 dígitos).',
    }
  }

  const { error } = await supabaseAdmin
    .from('perfiles')
    .update({
      nombre: nombre || null,
      apellido: apellido || null,
      rol,
      telefono: telefono || null,
      fecha_nacimiento: fecha_nacimiento || null,
      posicion: (rol === 'jugador') ? (posicion || null) : null,
      categoria: (rol !== 'admin') ? (categoria || null) : null,
      activo: true
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando perfil:', error)
    return { success: false, message: 'No se pudo actualizar el perfil técnico: ' + error.message }
  }

  revalidatePath('/dashboard/admin/usuarios')
  return { success: true, message: 'Perfil de usuario actualizado con éxito.' }
}

export async function sincronizarPerfiles() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, message: 'Falta configurar la llave maestra (Service Role).' }
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Obtener todos los usuarios del sistema de Autenticación
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error('DEBUG - Error de Auth:', authError)
      return { success: false, message: 'No se pudo acceder a la lista de usuarios de Auth: ' + authError.message }
    }

    console.log(`DEBUG - Se encontraron ${users.length} usuarios en Auth.`)

    let errorsFound = []

    // 2. Procesar y sincronizar cada uno en la tabla de perfiles
    for (const u of users) {
      const metadata = u.user_metadata || {}
      console.log(`DEBUG - Sincronizando: ${u.email} (ID: ${u.id})`)
      
      const { error: upsertError } = await supabaseAdmin
        .from('perfiles')
        .upsert({
          id:               u.id,
          email:            u.email,
          nombre:           metadata.nombre || u.email?.split('@')[0] || 'Usuario',
          apellido:         metadata.apellido || '',
          rol:              metadata.rol || 'jugador',
          telefono:         metadata.telefono || null,
          fecha_nacimiento: metadata.fecha_nacimiento || null,
          posicion:         metadata.posicion || null,
          categoria:        metadata.categoria || null,
          activo:           true
        })

      if (upsertError) {
        console.error(`DEBUG - Error al hacer upsert para ${u.email}:`, upsertError)
        errorsFound.push(`${u.email}: ${upsertError.message}`)
      }
    }

    if (errorsFound.length > 0 && errorsFound.length === users.length) {
      return { success: false, message: 'Todos los registros fallaron: ' + errorsFound[0] }
    }

    revalidatePath('/dashboard/admin/usuarios')
    return { success: true, message: `Se han sincronizado ${users.length} usuarios.` }
  } catch (error: any) {
    console.error('Error sincronizando:', error)
    return { success: false, message: 'Error en la sincronización: ' + error.message }
  }
}
