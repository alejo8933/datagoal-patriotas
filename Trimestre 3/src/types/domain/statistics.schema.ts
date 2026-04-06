import { z } from 'zod'

export const GoalscorerSchema = z.object({
  id:          z.string().uuid(),
  nombre:      z.string(),
  apellido:    z.string(),
  categoria:   z.string(),
  goles:       z.number().int().min(0),
  asistencias: z.number().int().min(0),
  foto_url:    z.string().url().nullable().optional(),
})

export const TeamPerformanceSchema = z.object({
  id:           z.string().uuid(),
  equipo:       z.string(),
  categoria:    z.string(),
  partidos:     z.number().int().min(0),
  ganados:      z.number().int().min(0),
  empatados:    z.number().int().min(0),
  perdidos:     z.number().int().min(0),
  goles_favor:  z.number().int().min(0),
  goles_contra: z.number().int().min(0),
  puntos:       z.number().int().min(0),
})

export type Goalscorer      = z.infer<typeof GoalscorerSchema>
export type TeamPerformance = z.infer<typeof TeamPerformanceSchema>