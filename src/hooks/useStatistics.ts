'use client'

import { useState, useEffect } from 'react'
import { statisticsService } from '@/services/statisticsService'
import type { Goalscorer, TeamPerformance } from '@/types/domain/statistics.schema'

export function useStatistics() {
  const [goalscorers,     setGoalscorers]     = useState<Goalscorer[]>([])
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      statisticsService.getGoalscorers(),
      statisticsService.getTeamPerformance(),
    ])
      .then(([goles, rendimiento]) => {
        setGoalscorers(goles)
        setTeamPerformance(rendimiento)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas.')
      })
      .finally(() => setLoading(false))
  }, [])

  return { goalscorers, teamPerformance, loading, error }
}