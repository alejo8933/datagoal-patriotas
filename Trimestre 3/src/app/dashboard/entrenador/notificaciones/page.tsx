// src/app/dashboard/entrenador/notificaciones/page.tsx

import { getNotificaciones } from "@/lib/entrenador/notificaciones";
import NotificacionesPanel from "@/components/entrenador/NotificacionesPanel";

export default async function NotificacionesPage() {
  const notificaciones = await getNotificaciones();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Notificaciones</h1>
      <NotificacionesPanel notificaciones={notificaciones} />
    </div>
  );
}