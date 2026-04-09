"use server";
import { createClient } from "@/lib/supabase/server";
import { notificarActividadAdmin } from "./notificaciones";

export async function getEntrenamientos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entrenamientos")
    .select("id, titulo, fecha, hora, lugar, categoria, activo")
    .order("fecha", { ascending: false });
  return data ?? [];
}

export async function getEntrenamientoById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entrenamientos")
    .select("id, titulo, fecha, hora, lugar, categoria")
    .eq("id", id)
    .single();
  return data;
}

export async function getJugadoresConAsistencia(entrenamientoId: string) {
  const supabase = await createClient();

  const { data: jugadores } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, posicion, categoria, numero_camiseta, foto_url")
    .eq("activo", true)
    .order("apellido", { ascending: true });

  const { data: asistencias } = await supabase
    .from("asistencias")
    .select("jugador_id, presente, excusa, hora_llegada")
    .eq("entrenamiento_id", entrenamientoId);

  const asistenciaMap = new Map(
    (asistencias ?? []).map((a) => [a.jugador_id, a])
  );

  return (jugadores ?? []).map((j) => ({
    ...j,
    presente: asistenciaMap.get(j.id)?.presente ?? null,
    excusa: asistenciaMap.get(j.id)?.excusa ?? "",
    hora_llegada: asistenciaMap.get(j.id)?.hora_llegada ?? "",
    registrado: asistenciaMap.has(j.id),
  }));
}

export async function guardarAsistencia(
  jugadorId: string,
  entrenamientoId: string,
  presente: boolean,
  excusa?: string,
  hora_llegada?: string
) {
  const supabase = await createClient();
  await supabase
    .from("asistencias")
    .upsert(
      {
        jugador_id: jugadorId,
        entrenamiento_id: entrenamientoId,
        presente,
        excusa: excusa ?? null,
        hora_llegada: hora_llegada ?? null,
      },
      { onConflict: "jugador_id,entrenamiento_id" }
    );
}

export async function guardarAsistenciasBulk(
  entrenamientoId: string,
  asistencias: {
    jugadorId: string;
    presente: boolean | null;
    excusa?: string;
    horaLlegada?: string;
    notas?: string;
  }[]
) {
  const supabase = await createClient();
  
  // Obtener info del entrenamiento para el mensaje
  const { data: entrenamiento } = await supabase
    .from("entrenamientos")
    .select("titulo, fecha")
    .eq("id", entrenamientoId)
    .single();

  const payload = asistencias.map((a) => ({
    jugador_id: a.jugadorId,
    entrenamiento_id: entrenamientoId,
    presente: a.presente ?? false,
    excusa: a.notas ? a.notas : (a.excusa ?? null), 
    hora_llegada: a.horaLlegada ?? null,
  }));

  const { error } = await supabase
    .from("asistencias")
    .upsert(payload, { onConflict: "jugador_id,entrenamiento_id" });

  if (!error) {
    const presentCount = asistencias.filter(a => a.presente).length;
    await notificarActividadAdmin({
      titulo: 'Asistencia Actualizada',
      descripcion: `Un entrenador ha actualizado la asistencia para "${entrenamiento?.titulo || 'Entrenamiento'}". Asistieron ${presentCount} jugadores.`,
      tipo: 'asistencia'
    });
  }
}


export async function getReportesAsistencia() {
  const supabase = await createClient();

  const { data: jugadores } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, posicion, categoria, numero_camiseta")
    .eq("activo", true)
    .order("apellido", { ascending: true });

  const { data: asistencias } = await supabase
    .from("asistencias")
    .select("jugador_id, presente");

  const records = asistencias ?? [];
  
  return (jugadores ?? []).map((j) => {
    const playerRecords = records.filter(a => a.jugador_id === j.id);
    const total = playerRecords.length;
    const presentes = playerRecords.filter(a => a.presente === true).length;
    const ausentes = total - presentes;
    const porcentaje = total > 0 ? (presentes / total) * 100 : 0;

    return {
      ...j,
      totalEntrenamientos: total,
      presentes,
      ausentes,
      porcentajeTotal: porcentaje,
    };
  });
}