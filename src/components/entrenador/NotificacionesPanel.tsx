"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarLeida, marcarTodasLeidas, eliminarNotificacion } from "@/lib/entrenador/notificaciones";
import NotificacionCard from "@/components/entrenador/NotificacionCard";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

export default function NotificacionesPanel({
  notificaciones,
}: {
  notificaciones: Notificacion[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filtro, setFiltro] = useState<"todas" | "no_leidas">("todas");

  const noLeidas = notificaciones.filter((n) => !n.leida).length;
  const filtradas = filtro === "no_leidas"
    ? notificaciones.filter((n) => !n.leida)
    : notificaciones;

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleMarcarTodas() {
    await marcarTodasLeidas();
    refresh();
  }

  async function handleMarcarLeida(id: string) {
    await marcarLeida(id);
    refresh();
  }

  async function handleEliminar(id: string) {
    await eliminarNotificacion(id);
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro("todas")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              filtro === "todas"
                ? "bg-red-600 text-white shadow-md shadow-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todas ({notificaciones.length})
          </button>
          <button
            onClick={() => setFiltro("no_leidas")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              filtro === "no_leidas"
                ? "bg-red-600 text-white shadow-md shadow-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            No leídas ({noLeidas})
          </button>
        </div>

        {noLeidas > 0 && (
          <button
            onClick={handleMarcarTodas}
            disabled={isPending}
            className="text-sm font-bold text-red-600 hover:text-red-700 transition"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-lg">Sin notificaciones</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map((n) => (
            <NotificacionCard
              key={n.id}
              notificacion={n}
              onLeer={() => handleMarcarLeida(n.id)}
              onEliminar={() => handleEliminar(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}