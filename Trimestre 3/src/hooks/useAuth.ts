'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/authService'
import type { Register } from '@/types/domain/auth.schema'

type Rol = 'admin' | 'entrenador' | 'jugador'

interface AuthUser {
  id:    string
  email: string
  rol:   Rol
}

export function useAuth() {
  const router = useRouter()
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  // Carga el usuario actual al montar
  useEffect(() => {
    authService.getUser().then((u) => {
      if (u) setUser({ id: u.id, email: u.email, rol: u.rol })
    })
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { user: u, rol } = await authService.login(email, password)
      setUser({ id: u.id, email: u.email!, rol: rol as Rol })

      // Redirige según rol
      if      (rol === 'admin')      router.push('/dashboard/admin')
      else if (rol === 'entrenador') router.push('/dashboard/entrenador')
      else                           router.push('/dashboard/jugador')

      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  const register = async (fields: Register): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await authService.register(fields)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setUser(null)
      router.push('/login')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, login, register, logout }
}