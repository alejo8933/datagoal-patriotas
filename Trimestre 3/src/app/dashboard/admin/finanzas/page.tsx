import { createClient } from '@/lib/supabase/server'
import { Wallet, TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react'
import ModalRegistrarPago from '@/components/features/finanzas/ModalRegistrarPago'
import ModalAnadirGasto from '@/components/features/finanzas/ModalAnadirGasto'

export default async function AdminFinanzasPage() {
  const supabase = await createClient()

  // Intentamos obtener facturas asumiendo que están en 'public' o fallará y mostraremos el fallback.
  // En caso de que estén en un esquema específico se debe adaptar en la Fase 2.
  const { data: facturasRaw, error } = await supabase
    .from('facturas')
    .select('*')
    .limit(10)

  // Datos mockeados de apoyo para interfaces visuales (Fase 1)
  const facturas = facturasRaw || [
    { id: '101', jugador: 'Carlos Pérez', fecha: '2026-04-01', monto: 150000, estado: 'Pagado' },
    { id: '102', jugador: 'Luis Ramírez', fecha: '2026-04-03', monto: 150000, estado: 'Pendiente' },
    { id: '103', jugador: 'Mateo Gómez', fecha: '2026-03-28', monto: 150000, estado: 'Vencido' },
  ]

  const gastos = [
    { id: 'G-001', concepto: 'Compra de 10 Balones Golty', fecha: '2026-04-02', monto: 450000, categoria: 'Equipamiento' },
    { id: 'G-002', concepto: 'Alquiler Cancha Sintética Parque', fecha: '2026-04-05', monto: 200000, categoria: 'Instalaciones' },
  ]

  // Cálculo rápido
  const ingresosTotal = facturas.filter(f => f.estado === 'Pagado').reduce((acc, curr) => acc + curr.monto, 0)
  const gastosTotal = gastos.reduce((acc, curr) => acc + curr.monto, 0)
  const balance = ingresosTotal - gastosTotal

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Wallet className="text-red-600" />
            Finanzas y Administración
          </h1>
          <p className="text-gray-500 mt-1">Controla los ingresos por mensualidades y los gastos operativos del club.</p>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-white/10">
            <DollarSign size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-300 font-medium mb-1">Balance Actual</p>
            <h2 className="text-4xl font-bold mb-4">${balance.toLocaleString()} COP</h2>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingUp size={16} />
              <span>+12% respecto al mes anterior</span>
            </div>
          </div>
        </div>

        {/* Ingresos */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-gray-500 font-medium">Total Ingresos (Mensualidades)</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">${ingresosTotal.toLocaleString()} COP</h3>
        </div>

        {/* Egresos */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <TrendingDown size={24} />
              </div>
            </div>
            <p className="text-gray-500 font-medium">Gastos Operativos (Club)</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">${gastosTotal.toLocaleString()} COP</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MENSUALIDADES (INGRESOS) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Receipt size={20} className="text-green-600" />
              Estado de Mensualidades
            </h3>
            <ModalRegistrarPago />
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Jugador</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium text-right">Monto</th>
                  <th className="px-4 py-3 font-medium text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facturas.map((fac) => (
                  <tr key={fac.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{fac.jugador}</td>
                    <td className="px-4 py-3 text-gray-500">{fac.fecha}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">${fac.monto.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        fac.estado === 'Pagado' ? 'bg-green-100 text-green-700' :
                        fac.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {fac.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-sm text-green-600 font-medium hover:underline">Ver todas las facturas &rarr;</button>
          </div>
        </div>

        {/* GASTOS (EGRESOS) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <TrendingDown size={20} className="text-red-600" />
              Gastos del Club
            </h3>
            <ModalAnadirGasto />
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Concepto</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[150px]">{gasto.concepto}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {gasto.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{gasto.fecha}</td>
                    <td className="px-4 py-3 text-right font-mono text-red-600 font-medium">-${gasto.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-sm text-red-600 font-medium hover:underline">Ver historial de gastos &rarr;</button>
          </div>
        </div>

      </div>
    </div>
  )
}
