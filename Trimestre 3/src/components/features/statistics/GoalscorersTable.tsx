'use client'

import { useStatistics } from '@/hooks/useStatistics'

export default function GoalscorersTable() {
  const { goalscorers, loading, error } = useStatistics()

  if (loading) return <p className="text-muted-foreground">Cargando estadísticas...</p>
  if (error)   return <p className="text-destructive">{error}</p>
  if (!goalscorers.length) return <p className="text-muted-foreground">No hay estadísticas disponibles.</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface-offset text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Jugador</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-center">Goles</th>
          </tr>
        </thead>
        <tbody>
          {goalscorers.map((g, index) => (
            <tr key={g.id} className="border-t border-border hover:bg-surface transition-colors">
              <td className="px-4 py-2 text-muted-foreground">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-foreground">
                {g.nombre} {g.apellido}
              </td>
              <td className="px-4 py-2 text-muted-foreground">{g.categoria}</td>
              <td className="px-4 py-2 text-center font-bold text-primary">{g.goles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}