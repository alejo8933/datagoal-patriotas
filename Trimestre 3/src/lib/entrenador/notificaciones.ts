"use server";
import { createClient } from "@/lib/supabase/server";

export async function getNotificaciones() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function marcarLeida(id: string) {
  const supabase = await createClient();
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("id", id);
}

export async function marcarTodasLeidas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("user_id", user.id)
    .eq("leida", false);
}

export async function eliminarNotificacion(id: string) {
  const supabase = await createClient();
  await supabase.from("notificaciones").delete().eq("id", id);
}

export async function crearNotificacion({
  user_id,
  titulo,
  descripcion,
  tipo = "sistema",
  prioridad = "baja",
}: {
  user_id: string;
  titulo: string;
  descripcion?: string;
  tipo?: string;
  prioridad?: string;
}) {
  const supabase = await createClient();
  await supabase.from("notificaciones").insert({
    user_id, titulo, descripcion, tipo, prioridad,
  });
}

export async function notificarActividadAdmin({
  titulo,
  descripcion,
  tipo = "coach_activity",
  prioridad = "media",
}: {
  titulo: string;
  descripcion?: string;
  tipo?: string;
  prioridad?: string;
}) {
  const supabase = await createClient();
  
  // 1. Obtener todos los administradores
  const { data: admins } = await supabase
    .from("perfiles")
    .select("id")
    .eq("rol", "admin");

  if (!admins || admins.length === 0) return;

  // 2. Crear las notificaciones en lote
  const notificationsToInsert = admins.map(admin => ({
    user_id: admin.id,
    titulo,
    descripcion,
    tipo,
    prioridad,
  }));

  await supabase.from("notificaciones").insert(notificationsToInsert);
}