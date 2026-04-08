"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPartidos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partidos")
    .select("id, equipo_local, equipo_visitante, fecha, hora, lugar, estado, categoria, goles_local, goles_visitante")
    .order("fecha", { ascending: false });
  return data ?? [];
}

export async function getPartidoById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partidos")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getEventosPartido(partidoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos_partido")
    .select(`
      id, minuto, tipo, equipo, descripcion, created_at,
      jugadores (id, nombre, apellido, numero_camiseta)
    `)
    .eq("partido_id", partidoId)
    .order("minuto", { ascending: true });
  return data ?? [];
}

export async function getJugadoresActivos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, numero_camiseta, posicion")
    .eq("activo", true)
    .order("apellido", { ascending: true });
  return data ?? [];
}

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

  // Actualizar marcador si es gol
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

  revalidatePath(`/dashboard/entrenador/partidos/${partidoId}`);
}

export async function eliminarEvento(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const partidoId = formData.get("partido_id") as string;
  await supabase.from("eventos_partido").delete().eq("id", id);
  revalidatePath(`/dashboard/entrenador/partidos/${partidoId}`);
}