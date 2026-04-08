import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EntrenadorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nombre =
    user.user_metadata?.full_name ??
    user.email?.split('@')[0] ??
    'Entrenador'

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {nombre} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Panel de gestión — Escuela Patriota Sport Bacatá
        </p>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            href: '/dashboard/entrenador/plantilla',
            icon: '👥',
            label: 'Plantilla',
            desc: 'Gestiona tus jugadores',
          },
          {
            href: '/dashboard/entrenador/entrenamientos',
            icon: '🏃',
            label: 'Entrenamientos',
            desc: 'Programa sesiones',
          },
          {
            href: '/dashboard/entrenador/partidos',
            icon: '⚽',
            label: 'Partidos',
            desc: 'Resultados y calendarios',
          },
          {
            href: '/dashboard/entrenador/estadisticas',
            icon: '📊',
            label: 'Estadísticas',
            desc: 'Rendimiento del equipo',
          },
        ].map(({ href, icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-red-200 group"
          >
            <span className="text-3xl">{icon}</span>
            <span className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
              {label}
            </span>
            <span className="text-xs text-gray-500">{desc}</span>
          </Link>
        ))}
      </div>

      {/* Descripción */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600 text-sm leading-relaxed">
          Desde aquí puedes gestionar tu plantilla, programar entrenamientos
          y consultar las estadísticas de tu categoría. Usa el menú superior
          para navegar entre secciones.
        </p>
      </div>

    </div>
  )
}