"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarAsistencia } from "@/lib/entrenador/asistencias";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  numero_camiseta: number | null;
  foto_url: string | null;
  presente: boolean | null;
  excusa: string;
  registrado: boolean;
};

export default function AsistenciasPanel({
  jugadores,
  entrenamientoId,
}: {
  jugadores: Jugador[];
  entrenamientoId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [estados, setEstados] = useState<Record<string, boolean | null>>(
    Object.fromEntries(jugadores.map((j) => [j.id, j.presente]))
  );
  const [guardando, setGuardando] = useState<string | null>(null);

  const presentes = Object.values(estados).filter((v) => v === true).length;
  const ausentes = Object.values(estados).filter((v) => v === false).length;
  const sinMarcar = Object.values(estados).filter((v) => v === null).length;

  async function marcar(jugadorId: string, presente: boolean) {
    setGuardando(jugadorId);
    setEstados((prev) => ({ ...prev, [jugadorId]: presente }));
    await guardarAsistencia(jugadorId, entrenamientoId, presente);
    setGuardando(null);
    startTransition(() => router.refresh());
  }

  async function marcarTodos(presente: boolean) {
    for (const jugador of jugadores) {
      await guardarAsistencia(jugador.id, entrenamientoId, presente);
    }
    setEstados(Object.fromEntries(jugadores.map((j) => [j.id, presente])));
    startTransition(() => router.refresh());
  }

  return (
    <div>
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{presentes}</p>
          <p className="text-xs text-gray-400 mt-0.5">Presentes</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{ausentes}</p>
          <p className="text-xs text-gray-400 mt-0.5">Ausentes</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-400">{sinMarcar}</p>
          <p className="text-xs text-gray-400 mt-0.5">Sin marcar</p>
        </div>
      </div>

      {/* Acciones masivas */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => marcarTodos(true)}
          disabled={isPending}
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition"
        >
          ✅ Marcar todos presentes
        </button>
        <button
          onClick={() => marcarTodos(false)}
          disabled={isPending}
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
        >
          ❌ Marcar todos ausentes
        </button>
      </div>

      {/* Lista de jugadores */}
      <div className="flex flex-col gap-2">
        {jugadores.map((jugador) => {
          const estado = estados[jugador.id];
          const cargando = guardando === jugador.id;

          return (
            <div
              key={jugador.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 border transition
                ${estado === true
                  ? "bg-green-500/10 border-green-500/20"
                  : estado === false
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-white/5 border-white/10"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Número camiseta */}
                <span className="w-8 h-8 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {jugador.numero_camiseta ?? "—"}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">
                    {jugador.nombre} {jugador.apellido}
                  </p>
                  <p className="text-xs text-gray-500">
                    {jugador.posicion ?? "Sin posición"} · {jugador.categoria ?? ""}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center gap-2">
                {cargando ? (
                  <Loader2 size={18} className="text-gray-400 animate-spin" />
                ) : (
                  <>
                    <button
                      onClick={() => marcar(jugador.id, true)}
                      className={`p-1.5 rounded-lg transition ${
                        estado === true
                          ? "text-green-400"
                          : "text-gray-500 hover:text-green-400"
                      }`}
                      title="Presente"
                    >
                      <CheckCircle2 size={22} />
                    </button>
                    <button
                      onClick={() => marcar(jugador.id, false)}
                      className={`p-1.5 rounded-lg transition ${
                        estado === false
                          ? "text-red-400"
                          : "text-gray-500 hover:text-red-400"
                      }`}
                      title="Ausente"
                    >
                      <XCircle size={22} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}