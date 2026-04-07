'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registrarPago(formData: FormData) {
  const supabase = await createClient()

  const jugador = formData.get('jugador')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()

  if (!jugador || !monto || !fecha) {
    return {
      success: false,
      message: 'Todos los campos son obligatorios para asentar un pago.',
    }
  }

  // Insertar en la tabla de facturas/pagos (Asumimos public.facturas para este prototipo)
  const { data, error } = await supabase
    .from('facturas')
    .insert([
      {
        jugador,
        monto: parseFloat(monto),
        fecha,
        estado: 'Pagado'
      },
    ])
    .select()

  if (error) {
    console.error('Error procesando pago:', error)
    return {
      success: false,
      message: 'No pudimos registrar este pago. Quizá la tabla no esté lista.',
      error: error.message,
    }
  }

  revalidatePath('/dashboard/admin/finanzas')

  return {
    success: true,
    message: 'Pago registrado y contabilizado.',
  }
}

export async function anadirGasto(formData: FormData) {
  const supabase = await createClient()

  const concepto = formData.get('concepto')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()

  if (!concepto || !monto || !fecha) {
    return {
      success: false,
      message: 'El Concepto, el Monto y la Fecha son obligatorios.',
    }
  }

  // Intentamos guardar en la tabla pública de 'gastos'
  const { data, error } = await supabase
    .from('gastos')
    .insert([
      {
        concepto,
        categoria: categoria || 'General',
        monto: parseFloat(monto),
        fecha
      },
    ])
    .select()

  if (error) {
    console.error('Error insertando gasto:', error)
    return {
      success: false,
      message: 'Error al reportar el gasto. Comprueba si la tabla `gastos` existe en la base de datos.',
      error: error.message,
    }
  }

  revalidatePath('/dashboard/admin/finanzas')

  return {
    success: true,
    message: 'Gasto reportado y restado del balance exitosamente.',
  }
}
