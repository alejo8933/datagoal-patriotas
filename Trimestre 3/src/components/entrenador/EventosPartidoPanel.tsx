"use client";
import { useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { agregarEvento, eliminarEvento } from "@/lib/entrenador/partidos";
import { Trash2, Loader2 } from "lucide-react";

const TIPO_ICON: Record<string, string> = {
  gol:              "⚽",
  tarjeta_amarilla: "🟨",
  tarjeta_roja:     "🟥",
  cambio:           "🔄",
  otro:             "📋",
};

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
};

type Evento = {
  id: string;
  minuto: number | null;
  tipo: string;
  equipo: string | null;
  descripcion: string | null;
  jugadores: { id: string; nombre: string; apellido: string; numero_camiseta: number | null }[] | null;
};

export default function EventosPartidoPanel({
  partido,
  eventos,
  jugadores,
}: {
  partido: any;
  eventos: Evento[];
  jugadores: Jugador[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAgregar(formData: FormData) {
    await agregarEvento(formData);
    formRef.current?.reset();
    startTransition(() => router.refresh());
  }

  async function handleEliminar(formData: FormData) {
    await eliminarEvento(formData);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Formulario agregar evento */}
      <form
        ref={formRef}
        action={handleAgregar}
        className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3"
      >
        <h2 className="text-sm font-semibold text-white">Agregar evento</h2>
        <input type="hidden" name="partido_id" value={partido.id} />

        <div className="grid grid-cols-2 gap-3">
          {/* Tipo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Tipo *</label>
            <select
              name="tipo"
              required
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="gol">⚽ Gol</option>
              <option value="tarjeta_amarilla">🟨 Tarjeta amarilla</option>
              <option value="tarjeta_roja">🟥 Tarjeta roja</option>
              <option value="cambio">🔄 Cambio</option>
              <option value="otro">📋 Otro</option>
            </select>
          </div>

          {/* Equipo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Equipo *</label>
            <select
              name="equipo"
              required
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="local">{partido.equipo_local} (Local)</option>
              <option value="visitante">{partido.equipo_visitante} (Visitante)</option>
            </select>
          </div>

          {/* Jugador */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Jugador</label>
            <select
              name="jugador_id"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">— Sin jugador —</option>
              {jugadores.map((j) => (
                <option key={j.id} value={j.id}>
                  #{j.numero_camiseta ?? "?"} {j.apellido}, {j.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Minuto */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Minuto</label>
            <input
              type="number"
              name="minuto"
              min={1}
              max={120}
              placeholder="Ej: 45"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Descripción (opcional)</label>
          <input
            type="text"
            name="descripcion"
            placeholder="Detalles del evento..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : "Registrar evento"}
        </button>
      </form>

      {/* Lista de eventos */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">
          Eventos registrados ({eventos.length})
        </h2>

        {eventos.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/10">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">Sin eventos registrados aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {eventos.map((e) => (
              <div
                key={e.id}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{TIPO_ICON[e.tipo] ?? "📋"}</span>
                  <div>
                    <p className="text-white text-sm font-medium">
                     {e.jugadores && e.jugadores.length > 0
                        ? `${e.jugadores[0].apellido}, ${e.jugadores[0].nombre} (#${e.jugadores[0].numero_camiseta ?? "?"})`
                    : "Sin jugador"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {e.equipo === "local" ? partido.equipo_local : partido.equipo_visitante}
                      {e.minuto ? ` · min. ${e.minuto}` : ""}
                      {e.descripcion ? ` · ${e.descripcion}` : ""}
                    </p>
                  </div>
                </div>

                <form action={handleEliminar}>
                  <input type="hidden" name="id" value={e.id} />
                  <input type="hidden" name="partido_id" value={partido.id} />
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}