// src/app/dashboard/admin/page.tsx

import { createClient } from '@/lib/supabase/server'
import { Users, Shield, Trophy, Activity, TrendingUp, Calendar } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [perfilesRes, jugadoresRes, partidosRes, entrenamientosRes, torneosRes, lesionesRes] =
    await Promise.all([
      supabase.from('perfiles').select('*', { count: 'exact', head: true }),
      supabase.from('jugadores').select('*', { count: 'exact', head: true }),
      supabase.from('partidos').select('*', { count: 'exact', head: true }),
      supabase.from('entrenamientos').select('*', { count: 'exact', head: true }),
      supabase.from('torneos').select('*', { count: 'exact', head: true }),
      supabase.from('lesiones').select('*', { count: 'exact', head: true }),
    ])

  // Jugadores activos
  const { count: jugadoresActivos } = await supabase
    .from('jugadores')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true)

  // Próximos partidos
  const { data: proximosPartidos } = await supabase
    .from('partidos')
    .select('equipo_local, equipo_visitante, fecha, hora, lugar')
    .eq('estado', 'programado')
    .order('fecha', { ascending: true })
    .limit(3)

  const stats = [
    {
      title: 'Usuarios Registrados',
      value: perfilesRes.count ?? 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      title: 'Jugadores Activos',
      value: jugadoresActivos ?? 0,
      total: jugadoresRes.count ?? 0,
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      title: 'Partidos Registrados',
      value: partidosRes.count ?? 0,
      icon: Trophy,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    {
      title: 'Entrenamientos',
      value: entrenamientosRes.count ?? 0,
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      title: 'Torneos',
      value: torneosRes.count ?? 0,
      icon: TrendingUp,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      title: 'Lesiones Activas',
      value: lesionesRes.count ?? 0,
      icon: Calendar,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  ]

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Panel Administrativo
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Resumen general del estado del club
          </p>
        </div>
        <span className="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-full">
          Admin
        </span>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className={`bg-white/5 border ${item.border} rounded-xl p-5 hover:bg-white/10 transition`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${item.bg}`}>
                  <Icon className={item.color} size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {item.value}
                {'total' in item && (
                  <span className="text-base font-normal text-gray-500 ml-1">
                    / {item.total}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-400">{item.title}</p>
            </div>
          )
        })}
      </div>

      {/* Próximos partidos */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" />
          Próximos partidos
        </h2>

        {!proximosPartidos || proximosPartidos.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            No hay partidos programados
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {proximosPartidos.map((partido, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    {partido.equipo_local}{' '}
                    <span className="text-gray-500">vs</span>{' '}
                    {partido.equipo_visitante}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{partido.lugar}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{partido.fecha}</p>
                  <p className="text-xs text-gray-500">{partido.hora}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}