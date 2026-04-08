'use client'

import { Settings, Bell, Search, LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminHeaderProps {
  email?: string        // ← agregado
  nombre: string
  apellido: string
  rol: string
}

export default function AdminHeader({ email, nombre, apellido, rol }: AdminHeaderProps) {
  const initial = nombre ? nombre.charAt(0).toUpperCase() : 'A'
  const char = apellido ? apellido.charAt(0).toUpperCase() : ''

  return (
    <header className="h-16 border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-lg sticky top-0 z-50 px-6 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mb-0.5">
          Dashboard
        </span>
        <span className="text-sm font-black text-white tracking-tight flex items-center gap-2">
          Administración
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      </div>

      <div className="flex items-center gap-3">

        {/* Buscador */}
        <div className="relative group hidden lg:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Buscar en DataGoal..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 w-64 transition-all"
          />
        </div>

        {/* Notificaciones */}
        <Link
          href="/dashboard/admin/notificaciones"
          className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </Link>

        {/* Ajustes */}
        <Link
          href="/dashboard/admin/perfil?tab=preferencias"
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition group"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>

        {/* Separador */}
        <div className="h-6 w-px bg-white/10 mx-1" />

        {/* Perfil */}
        <Link
          href="/dashboard/admin/perfil"
          className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition group"
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-white leading-none group-hover:text-red-400 transition-colors">
              {nombre} {apellido}
            </span>
            {email && (
              <span className="text-[10px] text-gray-500 mt-0.5">{email}</span>
            )}
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-white/5 rounded-md">
              {rol || 'ADMIN'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20 transition-all group-hover:scale-105">
            {initial}{char}
          </div>
        </Link>
      </div>
    </header>
  )
}