import { createClient } from '@/lib/supabase/client'
import type { Register } from '@/types/domain/auth.schema'
import { syncUserProfile, getUserProfile } from '../actions/auth'

export const authService = {
  async login(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Correo o contraseña incorrectos.')

    const perfil = await getUserProfile(data.user.id)

    return { user: data.user, rol: perfil?.rol ?? 'jugador' }
  },

  async register(fields: Register) {
    const supabase = createClient()
    
    // 1. Crear el usuario en el sistema de Autenticación
    const { data, error } = await supabase.auth.signUp({
      email:    fields.email,
      password: fields.password,
      options: {
        data: {
          rol:              fields.rol,
          nombre:           fields.nombre,
          apellido:         fields.apellido,
          telefono:         fields.telefono,
          fecha_nacimiento: fields.fechaNacimiento,
          posicion:         fields.posicion,
          categoria:        fields.categoria,
        },
      },
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('Este correo electrónico ya está registrado. Si es tu cuenta, intenta iniciar sesión.')
      }
      throw new Error('Error al registrar: ' + error.message)
    }
    if (!data.user) throw new Error('No se pudo crear el usuario.')

    // 2. Sincronización Inmediata con la tabla 'perfiles' usando Server Action
    // Esto asegura que el nombre y correo aparezcan en la tabla del admin, saltando RLS.
    const syncResult = await syncUserProfile({
      id:               data.user.id,
      email:            fields.email,
      nombre:           fields.nombre,
      apellido:         fields.apellido,
      rol:              fields.rol,
      telefono:         fields.telefono,
      fecha_nacimiento: fields.fechaNacimiento,
      posicion:         fields.posicion,
      categoria:        fields.categoria,
    })

    if (!syncResult.success) {
      console.error('Error sincronizando perfil:', syncResult.error)
      // No lanzamos error aquí para no bloquear el registro, ya que la cuenta ya se creó.
    }

    return data
  },

  async logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error('Error al cerrar sesión.')
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const perfil = await getUserProfile(user.id)

    return {
      id:     user.id,
      email:  user.email!,
      rol:    (perfil?.rol ?? 'jugador') as 'admin' | 'entrenador' | 'jugador',
      activo: perfil?.activo ?? true,
    }
  },

  async resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    })
    if (error) throw new Error('Error al enviar el correo de recuperación.')
  },

  async updatePassword(password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error('Error al actualizar la contraseña.')
  }
}