import { z } from 'zod'

export const TournamentSchema = z.object({
  id:           z.string().uuid(),
  nombre:       z.string().min(1),
  categoria:    z.string(),
  fecha_inicio: z.string(),
  fecha_fin:    z.string().nullable().optional(),
  estado:       z.enum(['proximo', 'en_curso', 'finalizado']),
  descripcion:  z.string().nullable().optional(),
  logo_url:     z.string().url().nullable().optional(),
  resultado:    z.string().nullable().optional(),
})

export const CreateTournamentSchema = TournamentSchema.omit({ id: true })

export type Tournament       = z.infer<typeof TournamentSchema>
export type CreateTournament = z.infer<typeof CreateTournamentSchema>