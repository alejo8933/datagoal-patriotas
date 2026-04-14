'use client'

import { useState, useRef } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { crearJugador } from '@/services/actions/jugadores'

export default function ModalCrearJugador() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    // Invocamos nuestro Server Action
    const result = await crearJugador(formData)
    
    if (result?.success) {
      // Éxito: Cerramos el modal limpiamente y reiniciamos ref
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      // Fallo: Mostramos error robusto al administrador
      setError(result?.message || 'Error desconocido.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
      >
        <Plus size={18} />
        Registrar Jugador
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Jugador</h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre <span className="text-red-500">*</span></label>
                    <input required type="text" id="nombre" name="nombre" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: Falcao" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido <span className="text-red-500">*</span></label>
                    <input required type="text" id="apellido" name="apellido" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: García" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="categoria" className="text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
                  <select required id="categoria" name="categoria" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white">
                    <option value="">Selecciona una categoría...</option>
                    <option value="Sub-9">Sub-9</option>
                    <option value="Sub-11">Sub-11</option>
                    <option value="Sub-13">Sub-13</option>
                    <option value="Sub-15">Sub-15</option>
                    <option value="Sub-17">Sub-17</option>
                    <option value="Libre">Libre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="posicion" className="text-sm font-medium text-gray-700">Posición de Juego</label>
                    <select id="posicion" name="posicion" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white">
                      <option value="">Sin definir...</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Mediocampista">Mediocampista</option>
                      <option value="Delantero">Delantero</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="numero_camiseta" className="text-sm font-medium text-gray-700">N° Camiseta</label>
                    <input type="number" min="1" max="99" id="numero_camiseta" name="numero_camiseta" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: 9" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[120px] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Jugador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
