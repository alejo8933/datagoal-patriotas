'use client'

import { useState, useRef } from 'react'
import { Edit, X, Loader2, ShieldCheck } from 'lucide-react'
import { editarUsuario } from '@/services/actions/usuarios'

interface ModalEditarUsuarioProps {
  usuario: {
    id: string
    nombre: string | null
    apellido: string | null
    rol: string
  }
}

export default function ModalEditarUsuario({ usuario }: ModalEditarUsuarioProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', usuario.id)
    
    const result = await editarUsuario(formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al actualizar.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Cambiar permisos o datos"
      >
        <Edit size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                Modificar Cuenta
              </h2>
              <button onClick={() => !isLoading && setIsOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 italic">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nombre Público</label>
                  <input name="nombre" defaultValue={usuario.nombre || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Apellido</label>
                  <input name="apellido" defaultValue={usuario.apellido || ''} className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nivel de Acceso (Rol)</label>
                  <select name="rol" defaultValue={usuario.rol} className="w-full px-3 py-2 border rounded-lg bg-gray-50 border-gray-200 font-medium">
                    <option value="admin">Administrador (Total)</option>
                    <option value="entrenador">Entrenador (Académico)</option>
                    <option value="jugador">Jugador (Solo Lectura)</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1 italic italic">Precaución: Cambiar el rol afectará lo que el usuario puede ver en su Dashboard.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition text-sm">
                  Cerrar
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition disabled:opacity-50 text-sm">
                  {isLoading ? 'Guardando...' : 'Aplicar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
