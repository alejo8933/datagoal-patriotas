'use client'

import { Trophy, Calendar, MapPin, User, Users, BarChart3, Users2, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import ModalEditarAvanzado from './ModalEditorAvanzado'
import ModalEliminar from '@/components/features/ui/ModalEliminar'

interface Equipo {
  id: string
  equipo: string
  categoria: string
  imagen_url?: string
  fundacion?: number
  sede?: string
  tecnico?: string
  logros?: any // Parseado como array de strings
  puntos?: number
  partidos?: number
  activo?: boolean
}

export default function CardEquipoPremium({ equipo }: { equipo: Equipo }) {
  // Parsear logros si es un string o JSON
  const listaLogros = Array.isArray(equipo.logros) 
    ? equipo.logros 
    : (typeof equipo.logros === 'string' ? JSON.parse(equipo.logros) : [])

  const fallbackImage = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop"

  return (
    <div className="group relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-red-500/10 hover:-translate-y-2">
      
      {/* HEADER / IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={equipo.imagen_url || fallbackImage} 
          alt={equipo.equipo}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          <span className="text-white text-[10px] font-black uppercase tracking-widest">{equipo.categoria}</span>
        </div>


        {/* Team Name Overlay */}
        <div className="absolute bottom-6 left-8 right-8 text-left">
          <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
            {equipo.equipo}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-red-400 font-bold text-sm">
              <Trophy size={14} />
              <span>{listaLogros.length > 0 ? 'Equipo Laureado' : 'En formación'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY / INFO */}
      <div className="p-8 space-y-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="p-2 bg-white text-gray-400 rounded-xl shadow-sm">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fundación</p>
              <p className="text-sm font-black text-gray-700">{equipo.fundacion || '2010'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="p-2 bg-white text-gray-400 rounded-xl shadow-sm">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sede</p>
              <p className="text-sm font-black text-gray-700 truncate w-24" title={equipo.sede || 'Cancha Bacatá'}>
                {equipo.sede || 'Bacatá'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <User size={16} className="text-red-500" />
              <span>DT: {equipo.tecnico || 'Por definir'}</span>
            </div>
          </div>

          {/* Logros Section */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Logros Recientes
            </p>
            {listaLogros.length > 0 ? (
              <ul className="space-y-1.5">
                {listaLogros.slice(0, 2).map((logro: string, index: number) => (
                  <li key={index} className="text-xs font-bold text-gray-600 flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full bg-gray-300" />
                    {logro}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-gray-400">Sin palmarés registrado aún.</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS PRIMARY */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Link 
            href={`/dashboard/admin/equipos/${equipo.id}/plantilla`}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-gray-900/10"
          >
            <Users2 size={16} className="text-red-500" />
            Ver Plantilla
          </Link>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all text-[10px] uppercase tracking-widest">
            <BarChart3 size={16} />
            Estadísticas
          </button>
        </div>

        {/* ACTION BUTTONS MANAGEMENT (SECONDARY) */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-50 mt-2">
          <ModalEditarAvanzado equipo={equipo} />
          <ModalEliminar 
            tabla="rendimiento_equipos" 
            idRegistro={equipo.id} 
            pathRevalidacion="/dashboard/admin/equipos"
            modo="inactivo"
            etiqueta="Desactivar"
            esIcono={false}
          />
        </div>
      </div>
    </div>
  )
}
