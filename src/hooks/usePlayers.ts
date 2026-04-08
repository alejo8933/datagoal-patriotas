'use client'

import { useState, useEffect } from 'react'
import { playerService } from '@/services/playerService'
import type { Player } from '@/types/domain/player.schema'

export function usePlayers(categoria?: string) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const fetch = categoria
      ? playerService.getByCategoria(categoria)
      : playerService.getAll()

    fetch
      .then(setPlayers)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar jugadores.')
      })
      .finally(() => setLoading(false))
  }, [categoria])

  return { players, loading, error }
}