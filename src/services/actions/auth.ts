'use server'

/**
 * Valida si el código de acceso proporcionado coincide con el configurado para el rol especificado.
 * Esta validación ocurre en el servidor para proteger los códigos secretos.
 */
export async function validarCodigoRegistro(rol: string, codigo: string) {
  if (rol === 'jugador') return { success: true }

  const codeAdmin = process.env.REGISTRY_CODE_ADMIN
  const codeTrainer = process.env.REGISTRY_CODE_TRAINER

  if (rol === 'admin') {
    if (codigo === codeAdmin) {
      return { success: true }
    }
    return { success: false, message: 'El código de acceso para Administrador es incorrecto.' }
  }

  if (rol === 'entrenador') {
    if (codigo === codeTrainer) {
      return { success: true }
    }
    return { success: false, message: 'El código de acceso para Entrenador es incorrecto.' }
  }

  return { success: false, message: 'Rol no válido para validación de código.' }
}
