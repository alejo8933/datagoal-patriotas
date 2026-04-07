import { createClient } from '@/lib/supabase/server'
import { Shield, ShieldAlert } from 'lucide-react'
import ModalCrearEquipo from '@/components/features/equipos/ModalCrearEquipo'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarEquipo from '@/components/features/equipos/ModalEditarEquipo'

export default async function AdminEquiposPage() {
  const supabase = await createClient()

  // Intentamos obtener desde rendimiento_equipos (solo activos)
  const { data: equipos, error } = await supabase
    .from('rendimiento_equipos')
    .select('*')
    .eq('activo', true)
    .order('puntos', { ascending: false })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="text-red-600" />
            Gestión de Equipos
          </h1>
          <p className="text-gray-500 mt-1">Administra los equipos y revisa el rendimiento global de la cantera.</p>
        </div>
        <ModalCrearEquipo />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-500 flex flex-col items-center gap-2">
            <ShieldAlert size={32} />
            <p>Error al cargar equipos: {error.message}</p>
          </div>
        ) : !equipos?.length ? (
          <div className="p-12 text-center text-gray-500">
            <p>No hay equipos registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Equipo</th>
                  <th className="px-6 py-4 font-medium text-center">PJ</th>
                  <th className="px-6 py-4 font-medium text-center">PG</th>
                  <th className="px-6 py-4 font-medium text-center">PE</th>
                  <th className="px-6 py-4 font-medium text-center">PP</th>
                  <th className="px-6 py-4 font-medium text-center">GF</th>
                  <th className="px-6 py-4 font-medium text-center">GC</th>
                  <th className="px-6 py-4 font-medium text-center text-red-600">Pts</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {equipos.map((equipo) => (
                  <tr key={equipo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{equipo.equipo}</p>
                      <p className="text-xs text-gray-500">{equipo.categoria}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.partidos || 0}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.ganados || 0}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.empatados || 0}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.perdidos || 0}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.goles_favor || 0}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{equipo.goles_contra || 0}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{equipo.puntos || 0}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <ModalEditarEquipo equipo={equipo} />
                      <ModalEliminar 
                        tabla="rendimiento_equipos" 
                        idRegistro={equipo.id} 
                        pathRevalidacion="/dashboard/admin/equipos"
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
