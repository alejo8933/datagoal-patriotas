'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const POSICIONES = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']
const CATEGORIAS = ['Sub-7', 'Sub-9', 'Sub-11', 'Sub-13', 'Sub-15', 'Sub-17']

export default function RegisterForm() {
  const { register, loading, error } = useAuth()
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    fechaNacimiento: '', posicion: '', categoria: '',
    password: '', confirm: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (form.password !== form.confirm) {
      setLocalError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setLocalError('La contraseña debe tener mínimo 6 caracteres.')
      return
    }
    if (!aceptaTerminos) {
      setLocalError('Debes aceptar los términos y condiciones.')
      return
    }

    const ok = await register({
      email:           form.email,
      password:        form.password,
      nombre:          form.nombre,
      apellido:        form.apellido,
      telefono:        form.telefono,
      fechaNacimiento: form.fechaNacimiento,
      posicion:        form.posicion,
      categoria:       form.categoria,
    })

    if (ok) setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">¡Registro exitoso!</h2>
        <p className="text-sm text-gray-500">Revisa tu correo para confirmar tu cuenta.</p>
        <a href="/login" className="text-red-600 hover:underline text-sm font-medium">
          Ir al Login
        </a>
      </div>
    )
  }

  const displayError = localError || error

  // ── Clase reutilizable para wrappers de input ──
  const inputWrapper = "flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
  const inputClass   = "flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
  const selectClass  = "w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">

      {/* Logo */}
      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">P</span>
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Únete a Escuela Patriota Sport Bacatá</h1>
        <p className="text-sm text-gray-500 mt-1">
          Regístrate para ser parte de nuestra familia futbolística (Sub-7 a Sub-17)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">

        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {displayError}
          </div>
        )}

        {/* ── Información Personal ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Información Personal
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">👤</span>
                <input name="nombre" placeholder="Tu nombre" value={form.nombre}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Apellido</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">👤</span>
                <input name="apellido" placeholder="Tu apellido" value={form.apellido}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">✉️</span>
                <input name="email" type="email" placeholder="tu@email.com" value={form.email}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Teléfono</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">📱</span>
                <input name="telefono" placeholder="+57 300 123 4567" value={form.telefono}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <div className={inputWrapper}>
              <span className="text-gray-400 text-sm">📅</span>
              <input name="fechaNacimiento" type="date" value={form.fechaNacimiento}
                onChange={handleChange} required className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Información Futbolística ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Información Futbolística
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Posición</label>
              <select name="posicion" value={form.posicion} onChange={handleChange}
                required className={selectClass}>
                <option value="">Selecciona posición</option>
                {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange}
                required className={selectClass}>
                <option value="">Selecciona categoría</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Seguridad ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Seguridad
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">🔒</span>
                <input name="password" type="password" placeholder="••••••••" value={form.password}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">🔒</span>
                <input name="confirm" type="password" placeholder="••••••••" value={form.confirm}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="accent-red-600 w-4 h-4" />
            Acepto los{' '}
            <a href="#" className="text-red-600 hover:underline">términos y condiciones</a>
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

      </form>
    </div>
  )
}