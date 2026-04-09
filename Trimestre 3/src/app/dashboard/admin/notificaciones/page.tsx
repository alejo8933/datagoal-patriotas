import { getNotificaciones } from "@/lib/entrenador/notificaciones";
import NotificacionesPanel from "@/components/entrenador/NotificacionesPanel";

export default async function AdminNotificacionesPage() {
  const notificaciones = await getNotificaciones();

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Sigue de cerca toda la actividad de los entrenadores y el club</p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <NotificacionesPanel notificaciones={notificaciones} />
      </div>
    </div>
  );
}
