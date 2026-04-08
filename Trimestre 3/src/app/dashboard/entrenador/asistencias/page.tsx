import { getEntrenamientos, getJugadoresConAsistencia, getReportesAsistencia } from "@/lib/entrenador/asistencias";
import AsistenciasPanel from "@/components/entrenador/AsistenciasPanel";

export default async function ControlAsistenciaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const entrenamientoId = typeof searchParams.entrenamientoId === 'string' ? searchParams.entrenamientoId : "";

  const [entrenamientos, reportes] = await Promise.all([
    getEntrenamientos(),
    getReportesAsistencia()
  ]);

  let jugadores: any[] = [];
  if (entrenamientoId) {
      jugadores = await getJugadoresConAsistencia(entrenamientoId);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Asistencia</h1>
        <p className="text-gray-500">Registra y controla la asistencia de jugadores a entrenamientos</p>
      </div>

      <AsistenciasPanel 
        entrenamientos={entrenamientos}
        initialEntrenamientoId={entrenamientoId}
        jugadores={jugadores} 
        reportes={reportes}
      />
    </div>
  );
}