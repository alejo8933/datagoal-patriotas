'use client'

import { useState, useRef } from 'react'
import { ShieldCheck, X, Loader2, Key } from 'lucide-react'
import { crearUsuario } from '@/services/actions/usuarios'

export default function ModalCrearUsuario() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await crearUsuario(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error del servidor al crear usuario.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
      >
        <ShieldCheck size={18} />
        Añadir Usuario Autorizado
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Key size={20} className="text-gray-500" />
                Permisos y Nuevas Credenciales
              </h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 shadow-inner">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  Invita a un nuevo Entrenador o Administrador. El sistema auto-confirmará el perfil 
                  y generará el emparejamiento con sus tablas maestras ocultas.
                </p>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico (Login) <span className="text-red-500">*</span></label>
                  <input required type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition" placeholder="ejemplo@datagoal.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Crear Contraseña Maestra <span className="text-red-500">*</span></label>
                    <input required type="password" id="password" name="password" minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition text-gray-700" placeholder="Mínimo 6 caracteres" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="rol" className="text-sm font-medium text-gray-700">Nivel de Acceso (Rol) <span className="text-red-500">*</span></label>
                    <select required id="rol" name="rol" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition bg-white font-medium text-gray-800">
                      <option value="">Selecciona Jerarquía...</option>
                      <option value="admin">Administrador Total</option>
                      <option value="entrenador">Entrenador (Coach)</option>
                      <option value="jugador">Jugador / Acudiente</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 p-4 bg-gray-50 -mx-6 -mb-6 rounded-b-2xl border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancelar Operación
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition flex items-center justify-center min-w-[140px] disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Generar Acceso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
