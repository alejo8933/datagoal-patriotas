import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminHeader from '@/components/layout/AdminHeader'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar el rol y datos del usuario en la tabla perfiles
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, nombre, apellido')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    redirect('/login')
  }

  if (perfil.rol !== 'admin') {
    // Si no es admin, lo devolvemos a su módulo correspondiente
    redirect(`/dashboard/${perfil.rol}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Fijo de 64 (256px) de ancho */}
      <AdminSidebar />

      {/* Contenedor Principal de la Derecha */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Header superior de Navegación y Perfil */}
        <AdminHeader 
          userId={user.id}
          email={user.email} 
          nombre={perfil.nombre || 'Administrador'} 
          apellido={perfil.apellido || ''} 
          rol={perfil.rol} 
        />

        {/* Contenido principal con padding interno */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
