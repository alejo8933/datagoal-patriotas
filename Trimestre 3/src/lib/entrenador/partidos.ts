import { createClient } from "@/lib/supabase/server";

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