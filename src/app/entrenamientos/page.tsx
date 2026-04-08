'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, X, Timer, TrendingUp } from 'lucide-react'

const STATS = [
  { icon: Calendar,   valor: '5',   label: 'Esta Semana',         sub: 'entrenamientos' },
  { icon: Users,      valor: '92%', label: 'Asistencia Promedio',  sub: 'jugadores'     },
  { icon: Timer,      valor: '28',  label: 'Horas Totales',        sub: 'esta semana'   },
  { icon: TrendingUp, valor: '8.1', label: 'Rendimiento',          sub: 'promedio'      },
]

const RECIENTES = [
  {
    id: '1',
    titulo: 'Entrenamiento Táctico',
    tipo: 'Táctico',
    categoria: 'Sub-17',
    fecha: '2026-04-02',
    hora: '09:00',
    lugar: 'Campo Principal',
    duracion: '120 minutos',
    asistencia: '22/25',
    porcentaje: '88%',
    entrenador: 'Carlos Rodríguez',
    objetivos: [
      'Trabajo en jugadas de pelota parada',
      'Presión alta coordinada',
      'Transiciones rápidas',
    ],
    observaciones: 'Buen trabajo en general. Se notó mejora en la presión alta respecto a la sesión anterior.',
  },
  {
    id: '2',
    titulo: 'Entrenamiento Físico',
    tipo: 'Físico',
    categoria: 'Sub-17',
    fecha: '2026-03-31',
    hora: '15:30',
    lugar: 'Gimnasio + Campo',
    duracion: '90 minutos',
    asistencia: '24/25',
    porcentaje: '96%',
    entrenador: 'Carlos Rodríguez',
    objetivos: [
      'Resistencia aeróbica',
      'Velocidad de reacción',
    ],
    observaciones: 'Excelente asistencia. Los jugadores respondieron bien a la carga física.',
  },
  {
    id: '3',
    titulo: 'Entrenamiento Técnico',
    tipo: 'Técnico',
    categoria: 'Sub-15',
    fecha: '2026-03-29',
    hora: '10:00',
    lugar: 'Campo Auxiliar',
    duracion: '105 minutos',
    asistencia: '20/22',
    porcentaje: '91%',
    entrenador: 'Jorge Méndez',
    objetivos: [
      'Control y conducción del balón',
      'Pases en corto y largo',
    ],
    observaciones: 'Se trabajó bien el primer toque. Pendiente reforzar pases largos.',
  },
]

const PROGRAMADOS = [
  {
    id: '4',
    titulo: 'Entrenamiento Táctico - Sub-17',
    tipo: 'Táctico',
    categoria: 'Sub-17',
    fecha: '2026-04-04',
    hora: '09:00',
    lugar: 'Campo Principal',
    duracion: '120 minutos',
    asistencia: '-',
    porcentaje: '-',
    entrenador: 'Carlos Rodríguez',
    objetivos: ['Por definir'],
    observaciones: 'Sesión pendiente de realizar.',
  },
  {
    id: '5',
    titulo: 'Entrenamiento Físico - Sub-15',
    tipo: 'Físico',
    categoria: 'Sub-15',
    fecha: '2026-04-06',
    hora: '15:30',
    lugar: 'Gimnasio',
    duracion: '90 minutos',
    asistencia: '-',
    porcentaje: '-',
    entrenador: 'Jorge Méndez',
    objetivos: ['Por definir'],
    observaciones: 'Sesión pendiente de realizar.',
  },
]

const TIPO_COLOR: Record<string, string> = {
  Táctico: 'bg-blue-100 text-blue-700',
  Físico:  'bg-orange-100 text-orange-700',
  Técnico: 'bg-green-100 text-green-700',
}

type Entrenamiento = typeof RECIENTES[0]

export default function EntrenamientosPage() {
  const [tab,          setTab]          = useState<'recientes' | 'programados'>('recientes')
  const [seleccionado, setSeleccionado] = useState<Entrenamiento | null>(null)
  const [tabDetalle,   setTabDetalle]   = useState<'objetivos' | 'observaciones'>('objetivos')

  const lista = tab === 'recientes' ? RECIENTES : PROGRAMADOS

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Título */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Entrenamientos</h1>
          <p className="text-base text-gray-500 mt-2">
            Gestión de sesiones de entrenamiento y seguimiento del rendimiento
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex justify-center mb-3">
                <s.icon size={28} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.valor}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
          <button
            onClick={() => setTab('recientes')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'recientes' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Entrenamientos Recientes
          </button>
          <button
            onClick={() => setTab('programados')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'programados' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Programados
          </button>
        </div>

        {/* Tarjetas — 2 columnas para que sean más anchas */}
        <div className="grid md:grid-cols-2 gap-6">
          {lista.map((e) => (
            <div key={e.id} className="rounded-lg border border-gray-200 p-6 flex flex-col gap-4">

              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-base">{e.titulo}</p>
                <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium ${TIPO_COLOR[e.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                  {e.tipo}
                </span>
              </div>

              <p className="text-sm text-gray-500">{e.categoria}</p>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} /> {e.fecha}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock size={14} /> {e.hora} · {e.duracion}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin size={14} /> {e.lugar}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Users size={14} /> {e.asistencia} jugadores · {e.porcentaje}
                </p>
              </div>

              <button
                onClick={() => { setSeleccionado(e); setTabDetalle('objetivos') }}
                className="mt-auto w-full rounded-md border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Ver Detalles →
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Modal — más grande */}
      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative">
            <button
              onClick={() => setSeleccionado(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{seleccionado.titulo}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {seleccionado.fecha} · {seleccionado.hora} · {seleccionado.lugar}
            </p>

            {/* Stats modal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Duración',   valor: seleccionado.duracion   },
                { label: 'Asistencia', valor: `${seleccionado.asistencia} (${seleccionado.porcentaje})` },
                { label: 'Ubicación',  valor: seleccionado.lugar      },
                { label: 'Entrenador', valor: seleccionado.entrenador },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{s.valor}</p>
                </div>
              ))}
            </div>

            {/* Tabs modal */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-5">
              <button
                onClick={() => setTabDetalle('objetivos')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  tabDetalle === 'objetivos' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Objetivos
              </button>
              <button
                onClick={() => setTabDetalle('observaciones')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  tabDetalle === 'observaciones' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Observaciones
              </button>
            </div>

            {tabDetalle === 'objetivos' ? (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Objetivos del Entrenamiento</p>
                <ol className="list-decimal list-inside space-y-2">
                  {seleccionado.objetivos.map((o, i) => (
                    <li key={i} className="text-sm text-gray-600">{o}</li>
                  ))}
                </ol>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Observaciones</p>
                <p className="text-sm text-gray-600 leading-relaxed">{seleccionado.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}