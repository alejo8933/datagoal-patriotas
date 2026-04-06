import { createClient } from '@/lib/supabase/client'
import type { Register } from '@/types/domain/auth.schema'

export const authService = {
  async login(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Correo o contraseña incorrectos.')

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol, activo')
      .eq('id', data.user.id)
      .single()

    return { user: data.user, rol: perfil?.rol ?? 'jugador' }
  },

  async register(fields: Register) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email:    fields.email,
      password: fields.password,
      options: {
        data: {
          nombre:           fields.nombre,
          apellido:         fields.apellido,
          telefono:         fields.telefono,
          fecha_nacimiento: fields.fechaNacimiento,
          posicion:         fields.posicion,
          categoria:        fields.categoria,
        },
      },
    })
    if (error) throw new Error('Error al registrar. Intenta con otro correo.')
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

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol, activo')
      .eq('id', user.id)
      .single()

    return {
      id:     user.id,
      email:  user.email!,
      rol:    (perfil?.rol ?? 'jugador') as 'admin' | 'entrenador' | 'jugador',
      activo: perfil?.activo ?? true,
    }
  },
}