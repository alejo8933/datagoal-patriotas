import { createClient } from '@/lib/supabase/server'
import { Shield, ShieldAlert, Trophy, Users, Star, Activity } from 'lucide-react'
import ModalCrearEquipo from '@/components/features/equipos/ModalCrearEquipo'
import CardEquipoPremium from '@/components/features/equipos/CardEquipoPremium'

export default async function AdminEquiposPage() {
  const supabase = await createClient()

  // Obtener equipos
  const { data: equipos, error } = await supabase
    .from('rendimiento_equipos')
    .select('*')
    .eq('activo', true)
    .order('puntos', { ascending: false })

  // Estadísticas globales (KPIs)
  const totalEquipos = equipos?.length || 0
  const totalPuntos = equipos?.reduce((acc, eq) => acc + (eq.puntos || 0), 0) || 0
  const mejorEquipo = equipos?.[0]?.equipo || 'Ninguno'

  const kpis = [
    { label: 'Equipos Activos', value: totalEquipos, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Puntos Totales', value: totalPuntos, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Líder de Cantera', value: mejorEquipo, icon: Trophy, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Rendimiento Global', value: '84%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Nuestros Equipos
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Descubre y gestiona las categorías que forman parte de la familia <span className="text-red-600 font-bold">Patriota Sport Bacatá</span>.
          </p>
        </div>
        <ModalCrearEquipo />
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={21} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
              <p className="text-lg font-black text-gray-900 truncate w-32 md:w-full font-sans">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TEAMS GRID */}
      <div>
        {error ? (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-[3rem] border border-red-100 flex flex-col items-center gap-4">
            <ShieldAlert size={48} className="animate-bounce" />
            <div className="max-w-xs">
              <p className="font-black uppercase text-xs tracking-widest mb-1">Error de Conexión</p>
              <p className="text-sm font-medium">{error.message}</p>
            </div>
          </div>
        ) : !equipos?.length ? (
          <div className="p-20 text-center text-gray-400 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
            <Shield size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg italic">Aún no hay equipos en el campo de juego.</p>
            <p className="text-sm">Comienza creando tu primera categoría competitiva.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {equipos.map((equipo) => (
              <CardEquipoPremium key={equipo.id} equipo={equipo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
