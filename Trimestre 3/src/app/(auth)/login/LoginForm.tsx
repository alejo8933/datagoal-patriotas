'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">

      {/* Logo */}
      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">P</span>
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-sm text-gray-500 mt-1">
          Accede a tu cuenta de Escuela Patriota Sport Bacatá
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <span className="text-gray-400">👤</span>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <div className="flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
            <span className="text-gray-400">🔒</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Links */}
      <div className="text-center flex flex-col gap-3 w-full">
        <a href="#" className="text-red-600 text-sm hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
        <p className="text-sm text-gray-500">¿No tienes cuenta?</p>
        <a
          href="/registro"
          className="border-2 border-gray-400 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-500 text-center transition"
        >
          Registrarse
        </a>
      </div>

    </div>
  )
}