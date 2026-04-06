'use client'

import { useState, useEffect } from 'react'
import { matchService } from '@/services/matchService'
import type { Match } from '@/types/domain/match.schema'

export function useMatches(categoria?: string) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const fetch = categoria
      ? matchService.getByCategoria(categoria)
      : matchService.getAll()

    fetch
      .then(setMatches)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar partidos.')
      })
      .finally(() => setLoading(false))
  }, [categoria])

  return { matches, loading, error }
}