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