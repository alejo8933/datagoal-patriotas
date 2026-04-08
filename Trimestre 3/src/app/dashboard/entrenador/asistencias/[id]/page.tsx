import { getEntrenamientoById, getJugadoresConAsistencia } from "@/lib/entrenador/asistencias";
import AsistenciasPanel from "@/components/entrenador/AsistenciasPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function TomarAsistenciaPage({
  params,
}: {
  params: { id: string };
}) {
  const [entrenamiento, jugadores] = await Promise.all([
    getEntrenamientoById(params.id),
    getJugadoresConAsistencia(params.id),
  ]);

  if (!entrenamiento) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/entrenador/asistencias"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-3"
        >
          <ArrowLeft size={16} />
          Volver a entrenamientos
        </Link>
        <h1 className="text-2xl font-bold text-white">{entrenamiento.titulo}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {entrenamiento.fecha} · {entrenamiento.hora} · {entrenamiento.lugar}
        </p>
      </div>

      {jugadores.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-lg text-gray-400">No hay jugadores activos</p>
        </div>
      ) : (
        <AsistenciasPanel
          jugadores={jugadores}
          entrenamientoId={params.id}
        />
      )}
    </div>
  );
}