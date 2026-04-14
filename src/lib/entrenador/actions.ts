"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificarActividadAdmin } from "./notificaciones";

export async function agregarEvento(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const partidoId  = formData.get("partido_id") as string;
  const jugadorId  = formData.get("jugador_id") as string || null;
  const minuto     = formData.get("minuto") ? Number(formData.get("minuto")) : null;
  const tipo       = formData.get("tipo") as string;
  const equipo     = formData.get("equipo") as string;
  const descripcion = formData.get("descripcion") as string || null;

  await supabase.from("eventos_partido").insert({
    partido_id: partidoId,
    jugador_id: jugadorId || null,
    minuto,
    tipo,
    equipo,
    descripcion,
  });

  // --- SINCRONIZACIÓN DE ESTADÍSTICAS ---

  // 1. Actualizar marcador del partido si es gol
  if (tipo === "gol") {
    const { data: partido } = await supabase
      .from("partidos")
      .select("goles_local, goles_visitante")
      .eq("id", partidoId)
      .single();

    if (partido) {
      await supabase
        .from("partidos")
        .update({
          goles_local:
            equipo === "local"
              ? (partido.goles_local ?? 0) + 1
              : partido.goles_local ?? 0,
          goles_visitante:
            equipo === "visitante"
              ? (partido.goles_visitante ?? 0) + 1
              : partido.goles_visitante ?? 0,
        })
        .eq("id", partidoId);
    }
  }

  // 2. Actualizar estadísticas individuales del JUGADOR
  if (jugadorId) {
    const { data: jugador } = await supabase
      .from("jugadores")
      .select("goles, tarjetas_amarillas, tarjetas_rojas")
      .eq("id", jugadorId)
      .single();

    if (jugador) {
      const updates: any = {};
      if (tipo === "gol") updates.goles = (jugador.goles || 0) + 1;
      if (tipo === "tarjeta_amarilla") updates.tarjetas_amarillas = (jugador.tarjetas_amarillas || 0) + 1;
      if (tipo === "tarjeta_roja") updates.tarjetas_rojas = (jugador.tarjetas_rojas || 0) + 1;

      if (Object.keys(updates).length > 0) {
        await supabase.from("jugadores").update(updates).eq("id", jugadorId);
      }
    }

    // Notificar al administrador
    await notificarActividadAdmin({
      titulo: 'Nuevo Evento en Partido',
      descripcion: `Se ha registrado un(a) ${tipo} en el partido.`,
      tipo: 'partido'
    });
  }

  revalidatePath(`/dashboard/entrenador/partidos`);
  revalidatePath(`/dashboard/admin/jugadores`);
}

export async function eliminarEvento(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  // Obtener datos del evento antes de borrar para revertir estadísticas
  const { data: evento } = await supabase
    .from("eventos_partido")
    .select("*")
    .eq("id", id)
    .single();

  if (evento) {
    // Revertir marcador de partido
    if (evento.tipo === "gol") {
      const { data: partido } = await supabase.from("partidos").select("*").eq("id", evento.partido_id).single();
      if (partido) {
        await supabase.from("partidos").update({
          goles_local: evento.equipo === "local" ? Math.max(0, (partido.goles_local || 0) - 1) : partido.goles_local,
          goles_visitante: evento.equipo === "visitante" ? Math.max(0, (partido.goles_visitante || 0) - 1) : partido.goles_visitante,
        }).eq("id", evento.partido_id);
      }
    }

    // Revertir estadísticas de jugador
    if (evento.jugador_id) {
      const { data: jugador } = await supabase.from("jugadores").select("*").eq("id", evento.jugador_id).single();
      if (jugador) {
        const updates: any = {};
        if (evento.tipo === "gol") updates.goles = Math.max(0, (jugador.goles || 0) - 1);
        if (evento.tipo === "tarjeta_amarilla") updates.tarjetas_amarillas = Math.max(0, (jugador.tarjetas_amarillas || 0) - 1);
        if (evento.tipo === "tarjeta_roja") updates.tarjetas_rojas = Math.max(0, (jugador.tarjetas_rojas || 0) - 1);
        
        if (Object.keys(updates).length > 0) {
          await supabase.from("jugadores").update(updates).eq("id", evento.jugador_id);
        }
      }
    }
  }

  await supabase.from("eventos_partido").delete().eq("id", id);
  revalidatePath(`/dashboard/entrenador/partidos`);
  revalidatePath(`/dashboard/admin/jugadores`);
}
