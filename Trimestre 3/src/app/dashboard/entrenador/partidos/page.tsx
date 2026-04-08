import { getPartidos } from "@/lib/entrenador/partidos";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";

const ESTADO_BADGE: Record<string, string> = {
  programado:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  en_curso:    "bg-green-500/10 text-green-400 border-green-500/20",
  finalizado:  "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Cancelado:   "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function PartidosEntrenadorPage() {
  const partidos = await getPartidos();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Registro de Eventos</h1>
        <p className="text-gray-400 text-sm mt-1">
          Selecciona un partido para registrar sus eventos
        </p>
      </div>

      {partidos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">⚽</p>
          <p className="text-lg text-gray-400">No hay partidos registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {partidos.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/entrenador/partidos/${p.id}`}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition flex items-center justify-between group"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">
                    {p.equipo_local}
                    <span className="text-gray-500 mx-2">vs</span>
                    {p.equipo_visitante}
                  </p>
                  {(p.goles_local !== null || p.goles_visitante !== null) && (
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                      {p.goles_local ?? 0} - {p.goles_visitante ?? 0}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {p.fecha}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {p.hora}
                  </span>
                  {p.lugar && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {p.lugar}
                    </span>
                  )}
                </div>
                {p.estado && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border w-fit ${ESTADO_BADGE[p.estado] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                    {p.estado}
                  </span>
                )}
              </div>
              <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}