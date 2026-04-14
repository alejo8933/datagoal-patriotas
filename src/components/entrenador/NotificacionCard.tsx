"use client";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

const TIPO_ICON: Record<string, string> = {
  partido: "⚽",
  entrenamiento: "🏃",
  torneo: "🏆",
  sistema: "🔔",
};

const PRIORIDAD_COLOR: Record<string, string> = {
  alta: "border-l-red-500",
  media: "border-l-yellow-500",
  baja: "border-l-blue-500",
};

export default function NotificacionCard({
  notificacion: n,
  onLeer,
  onEliminar,
}: {
  notificacion: Notificacion;
  onLeer: () => void;
  onEliminar: () => void;
}) {
  const fecha = new Date(n.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-white border text-gray-900 border-gray-100 border-l-4 ${PRIORIDAD_COLOR[n.prioridad] ?? "border-l-gray-300"} 
        rounded-xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow
        ${n.leida ? "opacity-60 bg-gray-50" : "opacity-100"}`}
    >
      <div className="text-2xl h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
        {TIPO_ICON[n.tipo] ?? "🔔"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-gray-900 ${!n.leida ? "font-bold" : "font-semibold"}`}>
            {n.titulo}
          </p>
          {!n.leida && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
        {n.descripcion && (
          <p className="text-sm text-gray-500 line-clamp-2">{n.descripcion}</p>
        )}
        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">{fecha}</p>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        {!n.leida && (
          <button
            onClick={onLeer}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition"
          >
            Leída
          </button>
        )}
        <button
          onClick={onEliminar}
          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-md transition"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}