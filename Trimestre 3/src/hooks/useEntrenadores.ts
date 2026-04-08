'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Entrenador {
  id: string
  nombre: string
  apellido: string
}

export function useEntrenadores() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEntrenadores() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('perfiles')
          .select('id, nombre, apellido')
          .eq('rol', 'entrenador')
          .order('nombre', { ascending: true })

        if (error) throw error
        setEntrenadores(data || [])
      } catch (err: any) {
        console.error('Error fetching coaches:', err)
        setError(err.message || 'Error al cargar entrenadores.')
      } finally {
        setLoading(false)
      }
    }

    fetchEntrenadores()
  }, [])

  return { entrenadores, loading, error }
}
