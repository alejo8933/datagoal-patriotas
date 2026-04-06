import { z } from 'zod'

export const UserSchema = z.object({
  id:     z.string().uuid(),
  email:  z.string().email(),
  rol:    z.enum(['admin', 'entrenador', 'jugador']),
  activo: z.boolean().default(true),
})

export const LoginSchema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const RegisterSchema = z.object({
  email:           z.string().email(),
  password:        z.string().min(6),
  nombre:          z.string().min(1).max(100),
  apellido:        z.string().min(1).max(100),
  telefono:        z.string().min(7),
  fechaNacimiento: z.string(),
  posicion:        z.string().min(1),
  categoria:       z.string().min(1),
})

export type User     = z.infer<typeof UserSchema>
export type Login    = z.infer<typeof LoginSchema>
export type Register = z.infer<typeof RegisterSchema>