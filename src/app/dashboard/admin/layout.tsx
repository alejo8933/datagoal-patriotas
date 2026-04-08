import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar el rol del usuario en la tabla perfiles
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    redirect('/login')
  }

  if (perfil.rol !== 'admin') {
    // Si no es admin, lo devolvemos a su módulo correspondiente
    redirect(`/dashboard/${perfil.rol}`)
  }

  return <>{children}</>
}
