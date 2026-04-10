'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TeamPerformance, Goalscorer } from '@/types/domain/statistics.schema'
import { StatCard } from './StatCard'
import { EstadisticasEquipoTab } from './EstadisticasEquipoTab'
import { Activity } from 'lucide-react'

interface EstadisticasViewProps {
  rendimientoList: TeamPerformance[]
  goleadoresList: Goalscorer[]
}

export function EstadisticasView({ rendimientoList, goleadoresList }: EstadisticasViewProps) {
  const [activeTab, setActiveTab] = useState<'equipo' | 'goleadores' | 'grupal' | 'tabla'>('equipo')

  // Asumimos que miramos el rendimiento general del primer equipo (o el sumado)
  const rendimiento = rendimientoList.length > 0 ? rendimientoList[0] : null
  
  const diferenciaGoles = rendimiento ? (rendimiento.goles_favor - rendimiento.goles_contra) : 0
  const winRate = rendimiento && rendimiento.partidos > 0 
    ? ((rendimiento.ganados / rendimiento.partidos) * 100).toFixed(1) 
    : '0.0'

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Estadísticas
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Análisis detallado del rendimiento de Escuela Patriota Sport Bacatá en la temporada actual.
          </p>
        </div>
        <Link 
          href="/dashboard/estadisticas/individual"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          <Activity size={18} />
          Análisis Individual
        </Link>
      </div>

      {/* Tarjetas Superiores */}
      {rendimiento && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Posición"
            value={<div className="flex items-center gap-2">#2 <span className="text-green-500 text-lg">↗</span></div>}
            subtitle={rendimiento.categoria || "Liga BetPlay"}
          />
          <StatCard 
            title="Puntos"
            value={rendimiento.puntos}
            subtitle={`en ${rendimiento.partidos} partidos`}
          />
          <StatCard 
            title="Goles"
            value={`${rendimiento.goles_favor} - ${rendimiento.goles_contra}`}
            subtitle={`Diferencia: ${diferenciaGoles > 0 ? '+' : ''}${diferenciaGoles}`}
          />
          <StatCard 
            title="Efectividad"
            value={`${winRate}%`}
            subtitle="de victorias"
          />
        </div>
      )}

      {/* Sistema de Pestañas */}
      <div className="bg-white rounded-t-xl mb-6 shadow-sm border border-gray-100 p-1">
        <div className="flex flex-wrap lg:flex-nowrap w-full">
          {[
            { id: 'equipo', label: 'Estadísticas del Equipo' },
            { id: 'goleadores', label: 'Goleadores' },
            { id: 'grupal', label: 'Rendimiento Grupal' },
            { id: 'tabla', label: 'Tabla de Posiciones' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 text-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de las Pestañas */}
      <div className="mt-4">
        {activeTab === 'equipo' && <EstadisticasEquipoTab rendimiento={rendimiento} />}
        
        {activeTab !== 'equipo' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">Sección en Construcción</h3>
            <p className="text-gray-500">Estamos trabajando para traerte más visualizaciones en esta pestaña pronto.</p>
          </div>
        )}
      </div>

    </div>
  )
}
