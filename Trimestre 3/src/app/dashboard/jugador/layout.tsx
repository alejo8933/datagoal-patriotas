import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'
import HeaderJugador from '@/components/layout/HeaderJugador'

export default async function JugadorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    redirect('/login')
  }

  if (perfil.rol !== 'jugador') {
    redirect(`/dashboard/${perfil.rol}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderJugador />
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  )
}
