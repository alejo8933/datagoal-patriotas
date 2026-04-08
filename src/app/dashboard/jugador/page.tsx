import logoutAction from '@/services/actions/logout'

export default function JugadorDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Módulo Jugador</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-700">Bienvenido a tu panel de jugador. Aquí podrás ver tus estadísticas, próximos partidos y asistencias a entrenamientos.</p>
      </div>
      <form action={logoutAction}>
        <button type="submit" className="bg-red-100 text-red-700 px-4 py-2 rounded font-medium hover:bg-red-200 transition self-start">
          Cerrar Sesión
        </button>
      </form>
    </div>
  )
}
