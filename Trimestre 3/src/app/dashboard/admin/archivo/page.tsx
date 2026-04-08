import { createClient } from "@/lib/supabase/server";
import { Archive, RotateCcw, Users, Shield, Trophy, Activity } from "lucide-react";
import { restaurarRegistro } from "@/services/actions/restaurar";

export default async function AdminArchivoPage() {
  const supabase = await createClient();

  const [
    { data: jugadores },
    { data: equipos },
    { data: usuarios },
    { data: partidos },
    { data: entrenamientos },
  ] = await Promise.all([
    supabase.from("jugadores").select("*").eq("activo", false),
    supabase.from("rendimiento_equipos").select("*").eq("activo", false),
    supabase.from("perfiles").select("*").eq("activo", false),
    supabase.from("partidos").select("*").eq("estado", "Cancelado"),
    supabase.from("entrenamientos").select("*").eq("activo", false),
  ]);

  const sections = [
    { name: "Jugadores",      data: jugadores,      icon: Users,     table: "jugadores",           path: "/dashboard/admin/jugadores" },
    { name: "Equipos",        data: equipos,        icon: Shield,    table: "rendimiento_equipos", path: "/dashboard/admin/equipos" },
    { name: "Usuarios",       data: usuarios,       icon: RotateCcw, table: "perfiles",            path: "/dashboard/admin/usuarios" },
    { name: "Partidos",       data: partidos,       icon: Trophy,    table: "partidos",            path: "/dashboard/admin/partidos" },
    { name: "Entrenamientos", data: entrenamientos, icon: Activity,  table: "entrenamientos",      path: "/dashboard/admin/entrenamientos" },
  ];

  const totalInactivos =
    (jugadores?.length ?? 0) +
    (equipos?.length ?? 0) +
    (usuarios?.length ?? 0) +
    (partidos?.length ?? 0) +
    (entrenamientos?.length ?? 0);

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Archive size={22} className="text-gray-400" />
          Archivo del Club
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-2xl">
          Repositorio de registros inactivos y cancelados. Puedes restaurarlos para volver a la gestión activa.
        </p>
      </div>

      {totalInactivos === 0 ? (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-20 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center">
            <Archive size={28} className="text-gray-500" />
          </div>
          <p className="text-gray-500 font-medium">El archivo está vacío actualmente</p>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((section) =>
            section.data && section.data.length > 0 ? (
              <div key={section.name} className="flex flex-col gap-4">

                {/* Título de sección */}
                <div className="flex items-center gap-2">
                  <section.icon size={18} className="text-gray-400" />
                  <h2 className="text-base font-semibold text-white">
                    {section.name} archivados
                  </h2>
                  <span className="bg-white/10 text-gray-400 px-2 py-0.5 rounded-full text-xs font-mono">
                    {section.data.length}
                  </span>
                </div>

                {/* Tabla */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 uppercase text-[10px] tracking-wider">
                        <th className="px-5 py-3">Nombre / Referencia</th>
                        <th className="px-5 py-3">Categoría</th>
                        <th className="px-5 py-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {section.data.map((item: any) => (
                        <tr key={item.id} className="hover:bg-white/5 transition group">
                          <td className="px-5 py-3 font-medium text-white">
                            {item.nombre ??
                              item.titulo ??
                              (item.equipo_local && item.equipo_visitante
                                ? `${item.equipo_local} vs ${item.equipo_visitante}`
                                : item.id)}
                          </td>
                          <td className="px-5 py-3 text-gray-400">
                            {item.categoria ?? "—"}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <form action={restaurarRegistro}>
                              <input type="hidden" name="id"    value={item.id} />
                              <input type="hidden" name="tabla" value={section.table} />
                              <input type="hidden" name="path"  value={section.path} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition text-xs font-medium"
                              >
                                <RotateCcw size={13} />
                                Restaurar
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}