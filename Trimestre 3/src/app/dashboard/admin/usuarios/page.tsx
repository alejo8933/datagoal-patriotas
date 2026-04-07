import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, ShieldAlert, UserCog } from 'lucide-react'
import ModalCrearUsuario from '@/components/features/usuarios/ModalCrearUsuario'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarUsuario from '@/components/features/usuarios/ModalEditarUsuario'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()

  // Consultar solo usuarios activos
  const { data: perfiles, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('activo', true)
    .order('rol')

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-red-600" />
            Usuarios y Roles
          </h1>
          <p className="text-gray-500 mt-1">Gestiona los accesos y niveles de seguridad del sistema.</p>
        </div>
        <ModalCrearUsuario />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-500 flex flex-col items-center gap-2">
            <ShieldAlert size={32} />
            <p>Error al cargar usuarios: {error.message}</p>
          </div>
        ) : !perfiles?.length ? (
          <div className="p-12 text-center text-gray-500">
            <p>No hay usuarios registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Nombre y Apellido</th>
                  <th className="px-6 py-4 font-medium text-center">Nivel de Acceso (Rol)</th>
                  <th className="px-6 py-4 font-medium text-center">Estado de Cuenta</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs uppercase">
                        {p.nombre?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.nombre || 'Sin Nombre'} {p.apellido || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        p.rol === 'admin' ? 'bg-red-600 text-white shadow-sm' : 
                        p.rol === 'entrenador' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                        'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {p.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200 flex items-center justify-center gap-1 w-20 mx-auto">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        Vigente
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <ModalEditarUsuario usuario={p} />
                      <ModalEliminar 
                        tabla="perfiles" 
                        idRegistro={p.id} 
                        pathRevalidacion="/dashboard/admin/usuarios"
                        modo="inactivo"
                        etiqueta="Inhabilitar"
                        esIcono={true}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
