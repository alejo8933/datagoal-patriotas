'use client'

import { useState, useEffect } from 'react'
import { tournamentService } from '@/services/tournamentService'
import type { Tournament } from '@/types/domain/tournament.schema'

export function useTournaments(filtro?: 'proximos' | 'historial') {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const fetch =
      filtro === 'proximos'  ? tournamentService.getProximos()  :
      filtro === 'historial' ? tournamentService.getHistorial() :
      tournamentService.getAll()

    fetch
      .then(setTournaments)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar torneos.')
      })
      .finally(() => setLoading(false))
  }, [filtro])

  return { tournaments, loading, error }
}