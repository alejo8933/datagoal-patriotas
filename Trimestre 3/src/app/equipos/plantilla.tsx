'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

type Equipo = {
  nombre: string
  categoria: string
  sub: string
  dt: string
}

const STATS_SUB17 = [
  { label: 'Jugadores', valor: '6', sub: 'Total'     },
  { label: 'Edad Prom.', valor: '26', sub: 'años'    },
  { label: 'Goles',     valor: '26', sub: 'Total'    },
  { label: 'Asistencias', valor: '22', sub: 'Total'  },
  { label: 'Disponibles', valor: '5', sub: 'Jugadores' },
  { label: 'Lesionados',  valor: '0', sub: 'Jugadores' },
]

const JUGADORES = [
  {
    id: '1',
    nombre: 'Carlos Martínez',
    iniciales: 'CM',
    numero: 9,
    posicion: 'Delantero Centro',
    grupo: 'Delanteros',
    estado: 'Disponible',
    edad: 24,
    altura: '1.82m',
    peso: '78kg',
    nacionalidad: 'Colombia',
    calificacion: 8.2,
    goles: 12,
    asistencias: 4,
    partidos: 15,
  },
  {
    id: '2',
    nombre: 'Luis García',
    iniciales: 'LG',
    numero: 10,
    posicion: 'Mediocampista Ofensivo',
    grupo: 'Mediocampistas',
    estado: 'Disponible',
    edad: 27,
    altura: '1.75m',
    peso: '72kg',
    nacionalidad: 'Colombia',
    calificacion: 7.8,
    goles: 6,
    asistencias: 8,
    partidos: 14,
  },
  {
    id: '3',
    nombre: 'Diego Rodríguez',
    iniciales: 'DR',
    numero: 7,
    posicion: 'Extremo Derecho',
    grupo: 'Delanteros',
    estado: 'Recuperación',
    edad: 22,
    altura: '1.78m',
    peso: '75kg',
    nacionalidad: 'Colombia',
    calificacion: 7.5,
    goles: 5,
    asistencias: 6,
    partidos: 13,
  },
  {
    id: '4',
    nombre: 'Miguel Santos',
    iniciales: 'MS',
    numero: 1,
    posicion: 'Portero',
    grupo: 'Porteros',
    estado: 'Disponible',
    edad: 29,
    altura: '1.88m',
    peso: '85kg',
    nacionalidad: 'Colombia',
    calificacion: 7.9,
    goles: 0,
    asistencias: 0,
    partidos: 15,
  },
  {
    id: '5',
    nombre: 'Andrés Castillo',
    iniciales: 'AC',
    numero: 4,
    posicion: 'Defensa Central',
    grupo: 'Defensores',
    estado: 'Disponible',
    edad: 26,
    altura: '1.85m',
    peso: '82kg',
    nacionalidad: 'Colombia',
    calificacion: 7.2,
    goles: 2,
    asistencias: 1,
    partidos: 14,
  },
  {
    id: '6',
    nombre: 'Javier Moreno',
    iniciales: 'JM',
    numero: 6,
    posicion: 'Mediocampista Defensivo',
    grupo: 'Mediocampistas',
    estado: 'Disponible',
    edad: 25,
    altura: '1.80m',
    peso: '77kg',
    nacionalidad: 'Colombia',
    calificacion: 7.4,
    goles: 1,
    asistencias: 3,
    partidos: 15,
  },
]

const FILTROS = ['Todos los Jugadores', 'Delanteros', 'Mediocampistas', 'Defensores', 'Porteros']

const ESTADO_COLOR: Record<string, string> = {
  Disponible:    'bg-green-100 text-green-700',
  Recuperación:  'bg-yellow-100 text-yellow-700',
  Lesionado:     'bg-red-100 text-red-700',
}

export default function PlantillaPage({
  equipo,
  onVolver,
}: {
  equipo: Equipo
  onVolver: () => void
}) {
  const [filtro, setFiltro] = useState('Todos los Jugadores')

  const jugadoresFiltrados =
    filtro === 'Todos los Jugadores'
      ? JUGADORES
      : JUGADORES.filter((j) => j.grupo === filtro)

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Volver */}
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Volver a Equipos
        </button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{equipo.nombre} — Plantilla</h1>
          <p className="text-base text-gray-500 mt-2">Gestión completa de jugadores y estadísticas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {STATS_SUB17.map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 p-5 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              <p className="text-xs font-medium text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`flex-1 min-w-fit py-3 px-3 text-sm font-medium transition-colors ${
                filtro === f ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid de jugadores */}
        <div className="grid md:grid-cols-2 gap-6">
          {jugadoresFiltrados.map((j) => (
            <div key={j.id} className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4">

              {/* Header jugador */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar con iniciales */}
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{j.iniciales}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{j.nombre}</p>
                    <p className="text-sm text-gray-500">{j.posicion}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-2xl font-black text-gray-200">#{j.numero}</span>
                  <span className={`rounded-full text-xs font-medium px-3 py-1 ${ESTADO_COLOR[j.estado]}`}>
                    {j.estado}
                  </span>
                </div>
              </div>

              {/* Datos físicos */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Edad',         valor: `${j.edad} años`   },
                  { label: 'Altura',       valor: j.altura            },
                  { label: 'Peso',         valor: j.peso              },
                  { label: 'Nacionalidad', valor: j.nacionalidad      },
                ].map((dato) => (
                  <div key={dato.label} className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                    <p className="text-xs text-gray-400">{dato.label}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">{dato.valor}</p>
                  </div>
                ))}
              </div>

              {/* Calificación + stats */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-5">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{j.goles}</p>
                    <p className="text-xs text-gray-400">Goles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{j.asistencias}</p>
                    <p className="text-xs text-gray-400">Asistencias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{j.partidos}</p>
                    <p className="text-xs text-gray-400">Partidos</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">{j.calificacion}</p>
                  <p className="text-xs text-gray-400">Calificación</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}