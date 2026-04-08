import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LesionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesionesRaw } = await supabase
    .from('lesiones')
    .select('id, descripcion, estado, fecha_lesion, fecha_retorno, jugador_id, jugadores(nombre, apellido, numero, posicion)')
    .order('fecha_lesion', { ascending: false })

  // ✅ Siempre array, nunca null
  const lesiones = lesionesRaw ?? []

  const activas  = lesiones.filter(l => l.estado === 'activo')
  const cerradas = lesiones.filter(l => l.estado !== 'activo')

  const estadoBadge = (estado: string) => {
    if (estado === 'activo')           return 'bg-red-100 text-red-600'
    if (estado === 'en_recuperacion')  return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const estadoLabel = (estado: string) => {
    if (estado === 'activo')           return 'Lesionado'
    if (estado === 'en_recuperacion')  return 'En recuperación'
    return 'Recuperado'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🏥 Registro de Lesiones
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Control y seguimiento de lesiones del plantel</p>
        </div>
        {activas.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
            {activas.length} lesión{activas.length > 1 ? 'es' : ''} activa{activas.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {activas.length > 0 && (
        <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚠️ Lesiones Activas
          </h2>
          <div className="space-y-3">
            {activas.map((l: any) => {
              const j = l.jugadores
              return (
                <div key={l.id} className="flex items-start gap-4 rounded-lg bg-red-50 border border-red-100 p-4">
                  <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-sm font-bold text-red-700 flex-shrink-0">
                    #{j?.numero}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{j?.nombre} {j?.apellido}</p>
                      <span className="text-xs text-gray-400">{j?.posicion}</span>
                      <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${estadoBadge(l.estado)}`}>
                        {estadoLabel(l.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{l.descripcion}</p>
                    <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
                      {l.fecha_lesion && (
                        <span>📅 Desde: {new Date(l.fecha_lesion).toLocaleDateString('es-CO')}</span>
                      )}
                      {l.fecha_retorno && (
                        <span>🔄 Retorno est.: {new Date(l.fecha_retorno).toLocaleDateString('es-CO')}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">📋 Historial de Lesiones</h2>
        {lesiones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🏥</p>
            <p className="text-gray-500 font-medium">No hay lesiones registradas</p>
            <p className="text-sm text-gray-400 mt-1">El historial de lesiones aparecerá aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jugador</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Lesión</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Fecha</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Retorno</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lesiones.map((l: any) => {
                  const j = l.jugadores
                  return (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            #{j?.numero}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{j?.nombre} {j?.apellido}</p>
                            <p className="text-xs text-gray-400">{j?.posicion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs">
                        <p className="truncate">{l.descripcion}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block text-xs rounded-full px-2.5 py-0.5 font-medium ${estadoBadge(l.estado)}`}>
                          {estadoLabel(l.estado)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400 text-xs">
                        {l.fecha_lesion ? new Date(l.fecha_lesion).toLocaleDateString('es-CO') : '—'}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-400 text-xs">
                        {l.fecha_retorno ? new Date(l.fecha_retorno).toLocaleDateString('es-CO') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
