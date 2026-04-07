'use client'

import { Bell, Search, Settings, ChevronDown } from 'lucide-react'

interface AdminHeaderProps {
  email?: string
}

export default function AdminHeader({ email }: AdminHeaderProps) {
  // Obtenemos solo la inicial del correo para el avatar
  const initial = email ? email.charAt(0).toUpperCase() : 'A'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Lado Izquierdo: Barra de Búsqueda Interactiva */}
        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-transparent text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block pl-10 p-2.5 transition-all" 
              placeholder="Buscar jugadores, equipos o partidos..." 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘ K</span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Iconos de Utilidad y Perfil */}
        <div className="flex items-center gap-4 ml-auto">
          
          {/* Botón de Notificaciones */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
            </span>
          </button>

          {/* Botón de Ajustes (Opcional, decorativo) */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 hidden sm:block">
            <Settings size={20} />
          </button>

          {/* Separador */}
          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* Perfil Interactivo */}
          <button className="flex items-center gap-3 pl-2 py-1 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-100 pr-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-white font-bold shadow-sm">
              {initial}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-700 leading-none">Administrador</span>
              <span className="text-xs text-gray-500 mt-1 max-w-[120px] truncate">{email || 'cargando...'}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
