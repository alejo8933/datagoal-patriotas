'use client'

import { useState } from 'react'
import { Users, MapPin, Calendar, Star } from 'lucide-react'
import PlantillaPage from './plantilla'

const INFO_CLUB = [
  { label: 'Fundación',  valor: '2010 — Boyacá, Colombia' },
  { label: 'Sede',       valor: 'Bogotá, Colombia'         },
  { label: 'Títulos',    valor: '12 en diferentes categorías' },
]

const EQUIPOS = [
  {
    id: '1',
    nombre: 'Escuela Patriota Sport Sub-17',
    categoria: 'Juvenil',
    sub: 'Sub-17 (2008)',
    jugadores: 22,
    fundado: 2015,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'Carlos Rodríguez',
    logros: ['Campeón Liga de Bogotá 2024', 'Subcampeón Torneo Maracana 2023'],
  },
  {
    id: '2',
    nombre: 'Escuela Patriota Sport Sub-15',
    categoria: 'Juvenil',
    sub: 'Sub-15 (2010)',
    jugadores: 20,
    fundado: 2016,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'Miguel Hernández',
    logros: ['Campeón Torneo DBS 2024', 'Tercer lugar Liga de Bogotá 2023'],
  },
  {
    id: '3',
    nombre: 'Escuela Patriota Sport Sub-13',
    categoria: 'Infantil',
    sub: 'Sub-13 (2012)',
    jugadores: 18,
    fundado: 2017,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'Ana García',
    logros: ['Semifinalista Torneo Maracana 2024'],
  },
  {
    id: '4',
    nombre: 'Escuela Patriota Sport Sub-11',
    categoria: 'Infantil',
    sub: 'Sub-11 (2014)',
    jugadores: 16,
    fundado: 2018,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'Laura Martínez',
    logros: ['Cuartos de Final DBS 2024'],
  },
  {
    id: '5',
    nombre: 'Escuela Patriota Sport Sub-9',
    categoria: 'Infantil',
    sub: 'Sub-9 (2016)',
    jugadores: 14,
    fundado: 2019,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'Roberto Pérez',
    logros: ['Participante Liga de Bogotá 2024'],
  },
  {
    id: '6',
    nombre: 'Escuela Patriota Sport Sub-7',
    categoria: 'Iniciación',
    sub: 'Sub-7 (2018)',
    jugadores: 12,
    fundado: 2020,
    cancha: 'Cancha Sintética Bacatá',
    dt: 'María González',
    logros: ['Festival de Fútbol Infantil 2024'],
  },
]

const CATEGORIA_COLOR: Record<string, string> = {
  Juvenil:    'bg-blue-100 text-blue-700',
  Infantil:   'bg-green-100 text-green-700',
  Iniciación: 'bg-yellow-100 text-yellow-700',
}

export default function EquiposPage() {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null)

  if (equipoSeleccionado) {
    const equipo = EQUIPOS.find((e) => e.id === equipoSeleccionado)!
    return (
      <PlantillaPage
        equipo={equipo}
        onVolver={() => setEquipoSeleccionado(null)}
      />
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nuestros Equipos</h1>
          <p className="text-base text-gray-500 mt-2">
            Descubre todos los equipos que forman parte de la familia Escuela Patriota Sport Bacatá,
            desde nuestras categorías juveniles hasta las divisiones infantiles de formación.
          </p>
        </div>

        {/* Info del Club */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {INFO_CLUB.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 p-7 text-center">
              <p className="text-sm text-gray-400 mb-1">{item.label}</p>
              <p className="font-bold text-gray-900 text-base">{item.valor}</p>
            </div>
          ))}
        </div>

        {/* Grid de equipos */}
        <div className="grid md:grid-cols-2 gap-6">
          {EQUIPOS.map((equipo) => (
            <div
              key={equipo.id}
              className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900 text-base">{equipo.nombre}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{equipo.sub}</p>
                </div>
                <span className={`shrink-0 rounded-full text-xs font-medium px-3 py-1 ${CATEGORIA_COLOR[equipo.categoria]}`}>
                  {equipo.categoria}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Users size={14} /> {equipo.jugadores} jugadores
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} /> Fundado {equipo.fundado}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin size={14} /> {equipo.cancha}
                </p>
              </div>

              {/* DT */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">DT:</span>
                <span className="text-sm font-medium text-gray-700">{equipo.dt}</span>
              </div>

              {/* Logros */}
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Star size={11} /> Logros Recientes
                </p>
                <ul className="space-y-1">
                  {equipo.logros.map((logro) => (
                    <li key={logro} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span> {logro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón Ver Plantilla */}
              <div className="mt-auto pt-3 border-t border-gray-100">
                <button
                  onClick={() => setEquipoSeleccionado(equipo.id)}
                  className="w-full rounded-lg bg-gray-800 text-white text-sm font-medium py-2.5 hover:bg-gray-700 transition-colors"
                >
                  Ver Plantilla
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}