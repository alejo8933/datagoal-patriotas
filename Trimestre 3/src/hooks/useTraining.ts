'use client'

import { useState, useEffect } from 'react'
import { trainingService } from '@/services/trainingService'
import type { Training } from '@/types/domain/training.schema'

export function useTraining(categoria?: string) {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const fetch = categoria
      ? trainingService.getByCategoria(categoria)
      : trainingService.getAll()

    fetch
      .then(setTrainings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar entrenamientos.')
      })
      .finally(() => setLoading(false))
  }, [categoria])

  return { trainings, loading, error }
}