import { z } from 'zod'

export const TrainingSchema = z.object({
  id:          z.string().uuid(),
  titulo:      z.string().min(1),
  fecha:       z.string(),
  hora:        z.string().nullable().optional(),
  lugar:       z.string().nullable().optional(),
  categoria:   z.string(),
  descripcion: z.string().nullable().optional(),
  activo:      z.boolean().default(true),
})

export const CreateTrainingSchema = TrainingSchema.omit({ id: true })

export type Training       = z.infer<typeof TrainingSchema>
export type CreateTraining = z.infer<typeof CreateTrainingSchema>