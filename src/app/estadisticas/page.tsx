'use client'

import { useState } from 'react'
import { Trophy, Target, TrendingUp, Activity } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const HEADER_STATS = [
  { label: 'Puntos',      valor: '28',      sub: 'en 15 partidos' },
  { label: 'Goles',       valor: '24 - 16', sub: 'Diferencia: +8' },
  { label: 'Efectividad', valor: '53.3%',   sub: 'de victorias'   },
]

const DIST_DATA = [
  { name: 'Victorias', value: 8, color: '#22c55e' },
  { name: 'Empates',   value: 4, color: '#facc15' },
  { name: 'Derrotas',  value: 3, color: '#ef4444' },
]

const GOLES_MES = [
  { mes: 'Ene', goles: 4  },
  { mes: 'Feb', goles: 6  },
  { mes: 'Mar', goles: 8  },
  { mes: 'Abr', goles: 5  },
  { mes: 'May', goles: 9  },
  { mes: 'Jun', goles: 7  },
  { mes: 'Jul', goles: 12 },
  { mes: 'Ago', goles: 8  },
  { mes: 'Sep', goles: 6  },
]

const STATS_DETALLE = [
  { label: 'Victorias',         valor: 8,   pct: 53.3, sub: ''           },
  { label: 'Empates',           valor: 4,   pct: 26.7, sub: ''           },
  { label: 'Derrotas',          valor: 3,   pct: 20.0, sub: ''           },
  { label: 'Promedio de Goles', valor: 1.6, pct: null, sub: 'Por partido' },
]

const COMPARATIVA = [
  { mes: 'Ene', goles: 8,  asistencia: 88, calificacion: 7.8 },
  { mes: 'Feb', goles: 12, asistencia: 90, calificacion: 7.9 },
  { mes: 'Mar', goles: 15, asistencia: 89, calificacion: 8.0 },
  { mes: 'Abr', goles: 11, asistencia: 88, calificacion: 7.8 },
  { mes: 'May', goles: 18, asistencia: 91, calificacion: 8.1 },
  { mes: 'Jun', goles: 16, asistencia: 94, calificacion: 8.0 },
  { mes: 'Jul', goles: 20, asistencia: 95, calificacion: 8.2 },
  { mes: 'Ago', goles: 19, asistencia: 93, calificacion: 8.1 },
  { mes: 'Sep', goles: 19, asistencia: 95, calificacion: 8.1 },
]

