'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function JugadorPerfilPage() {
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [user, setUser] = useState<any>(null)
  const [jugador, setJugador] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)

  // Estados del Formulario
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [numero, setNumero] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 1. Obtener Perfil (Registro Original) y Jugador (Estadísticas)
      const [perfilRes, jugadorRes] = await Promise.all([
        supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('jugadores').select('*').eq('user_id', user.id).maybeSingle()
      ])

      const perfilData = perfilRes.data
      const jugadorData = jugadorRes.data

      // Fallback a metadata de Auth (Registro)
      const meta = user.user_metadata

      if (perfilData) {
         setPerfil(perfilData)
         setNombre(perfilData.nombre || meta?.nombre || jugadorData?.nombre || '')
         setApellido(perfilData.apellido || meta?.apellido || jugadorData?.apellido || '')
      } else if (meta) {
         setNombre(meta.nombre || '')
         setApellido(meta.apellido || '')
      }

      if (jugadorData) {
        setJugador(jugadorData)
        setNumero(jugadorData.numero_camiseta || jugadorData.numero || '')
        setFotoUrl(jugadorData.foto_url || null)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setUpdating(true)
    try {
      let finalFotoUrl = fotoUrl

      // 1. Subir imagen si hay una nueva
      if (newFile) {
        const fileExt = newFile.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `perfiles/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('jugadores')
          .upload(filePath, newFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('jugadores')
          .getPublicUrl(filePath)
        
        finalFotoUrl = publicUrl
      }

      // 2. Actualizar Tabla 'perfiles' (Datos de Identidad)
      const { error: perfilUpdateError } = await supabase
        .from('perfiles')
        .update({
          nombre,
          apellido
        })
        .eq('id', user.id)

      if (perfilUpdateError) throw perfilUpdateError

      // 3. Actualizar Tabla 'jugadores' (Datos Deportivos)
      const updatePayload: any = {
        nombre,
        apellido,
        numero_camiseta: parseInt(numero) || 0,
        foto_url: finalFotoUrl
      }

      const { error: jugadorUpdateError } = await supabase
        .from('jugadores')
        .update(updatePayload)
        .eq('user_id', user.id)

      if (jugadorUpdateError) throw jugadorUpdateError

      setFotoUrl(finalFotoUrl)
      setIsEditing(false)
      setNewFile(null)
      setPreviewUrl(null)
      
      setPerfil({ ...perfil, nombre, apellido })
      setJugador({ ...jugador, ...updatePayload })

      router.refresh()
      alert('Perfil sincronizado con éxito')
    } catch (error: any) {
      console.error('Error actualizando perfil:', error)
      alert('Error: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  )

  // Priorizamos Metadata de Registro para Categoria y Posicion si no hay en la tabla
  const catRegistrada = perfil?.categoria || user?.user_metadata?.categoria || jugador?.categoria || 'General'
  const posRegistrada = perfil?.posicion || user?.user_metadata?.posicion || jugador?.posicion || 'Polivalente'
  const telRegistrado = perfil?.telefono || user?.user_metadata?.telefono || 'No registrado'
  const nacRegistrado = perfil?.fecha_nacimiento || user?.user_metadata?.fecha_nacimiento || null

  const nombreCompleto = `${nombre} ${apellido}`.trim() || user.email?.split('@')[0]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
      <div className="animate-in fade-in slide-in-from-top duration-700 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">👤 Mi Perfil Atlético</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tu información personal y deportiva en Patriotas Sport.</p>
        </div>
        {!isEditing && (
            <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm shadow-md"
            >
                Editar Perfil
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Tarjeta de Identidad Deportiva */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden text-center p-8 relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-red-600 to-red-800" />
                <div className="relative z-10">
                    <div 
                        className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg mx-auto mb-4 overflow-hidden border-4 border-white group relative"
                    >
                        {isEditing && (
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                            >
                                <span className="text-white text-[10px] font-black uppercase">Cambiar Foto</span>
                            </button>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden">
                            {(previewUrl || fotoUrl) ? (
                                <img 
                                    src={previewUrl || fotoUrl || ''} 
                                    className="w-full h-full object-cover" 
                                    alt="Foto Perfil"
                                />
                            ) : (
                                <span className="text-4xl text-gray-300">⚽</span>
                            )}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight truncate px-4">{nombreCompleto}</h2>
                    <p className="text-sm font-bold text-red-600 uppercase tracking-widest mt-1">Jugador Canterano</p>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</p>
                            <p className="text-sm font-black text-gray-800">{catRegistrada}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Posición</p>
                            <p className="text-sm font-black text-gray-800">{posRegistrada}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    📞 Contacto Registro
                </h3>
                <p className="text-sm font-medium text-blue-800">Tel: {telRegistrado}</p>
                {nacRegistrado && (
                   <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase">Nacimiento: {new Date(nacRegistrado).toLocaleDateString()}</p>
                )}
            </div>
        </div>

        {/* Formulario / Información Detallada */}
        <div className="lg:col-span-2 space-y-8">
            <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-8 transition-all ${isEditing ? 'ring-2 ring-red-500' : ''}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-4">
                    {isEditing ? 'Editando Perfil' : 'Detalles del Jugador'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {isEditing ? (
                        <>
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nombre</label>
                                <input 
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Apellido</label>
                                <input 
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Número de Camiseta</label>
                                <input 
                                    type="number"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-black text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Correo Electrónico</label>
                                <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 truncate">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Fecha de Ingreso</label>
                                <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700">
                                    {new Date(jugador?.fecha_ingreso || Date.now()).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Número de Camiseta</label>
                                <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-black text-red-600">
                                    #{numero || 'S/N'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Estado Médico</label>
                                <div className="flex items-center gap-2 w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-green-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    Apto para competencia
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-12 flex justify-end gap-4">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => { setIsEditing(false); setPreviewUrl(null); }}
                                className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors text-sm"
                                disabled={updating}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-md active:scale-95 text-sm flex items-center gap-2"
                                disabled={updating}
                            >
                                {updating ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </>
                    ) : (
                        <button className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors text-sm">
                            Reportar Error en Datos
                        </button>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}
