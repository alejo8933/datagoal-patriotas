import { createClient } from '@/lib/supabase/server'
import { Trophy, MapPin, CalendarDays, Clock, ShieldAlert } from 'lucide-react'
import ModalCrearPartido from '@/components/features/partidos/ModalCrearPartido'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarPartido from '@/components/features/partidos/ModalEditarPartido'

export default async function AdminPartidosPage() {
  const supabase = await createClient()

  // Fetching public.partidos (solo programados o finalizados)
  const { data: partidos, error } = await supabase
    .from('partidos')
    .select('*')
    .neq('estado', 'Cancelado')
    .order('fecha', { ascending: false })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy className="text-red-600" />
            Gestión de Partidos
          </h1>
          <p className="text-gray-500 mt-1">Programa y registra los resultados de partidos oficiales y amistosos.</p>
        </div>
        <ModalCrearPartido />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-500 flex flex-col items-center gap-2">
            <ShieldAlert size={32} />
            <p>Error al cargar partidos: {error.message}</p>
          </div>
        ) : !partidos?.length ? (
          <div className="p-12 text-center text-gray-500">
            <p>No hay partidos programados actualmente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partidos.map((partido) => (
              <div key={partido.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    partido.estado === 'Finalizado' ? 'bg-green-100 text-green-700' : 
                    partido.estado === 'Programado' ? 'bg-blue-100 text-blue-700' : 
                    partido.estado === 'Cancelado' ? 'bg-red-100 text-red-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {partido.estado || 'Programado'}
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium">
                    {partido.categoria || 'Cat'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-center mb-6 px-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 truncate">{partido.equipo_local}</p>
                  </div>
                  <div className="px-4">
                    <div className="bg-gray-900 text-white font-mono text-xl font-bold px-3 py-1 rounded-lg">
                      {partido.goles_local ?? '-'} : {partido.goles_visitante ?? '-'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 truncate">{partido.equipo_visitante}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-gray-400" />
                    <span>{partido.fecha}</span>
                  </div>
                  {partido.hora && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>{partido.hora}</span>
                    </div>
                  )}
                  {partido.lugar && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{partido.lugar}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap justify-end gap-2">
                  <ModalEditarPartido partido={partido} />
                  <ModalEditarPartido partido={partido} soloResultado={true} />
                  <ModalEliminar 
                    tabla="partidos" 
                    idRegistro={partido.id} 
                    pathRevalidacion="/dashboard/admin/partidos"
                    modo="cancelado"
                    etiqueta="Cancelar"
                    esIcono={true}
                  />
                </div>
              </div>
            ))}
          </div>
        ) }
      </div>
    </div>
  )
}