const GOLEADORES = [
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-17', nombre: 'Carlos Martínez', goles: 8, prom: '0.7', partidos: 12 },
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-17', nombre: 'Luis García',      goles: 6, prom: '0.6', partidos: 10 },
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-17', nombre: 'Diego Rodríguez',  goles: 5, prom: '0.6', partidos: 8  },
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-15', nombre: 'Miguel Torres',    goles: 7, prom: '0.7', partidos: 10 },
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-15', nombre: 'Andrés Silva',     goles: 5, prom: '0.6', partidos: 8  },
  { torneo: 'Liga de Bogotá',  categoria: 'Sub-15', nombre: 'Juan Pablo',       goles: 4, prom: '0.7', partidos: 6  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-17', nombre: 'Carlos Martínez',  goles: 4, prom: '0.7', partidos: 6  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-17', nombre: 'Diego Rodríguez',  goles: 3, prom: '0.6', partidos: 5  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-17', nombre: 'Luis García',      goles: 2, prom: '0.5', partidos: 4  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-13', nombre: 'Santiago López',   goles: 6, prom: '0.8', partidos: 8  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-13', nombre: 'David Morales',    goles: 4, prom: '0.7', partidos: 6  },
  { torneo: 'Torneo Maracaná', categoria: 'Sub-13', nombre: 'Alejandro Ruiz',   goles: 3, prom: '0.6', partidos: 5  },
  { torneo: 'Torneo DBS',      categoria: 'Sub-15', nombre: 'Miguel Torres',    goles: 9, prom: '0.8', partidos: 12 },
  { torneo: 'Torneo DBS',      categoria: 'Sub-15', nombre: 'Andrés Silva',     goles: 7, prom: '0.7', partidos: 10 },
  { torneo: 'Torneo DBS',      categoria: 'Sub-15', nombre: 'Juan Pablo',       goles: 5, prom: '0.6', partidos: 8  },
  { torneo: 'Torneo DBS',      categoria: 'Sub-11', nombre: 'Mateo González',   goles: 8, prom: '0.8', partidos: 10 },
  { torneo: 'Torneo DBS',      categoria: 'Sub-11', nombre: 'Samuel Pérez',     goles: 6, prom: '0.8', partidos: 8  },
  { torneo: 'Torneo DBS',      categoria: 'Sub-11', nombre: 'Nicolás Vargas',   goles: 4, prom: '0.7', partidos: 6  },
]

const TORNEOS_GOLEADORES = ['Liga de Bogotá', 'Torneo Maracaná', 'Torneo DBS']

const RENDIMIENTO_POSICIONES = [
  { pos: 'Porteros',       stats: 'Atajadas: 85% · Goles recibidos: 1.1/partido',          cal: 8.0, color: 'text-blue-600'  },
  { pos: 'Defensores',     stats: 'Duelos ganados: 72% · Pases precisos: 84%',              cal: 7.5, color: 'text-green-600' },
  { pos: 'Mediocampistas', stats: 'Recuperaciones: 8.2/partido · Asistencias: 1.8/partido', cal: 7.8, color: 'text-blue-600'  },
  { pos: 'Delanteros',     stats: 'Goles: 1.8/partido · Tiros a puerta: 62%',               cal: 8.5, color: 'text-green-600' },
]

const ENTRENAMIENTOS_REND = [
  { tipo: 'Entrenamientos Técnicos', valor: 8.3 },
  { tipo: 'Entrenamientos Tácticos', valor: 7.9 },
  { tipo: 'Entrenamientos Físicos',  valor: 8.5 },
]

const TENDENCIAS = [
  'Mejora en precisión de pases (+5%)',
  'Aumento en asistencia a entrenamientos (+3%)',
  'Estable en efectividad goleadora',
]

export default function EstadisticasPage() {
  const [tab,          setTab]          = useState<'equipo' | 'goleadores' | 'rendimiento'>('equipo')
  const [torneoActivo, setTorneoActivo] = useState('Liga de Bogotá')

  const goleadoresFiltrados = GOLEADORES.filter(g => g.torneo === torneoActivo)
  const categorias = [...new Set(goleadoresFiltrados.map(g => g.categoria))]

  return (
    <div className="bg-white min-h-screen">
      {/* ← max-w-7xl para cuadros más anchos */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
          <p className="text-base text-gray-500 mt-2">
            Análisis detallado del rendimiento de Escuela Patriota Sport Bacatá en la temporada actual.
          </p>
        </div>

        {/* Header stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {HEADER_STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 p-7 text-center">
              <p className="text-3xl font-bold text-gray-900">{s.valor}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8">
          {[
            { key: 'equipo',      label: 'Estadísticas del Equipo' },
            { key: 'goleadores',  label: 'Goleadores'              },
            { key: 'rendimiento', label: 'Rendimiento Grupal'      },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: ESTADÍSTICAS DEL EQUIPO ── */}
        {tab === 'equipo' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-gray-200 p-7">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy size={18} className="text-gray-400" strokeWidth={1.5} />
                  Distribución de Resultados
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={DIST_DATA} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                      {DIST_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} partidos`]} />
                    <Legend formatter={(value, entry: any) => `${value}: ${entry.payload.value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg border border-gray-200 p-7">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-gray-400" strokeWidth={1.5} />
                  Goles por Mes
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={GOLES_MES} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="goles" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-7">
              <h2 className="font-semibold text-gray-800 mb-5">Estadísticas Detalladas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {STATS_DETALLE.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{s.label}</span>
                      <span className="font-bold text-gray-900">{s.valor}</span>
                    </div>
                    {s.pct !== null ? (
                      <>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{s.pct}%</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">{s.sub}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: GOLEADORES ── */}
        {tab === 'goleadores' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-6">
              {TORNEOS_GOLEADORES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTorneoActivo(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                    torneoActivo === t
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-6">
              {categorias.map((cat) => {
                const jugadores = goleadoresFiltrados.filter(g => g.categoria === cat)
                return (
                  <div key={cat} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700 text-sm">{cat}</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 border-b border-gray-100">
                          <th className="px-6 py-3 text-left">#</th>
                          <th className="px-6 py-3 text-left">Jugador</th>
                          <th className="px-6 py-3 text-center">Goles</th>
                          <th className="px-6 py-3 text-center">Prom/Partido</th>
                          <th className="px-6 py-3 text-center">Partidos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jugadores.map((j, i) => (
                          <tr key={j.nombre} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-6 py-3 font-medium text-gray-900">{j.nombre}</td>
                            <td className="px-6 py-3 text-center font-bold text-red-600">{j.goles}</td>
                            <td className="px-6 py-3 text-center text-gray-500">{j.prom}</td>
                            <td className="px-6 py-3 text-center text-gray-500">{j.partidos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TAB: RENDIMIENTO GRUPAL ── */}
        {tab === 'rendimiento' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-gray-200 p-7">
                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Activity size={18} className="text-gray-400" strokeWidth={1.5} />
                  Rendimiento por Posición
                </h2>
                <div className="space-y-3">
                  {RENDIMIENTO_POSICIONES.map((r) => (
                    <div key={r.pos} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{r.pos}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.stats}</p>
                      </div>
                      <div className="shrink-0 text-center">
                        <p className={`text-2xl font-bold ${r.color}`}>{r.cal.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">Calificación</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-lg border border-gray-200 p-7">
                  <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-gray-400" strokeWidth={1.5} />
                    Análisis de Entrenamientos
                  </h2>
                  <div className="flex gap-8 mb-5">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <p className="text-xs text-gray-400">Asistencia Promedio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">8.1</p>
                      <p className="text-xs text-gray-400">Rendimiento Promedio</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {ENTRENAMIENTOS_REND.map((e) => (
                      <div key={e.tipo}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">{e.tipo}</span>
                          <span className="text-gray-500 font-medium">{e.valor}/10</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${(e.valor / 10) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-7">
                  <h2 className="font-semibold text-gray-800 mb-4">Tendencias del Mes</h2>
                  <ul className="space-y-3">
                    {TENDENCIAS.map((t) => (
                      <li key={t} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">↑</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparativa Mensual */}
            <div className="rounded-lg border border-gray-200 p-7">
              <h2 className="font-semibold text-gray-800 mb-5">Comparativa Mensual del Equipo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={COMPARATIVA} margin={{ top: 5, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left"  type="monotone" dataKey="goles"        name="Goles"        stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="asistencia"   name="Asistencia %"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="left"  type="monotone" dataKey="calificacion" name="Calificación"  stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}