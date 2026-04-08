import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EvaluacionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: evaluaciones } = await supabase
    .from('evaluaciones')
    .select('id, created_at, tecnica, fisica, tactica, mental, notas, jugador_id, jugadores(nombre, apellido, numero, posicion)')
    .order('created_at', { ascending: false })
    .limit(20)

  const getColor = (val: number) => {
    if (val >= 8) return 'text-green-600 bg-green-50'
    if (val >= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📊 Evaluación de Jugadores
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Historial de evaluaciones técnicas y físicas</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {(evaluaciones?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-500 font-medium">No hay evaluaciones registradas</p>
            <p className="text-sm text-gray-400 mt-1">Registra la primera evaluación para comenzar el seguimiento</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Jugador</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Técnica</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Física</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Táctica</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Mental</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Promedio</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {evaluaciones!.map((ev: any) => {
                  const prom = ((ev.tecnica + ev.fisica + ev.tactica + ev.mental) / 4).toFixed(1)
                  const j = ev.jugadores
                  return (
                    <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                            #{j?.numero}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{j?.nombre} {j?.apellido}</p>
                            <p className="text-xs text-gray-400">{j?.posicion}</p>
                          </div>
                        </div>
                      </td>
                      {[ev.tecnica, ev.fisica, ev.tactica, ev.mental].map((v, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold ${getColor(v)}`}>
                            {v}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-sm font-bold ${getColor(parseFloat(prom))}`}>
                          {prom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(ev.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
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
