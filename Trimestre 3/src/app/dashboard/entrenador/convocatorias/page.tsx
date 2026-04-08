import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ConvocatoriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: convocatorias } = await supabase
    .from('convocatorias')
    .select('id, fecha, partido_id, partidos(rival, fecha), convocatoria_jugadores(jugador_id, jugadores(nombre, apellido, numero, posicion))')
    .order('fecha', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            👥 Convocatorias
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona las convocatorias para los partidos</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {(convocatorias?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500 font-medium">No hay convocatorias registradas</p>
            <p className="text-sm text-gray-400 mt-1">Las convocatorias aparecerán aquí una vez que las crees</p>
          </div>
        ) : (
          <div className="space-y-4">
            {convocatorias!.map((c: any) => (
              <div key={c.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      vs {c.partidos?.rival ?? 'Sin rival'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.partidos?.fecha
                        ? new Date(c.partidos.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                        : 'Sin fecha'}
                    </p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2.5 py-1 font-medium">
                    {c.convocatoria_jugadores?.length ?? 0} jugadores
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(c.convocatoria_jugadores ?? []).map((cj: any) => (
                    <span key={cj.jugador_id} className="text-xs bg-gray-100 text-gray-700 rounded-lg px-2.5 py-1">
                      #{cj.jugadores?.numero} {cj.jugadores?.nombre} {cj.jugadores?.apellido}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
