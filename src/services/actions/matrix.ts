'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type MatrixData = { [key: string]: string }

/**
 * Genera una matriz de 5x5 (A-E, 1-5) con valores aleatorios de 3 dígitos.
 */
function generateRandomMatrix(): MatrixData {
  const matrix: MatrixData = {}
  const rows = ['A', 'B', 'C', 'D', 'E']
  const cols = ['1', '2', '3', '4', '5']

  for (const row of rows) {
    for (const col of cols) {
      // Generar número aleatorio entre 100 y 999
      const value = Math.floor(100 + Math.random() * 900).toString()
      matrix[`${row}${col}`] = value
    }
  }
  return matrix
}

/**
 * Crea o actualiza la matriz de seguridad para el usuario actual.
 */
export async function generarMatrizUsuario() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'No estás autenticado.' }

  const matrixData = generateRandomMatrix()

  const { error } = await supabase
    .from('perfiles_matrices')
    .upsert({
      perfil_id: user.id,
      matriz_data: matrixData,
      actualizado_en: new Date().toISOString()
    })

  if (error) {
    console.error('Error al guardar matriz:', error)
    return { success: false, message: 'No se pudo generar la matriz.' }
  }

  revalidatePath('/dashboard/perfil/seguridad')
  return { success: true, matrix: matrixData }
}

/**
 * Obtiene la matriz de seguridad del usuario actual.
 */
export async function obtenerMatrizUsuario() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'No estás autenticado.' }

  const { data, error } = await supabase
    .from('perfiles_matrices')
    .select('matriz_data')
    .eq('perfil_id', user.id)
    .single()

  if (error || !data) {
    return { success: false, message: 'No tienes una matriz de seguridad activa.' }
  }

  return { success: true, matrix: data.matriz_data as MatrixData }
}

/**
 * Valida un conjunto de coordenadas contra la matriz del usuario.
 * @param reto Coordenadas enviadas por el usuario { A1: '123', B3: '456' }
 */
export async function validarRetoMatriz(reto: MatrixData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'No estás autenticado.' }

  const { data, error } = await supabase
    .from('perfiles_matrices')
    .select('matriz_data')
    .eq('perfil_id', user.id)
    .single()

  if (error || !data) {
    return { success: false, message: 'No se encontró la matriz de seguridad.' }
  }

  const matrix = data.matriz_data as MatrixData
  const keys = Object.keys(reto)

  for (const key of keys) {
    if (matrix[key] !== reto[key]) {
      return { success: false, message: 'Las coordenadas ingresadas son incorrectas.' }
    }
  }

  return { success: true, message: 'Validación exitosa.' }
}
