'use client'

import { TeamPerformance } from '@/types/domain/statistics.schema'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface EstadisticasEquipoTabProps {
  rendimiento: TeamPerformance | null
}

const COLORS = {
  victorias: '#10B981', // Verde
  empates: '#F59E0B',   // Amarillo
  derrotas: '#EF4444'   // Rojo
}

const MONTH_DATA = [
  { name: 'Ene', goles: 4 },
  { name: 'Feb', goles: 6 },
  { name: 'Mar', goles: 8 },
  { name: 'Abr', goles: 5 },
  { name: 'May', goles: 9 },
  { name: 'Jun', goles: 7 },
  { name: 'Jul', goles: 12 },
  { name: 'Ago', goles: 8 },
  { name: 'Sep', goles: 6 }
]

export function EstadisticasEquipoTab({ rendimiento }: EstadisticasEquipoTabProps) {
  if (!rendimiento) return <div className="p-8 text-center text-gray-500">No hay datos de rendimiento disponibles.</div>

  const { ganados, empatados, perdidos, partidos, goles_favor } = rendimiento

  const pieData = [
    { name: 'Victorias', value: ganados, color: COLORS.victorias },
    { name: 'Empates', value: empatados, color: COLORS.empates },
    { name: 'Derrotas', value: perdidos, color: COLORS.derrotas }
  ]

  const dataAvalaible = partidos > 0

  const winRate = dataAvalaible ? ((ganados / partidos) * 100).toFixed(1) : '0.0'
  const drawRate = dataAvalaible ? ((empatados / partidos) * 100).toFixed(1) : '0.0'
  const lossRate = dataAvalaible ? ((perdidos / partidos) * 100).toFixed(1) : '0.0'
  const avgGoals = dataAvalaible ? (goles_favor / partidos).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribución de Resultados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-900 font-medium mb-6">Distribución de Resultados</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} partidos`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Leyenda manual */}
            <div className="absolute bottom-0 w-full flex justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div>Victorias: {ganados}</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>Empates: {empatados}</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>Derrotas: {perdidos}</div>
            </div>
          </div>
        </div>

        {/* Goles por Mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-900 font-medium mb-6">Goles por Mes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTH_DATA} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="goles"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Estadísticas Detalladas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-900 font-medium mb-6">Estadísticas Detalladas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* Victorias ProgressBar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Victorias</span>
              <span className="text-gray-900 font-semibold">{ganados}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${winRate}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{winRate}%</span>
          </div>

          {/* Empates ProgressBar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Empates</span>
              <span className="text-gray-900 font-semibold">{empatados}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${drawRate}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{drawRate}%</span>
          </div>

          {/* Derrotas ProgressBar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Derrotas</span>
              <span className="text-gray-900 font-semibold">{perdidos}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${lossRate}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{lossRate}%</span>
          </div>

          {/* Promedio Goles */}
          <div className="pt-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Promedio de Goles</span>
              <span className="text-gray-900 font-bold">{avgGoals}</span>
            </div>
            <span className="text-xs text-gray-500">Por partido</span>
          </div>

        </div>
      </div>

    </div>
  )
}
