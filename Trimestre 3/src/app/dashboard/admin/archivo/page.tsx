import { createClient } from '@/lib/supabase/server'
import { Archive, RotateCcw, ShieldAlert, Users, Shield, Trophy, Activity } from 'lucide-react'
import { restaurarRegistro } from '@/services/actions/restaurar'

export default async function AdminArchivoPage() {
  const supabase = await createClient()

  // Consultar todas las entidades inactivas en paralelo para optimizar carga
  const [
    { data: jugadores },
    { data: equipos },
    { data: usuarios },
    { data: partidos },
    { data: entrenamientos }
  ] = await Promise.all([
    supabase.from('jugadores').select('*').eq('activo', false),
    supabase.from('rendimiento_equipos').select('*').eq('activo', false),
    supabase.from('perfiles').select('*').eq('activo', false),
    supabase.from('partidos').select('*').eq('estado', 'Cancelado'),
    supabase.from('entrenamientos').select('*').eq('activo', false)
  ])

  const sections = [
    { name: 'Jugadores', data: jugadores, icon: Users, table: 'jugadores', path: '/dashboard/admin/jugadores' },
    { name: 'Equipos', data: equipos, icon: Shield, table: 'rendimiento_equipos', path: '/dashboard/admin/equipos' },
    { name: 'Usuarios', data: usuarios, icon: RotateCcw, table: 'perfiles', path: '/dashboard/admin/usuarios' },
    { name: 'Partidos', data: partidos, icon: Trophy, table: 'partidos', path: '/dashboard/admin/partidos' },
    { name: 'Entrenamientos', data: entrenamientos, icon: Activity, table: 'entrenamientos', path: '/dashboard/admin/entrenamientos' },
  ]

  const totalInactivos = (jugadores?.length || 0) + (equipos?.length || 0) + (usuarios?.length || 0) + (partidos?.length || 0) + (entrenamientos?.length || 0)

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Archive className="text-gray-500" />
          Archivo del Club
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Repositorio central de registros inactivos y cancelados. Desde aquí puedes supervisar el historial o devolver elementos a la gestión activa.
        </p>
      </div>

      {totalInactivos === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <Archive size={32} />
          </div>
          <p className="text-gray-400 font-medium">El archivo se encuentra vacío actualmente.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sections.map((section) => (
            section.data && section.data.length > 0 && (
              <div key={section.name} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-l-4 border-red-500 pl-4">
                  <section.icon size={20} className="text-gray-400" />
                  <h2 className="text-xl font-bold text-gray-900">{section.name} Archivos</h2>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-mono">
                    {section.data.length}
                  </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-3">Referencia / Nombre</th>
                        <th className="px-6 py-3">Categoría / Info</th>
                        <th className="px-6 py-3 text-right">Acción de Recuperación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {section.data.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {item.nombre || item.equipo || item.titulo || item.equipo_local + ' vs ' + item.equipo_visitante || item.id}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {item.categoria || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <form action={restaurarRegistro}>
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="tabla" value={section.table} />
                              <input type="hidden" name="path" value={section.path} />
                              <button 
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium text-xs border border-green-200 shadow-sm"
                              >
                                <RotateCcw size={14} />
                                Restaurar
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}
