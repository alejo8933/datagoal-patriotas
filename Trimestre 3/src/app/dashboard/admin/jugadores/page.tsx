import { createClient } from '@/lib/supabase/server'
import { Users, ShieldAlert, Image as ImageIcon } from 'lucide-react'
import ModalCrearJugador from '@/components/features/jugadores/ModalCrearJugador'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarJugador from '@/components/features/jugadores/ModalEditarJugador'

export default async function AdminJugadoresPage() {
  const supabase = await createClient()

  // Fetching public.jugadores (solo activos)
  const { data: jugadores, error } = await supabase
    .from('jugadores')
    .select('*')
    .eq('activo', true)
    .order('apellido')

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="text-red-600" />
            Gestión de Jugadores
          </h1>
          <p className="text-gray-500 mt-1">Directorio de todos los jugadores de la academia.</p>
        </div>
        <ModalCrearJugador />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-500 flex flex-col items-center gap-2">
            <ShieldAlert size={32} />
            <p>Error al cargar jugadores: {error.message}</p>
          </div>
        ) : !jugadores?.length ? (
          <div className="p-12 text-center text-gray-500">
            <p>No hay jugadores registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Jugador</th>
                  <th className="px-6 py-4 font-medium text-center">Categoría</th>
                  <th className="px-6 py-4 font-medium text-center">Posición</th>
                  <th className="px-6 py-4 font-medium text-center">N°</th>
                  <th className="px-6 py-4 font-medium text-center">Goles</th>
                  <th className="px-6 py-4 font-medium text-center">Tarjetas A/R</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jugadores.map((jugador) => (
                  <tr key={jugador.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                          {jugador.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={jugador.foto_url} alt={jugador.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{jugador.nombre} {jugador.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {jugador.categoria || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{jugador.posicion || '--'}</td>
                    <td className="px-6 py-4 text-center text-gray-600 font-mono">{jugador.numero_camiseta || '-'}</td>
                    <td className="px-6 py-4 text-center text-gray-600 font-bold">{jugador.goles || 0}</td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span className="text-yellow-600 font-semibold">{jugador.tarjetas_amarillas || 0}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-red-600 font-semibold">{jugador.tarjetas_rojas || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <ModalEditarJugador jugador={jugador} />
                      <ModalEliminar 
                        tabla="jugadores" 
                        idRegistro={jugador.id} 
                        pathRevalidacion="/dashboard/admin/jugadores"
                        modo="inactivo"
                        etiqueta="Inhabilitar"
                        esIcono={true}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
