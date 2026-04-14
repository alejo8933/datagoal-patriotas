import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PanelCharts from '@/components/entrenador/PanelCharts'

export default async function JugadorEstadisticasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: jugadorInfo } = await supabase
    .from('jugadores')
    .select('id, nombre, apellido, goles, asistencias')
    .eq('user_id', user.id)
    .maybeSingle()

  // Intentamos obtener evaluaciones técnicas para mostrar el radar chart (vía PanelCharts)
  const { data: evaluaciones } = await supabase
    .from('evaluaciones')
    .select('*')
    .eq('jugador_id', jugadorInfo?.id || '')
    .order('created_at', { ascending: false })

  const ultimaEv = evaluaciones?.[0]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">📊 Rendimiento y Estadísticas</h1>
        <p className="text-sm text-gray-500 mt-1">Análisis detallado de tu progreso técnico y físico en la escuela.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar de Habilidades / Gráficas */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-500 rounded-full" />
              Evolución Técnica
            </h2>
            <PanelCharts />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Última Evaluación</h3>
              {ultimaEv ? (
                <div className="space-y-4">
                  {[
                    { label: 'Técnica', val: ultimaEv.tecnica, color: 'bg-blue-500' },
                    { label: 'Física', val: ultimaEv.fisica, color: 'bg-green-500' },
                    { label: 'Táctica', val: ultimaEv.tactica, color: 'bg-purple-500' },
                    { label: 'Mental', val: ultimaEv.mental, color: 'bg-orange-500' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{stat.label}</span>
                        <span>{stat.val}/10</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color}`} style={{ width: `${stat.val * 10}%` }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 mt-4 italic border-t pt-4">Fecha: {new Date(ultimaEv.created_at).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-400 text-sm">Aún no tienes evaluaciones registradas por el profesor.</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <span className="text-9xl italic font-black">DG</span>
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Records Personales</h3>
                <div className="flex items-center justify-around text-center">
                    <div>
                        <p className="text-4xl font-black text-red-500">{jugadorInfo?.goles ?? 0}</p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Goles</p>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div>
                        <p className="text-4xl font-black text-blue-400">{jugadorInfo?.asistencias ?? 0}</p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Asistencias</p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                   <p className="text-xs text-white/50 text-center">Sigue trabajando para mejorar tus números esta temporada.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Logros o Alertas */}
        <div className="space-y-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-4">🏆 Logros Obtenidos</h2>
                <div className="space-y-4">
                   {[
                       { icon: '⭐', label: 'Compromiso 100%', sub: 'Asistencia perfecta este mes' },
                       { icon: '🔥', label: 'Goleador', sub: 'Más de 5 goles en el torneo' },
                       { icon: '🛡️', label: 'Muralla', sub: 'Destacado por defensa técnica' },
                   ].map((logro, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/30">
                           <span className="text-xl">{logro.icon}</span>
                           <div>
                               <p className="text-xs font-bold text-gray-800">{logro.label}</p>
                               <p className="text-[10px] text-gray-400">{logro.sub}</p>
                           </div>
                       </div>
                   ))}
                </div>
            </div>

            <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg relative overflow-hidden group">
                <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Consejo Técnico</h3>
                <p className="text-sm font-medium leading-relaxed italic relative z-10">
                   "La disciplina del entrenamiento hoy es tu ventaja táctica el día del partido. No descuides el trabajo físico después de la sesión."
                </p>
                <div className="absolute right-2 bottom-2 text-white/10 text-6xl group-hover:rotate-12 transition-transform">⚽</div>
            </div>
        </div>

      </div>
    </div>
  )
}
