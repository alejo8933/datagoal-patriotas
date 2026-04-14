'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { Player } from '@/types/domain/player.schema'

interface AnalisisIndividualViewProps {
  jugadores: Player[]
  categoriasDisponibles: string[]
}

// Emulación determinista basada en el nombre para consistencia visual
function hashName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

type TabType = 'general' | 'rendimiento' | 'comparacion' | 'analisis'

export function AnalisisIndividualView({ jugadores, categoriasDisponibles }: AnalisisIndividualViewProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string>(categoriasDisponibles[0] || 'Todas')
  const [activeTab, setActiveTab] = useState<TabType>('general')

  // Filtramos los jugadores por la categoría seleccionada
  const jugadoresCategoria = useMemo(() => {
    if (selectedCategoria === 'Todas') return jugadores
    return jugadores.filter(j => j.categoria === selectedCategoria)
  }, [jugadores, selectedCategoria])

  // Datos extendidos generados de forma determinista para la UI prototipo
  const chartData = useMemo(() => {
    return jugadoresCategoria.map(j => {
      const hashData = Math.abs(hashName(j.nombre + j.apellido))
      const calificacion = 6 + (hashData % 40) / 10 // 6.0 a 10.0
      const asistencia = 60 + (hashData % 41)       // 60% a 100%
      const precisionPases = 65 + (hashData % 30)   // 65% a 95%
      const minPartido = 45 + (hashData % 45)       // 45 a 90 min
      const partidosJugados = j.goles > 0 ? (j.goles + (hashData % 10)) : (hashData % 15)
      const isLesionado = (hashData % 10) === 0
      const diasLesion = (hashData % 15) + 1

      // Evaluación heurística
      const disciplinas = ['Excelente', 'Buena', 'Regular']
      const disciplinasIdx = hashData % 3
      const condiciones = ['Excelente', 'Óptima', 'Regular']
      const condicionesIdx = (hashData + 1) % 3

      return {
        ...j,
        nombreCompleto: `${j.nombre} ${j.apellido}`,
        goles: j.goles || 0,
        asistencias: j.asistencias || 0,
        calificacion: Number(calificacion.toFixed(1)),
        asistencia_entrenamientos: asistencia,
        precision_pases: precisionPases,
        minutos_partido: minPartido,
        partidos: partidosJugados,
        estado: isLesionado ? `Lesionado ${diasLesion}d` : 'Disponible',
        isLesionado,
        disciplina: disciplinas[disciplinasIdx],
        compromiso: 'Excelente', // mock estático
        condicionFisica: condiciones[condicionesIdx]
      }
    })
  }, [jugadoresCategoria])

  // Estados para selectores en pestañas secundarias
  const [compJug1, setCompJug1] = useState<string>('')
  const [compJug2, setCompJug2] = useState<string>('')
  const [analisisJugador, setAnalisisJugador] = useState<string>('')

  // Reseteamos las selecciones cuando se cambia de categoría
  useEffect(() => {
    setCompJug1('')
    setCompJug2('')
    setAnalisisJugador('')
  }, [selectedCategoria])

  // Máximos para Vista General
  const maxGoleador = [...chartData].sort((a, b) => b.goles - a.goles)[0]
  const maxAsistencias = [...chartData].sort((a, b) => b.asistencias - a.asistencias)[0]
  const mejorCalificacion = [...chartData].sort((a, b) => b.calificacion - a.calificacion)[0]
  const mejorAsistencia = [...chartData].sort((a, b) => b.asistencia_entrenamientos - a.asistencia_entrenamientos)[0]

  return (
    <div className="w-full">
      {/* Header e interacciones Globales (siempre visibles) */}
      <div className="mb-6">
        <Link 
          href="/dashboard/estadisticas" 
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-4"
        >
          ← Volver a Estadísticas
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análisis Individual de Jugadores</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Rendimiento detallado y estadísticas personalizadas por jugador
            </p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Categoría:</span>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="text-sm font-semibold text-gray-900 border-none outline-none focus:ring-0 cursor-pointer bg-transparent"
            >
              <option value="Todas">Todas las Categorías</option>
              {categoriasDisponibles.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navegación del Prototipo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
        <div className="flex flex-wrap lg:flex-nowrap w-full">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Vista General
          </button>
          <button 
            onClick={() => setActiveTab('rendimiento')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'rendimiento' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Rendimiento
          </button>
          <button 
            onClick={() => setActiveTab('comparacion')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'comparacion' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Comparación
          </button>
          <button 
            onClick={() => setActiveTab('analisis')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'analisis' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Análisis Individual
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No hay jugadores registrados en esta categoría para analizar.
        </div>
      ) : (
        <>
          {/* TAB: VISTA GENERAL */}
          {activeTab === 'general' && (
            <div>
              {/* Tarjetas Superiores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-red-600 font-medium text-sm mb-4">
                    <span>⚽</span> Máximo Goleador
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{maxGoleador?.nombreCompleto || 'N/A'}</h3>
                  <p className="text-gray-500 text-sm">{maxGoleador?.goles || 0} goles</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-4">
                     <span>📈</span> Más Asistencias
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{maxAsistencias?.nombreCompleto || 'N/A'}</h3>
                  <p className="text-gray-500 text-sm">{maxAsistencias?.asistencias || 0} asistencias</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-4">
                     <span>⭐</span> Mejor Calificación
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mejorCalificacion?.nombreCompleto || 'N/A'}</h3>
                  <p className="text-gray-500 text-sm">{mejorCalificacion?.calificacion || '0'} promedio</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-purple-600 font-medium text-sm mb-4">
                     <span>⏱</span> Mejor Asistencia
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mejorAsistencia?.nombreCompleto || 'N/A'}</h3>
                  <p className="text-gray-500 text-sm">{mejorAsistencia?.asistencia_entrenamientos || 0}% entrenamientos</p>
                </div>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-gray-900 font-medium mb-6">Goles vs Asistencias</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#F3F4F6'}} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar dataKey="goles" name="Goles" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="asistencias" name="Asistencias" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-gray-900 font-medium mb-6">Calificación vs Asistencia a Entrenamientos</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[0, 10]} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[0, 100]} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Line yAxisId="left" type="monotone" dataKey="calificacion" name="Calificación (0-10)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="asistencia_entrenamientos" name="Asistencia (%)" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RENDIMIENTO */}
          {activeTab === 'rendimiento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chartData.map(j => (
                <div key={j.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                  {/* Encabezado Tarjeta */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                        {j.nombre.charAt(0)}{j.apellido.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{j.nombreCompleto}</h4>
                        <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded bg-red-50 text-red-600 block w-fit mt-1">
                          {j.posicion || 'Jugador'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">{j.calificacion}</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-y-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-600">{j.goles}</div>
                      <div className="text-xs text-gray-500">Goles</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{j.asistencias}</div>
                      <div className="text-xs text-gray-500">Asistencias</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{j.partidos}</div>
                      <div className="text-xs text-gray-500">Partidos</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{j.minutos_partido}</div>
                      <div className="text-xs text-gray-500">Min/Partido</div>
                    </div>
                  </div>

                  {/* Barras de Progreso */}
                  <div className="mb-6 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">Precisión de Pases</span>
                        <span className="font-semibold text-gray-900">{j.precision_pases}%</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-1.5"><div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${j.precision_pases}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">Asistencia Entrenamientos</span>
                        <span className="font-semibold text-gray-900">{j.asistencia_entrenamientos}%</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-1.5"><div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${j.asistencia_entrenamientos}%` }}></div></div>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${j.isLesionado ? 'bg-red-600 text-white' : 'bg-red-600 text-white'}`}>
                      {j.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: COMPARACIÓN */}
          {activeTab === 'comparacion' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-gray-900 font-medium mb-4">Comparación de Jugadores</h3>
              <div className="flex gap-4 mb-8">
                <select value={compJug1} onChange={(e) => setCompJug1(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-auto p-2.5">
                  <option value="">Seleccionar jugador 1</option>
                  {chartData.map(j => <option key={j.id} value={j.id}>{j.nombreCompleto}</option>)}
                </select>
                <select value={compJug2} onChange={(e) => setCompJug2(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-auto p-2.5">
                  <option value="">Seleccionar jugador 2</option>
                  {chartData.map(j => <option key={j.id} value={j.id}>{j.nombreCompleto}</option>)}
                </select>
              </div>

              {compJug1 && compJug2 ? (
                (() => {
                  const p1 = chartData.find(j => j.id === compJug1)
                  const p2 = chartData.find(j => j.id === compJug2)

                  if (!p1 || !p2) return null

                  return (
                    <div className="grid grid-cols-3 gap-0 text-center items-center border-t border-gray-100 pt-6 mt-4">
                      {/* Jugador 1 Info */}
                      <div className="pb-4">
                        <h4 className="font-bold text-gray-900 mb-6 text-left">{p1.nombreCompleto}</h4>
                        <div className="font-bold text-gray-900 text-left py-2">{p1.goles}</div>
                        <div className="font-bold text-gray-900 text-left py-2">{p1.asistencias}</div>
                        <div className="font-bold text-gray-900 text-left py-2">{p1.calificacion}</div>
                        <div className="font-bold text-gray-900 text-left py-2">{p1.precision_pases}%</div>
                      </div>
                      
                      {/* Enlace estático central */}
                      <div className="pb-4 border-l border-r border-gray-100 px-4">
                        <h4 className="font-bold text-gray-900 mb-6 opacity-0">vs</h4>
                        <div className="text-gray-500 text-sm py-2">Goles</div>
                        <div className="text-gray-500 text-sm py-2">Asistencias</div>
                        <div className="text-gray-500 text-sm py-2">Calificación Promedio</div>
                        <div className="text-gray-500 text-sm py-2">Precisión de Pases</div>
                      </div>

                      {/* Jugador 2 Info */}
                      <div className="pb-4">
                        <h4 className="font-bold text-gray-900 mb-6 text-right">{p2.nombreCompleto}</h4>
                        <div className="font-bold text-gray-900 text-right py-2">{p2.goles}</div>
                        <div className="font-bold text-gray-900 text-right py-2">{p2.asistencias}</div>
                        <div className="font-bold text-gray-900 text-right py-2">{p2.calificacion}</div>
                        <div className="font-bold text-gray-900 text-right py-2">{p2.precision_pases}%</div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center text-gray-400 py-12">Por favor, selecciona dos jugadores para comparar.</div>
              )}
            </div>
          )}

          {/* TAB: ANÁLISIS INDIVIDUAL / DETALLADO */}
          {activeTab === 'analisis' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-gray-900 font-medium mb-4">Análisis Individual Detallado</h3>
              <select 
                value={analisisJugador} 
                onChange={(e) => setAnalisisJugador(e.target.value)} 
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-1/4 p-2.5 mb-8"
              >
                <option value="">Seleccionar jugador</option>
                {chartData.map(j => <option key={j.id} value={j.id}>{j.nombreCompleto}</option>)}
              </select>

              {analisisJugador ? (
                (() => {
                  const j = chartData.find(x => x.id === analisisJugador)
                  
                  if (!j) return null

                  const radarData = [
                    { subject: 'Goles', A: (j.goles > 15 ? 100 : (j.goles / 15) * 100) || 10 },
                    { subject: 'Asistencias', A: (j.asistencias > 15 ? 100 : (j.asistencias / 15) * 100) || 10 },
                    { subject: 'Precisión Pases', A: j.precision_pases },
                    { subject: 'Calificación', A: (j.calificacion / 10) * 100 },
                    { subject: 'Asistencia', A: j.asistencia_entrenamientos },
                    { subject: 'Disciplina', A: j.disciplina === 'Excelente' ? 95 : (j.disciplina === 'Buena' ? 75 : 50) }
                  ]

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Datos de Perfil */}
                      <div>
                        <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Perfil del Jugador - {j.nombreCompleto}</h4>
                        
                        <div className="grid grid-cols-2 gap-y-6 mb-8">
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Posición:</span>
                            <span className="font-semibold text-gray-900">{j.posicion || 'Jugador'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Categoría:</span>
                            <span className="font-semibold text-gray-900">{j.categoria}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Partidos Jugados:</span>
                            <span className="font-semibold text-gray-900">{j.partidos}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Minutos Totales:</span>
                            <span className="font-semibold text-gray-900">{j.partidos * j.minutos_partido}</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Evaluación de Rendimiento</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Efectividad Goleadora:</span>
                            <span className="text-sm font-bold text-green-600">{j.goles > 5 ? 'Excelente' : (j.goles > 2 ? 'Buena' : 'Regular')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Disciplina:</span>
                            <span className="text-sm font-bold text-green-600">{j.disciplina}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Compromiso:</span>
                            <span className="text-sm font-bold text-green-600">{j.compromiso}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Condición Física:</span>
                            <span className="text-sm font-bold text-green-600">{j.condicionFisica}</span>
                          </div>
                        </div>
                      </div>

                      {/* Gráfico de Radar */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-center mb-4">Radar de Rendimiento</h4>
                        <div className="w-full h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                              <PolarGrid stroke="#E5E7EB" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Radar name={j.nombreCompleto} dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  )
                })()
              ) : (
                <div className="text-center text-gray-400 py-12">Por favor, selecciona un jugador para analizar su rendimiento.</div>
              )}
            </div>
          )}

        </>
      )}

    </div>
  )
}
