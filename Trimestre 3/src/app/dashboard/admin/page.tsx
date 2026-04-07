import { createClient } from '@/lib/supabase/server'
import { Users, Shield, Trophy, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Consultar contadores desde el esquema public (Manejando fallos en caso de que estén vacíos o den error inicial)
  const [perfilesRes, jugadoresRes, partidosRes, entrenamientosRes] = await Promise.all([
    supabase.from('perfiles').select('*', { count: 'exact', head: true }),
    supabase.from('jugadores').select('*', { count: 'exact', head: true }),
    supabase.from('partidos').select('*', { count: 'exact', head: true }),
    supabase.from('entrenamientos').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      title: 'Usuarios Totales',
      value: perfilesRes.count || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Jugadores Registrados',
      value: jugadoresRes.count || 0,
      icon: Shield,
      color: 'bg-green-500',
    },
    {
      title: 'Partidos Programados',
      value: partidosRes.count || 0,
      icon: Trophy,
      color: 'bg-yellow-500',
    },
    {
      title: 'Entrenamientos Registrados',
      value: entrenamientosRes.count || 0,
      icon: Activity,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel Administrativo</h1>
        <span className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
          Admin
        </span>
      </div>
      
      <p className="text-gray-600 max-w-2xl text-lg">
        Bienvenido al entorno de administración. Aquí tienes un resumen general del estado del club deportivo.
      </p>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${item.color} bg-opacity-10`}>
                  <Icon className={`${item.color.replace('bg-', 'text-')}`} size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{item.value}</h3>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
