import { SupabaseTournamentRepository } from '@/repositories/supabase/TournamentRepository'
import type { CreateTournament } from '@/types/domain/tournament.schema'

const repo = new SupabaseTournamentRepository()

export const tournamentService = {
  getAll:       ()                                              => repo.getAll(),
  getById:      (id: string)                                    => repo.getById(id),
  getProximos:  ()                                              => repo.getProximos(),
  getHistorial: ()                                              => repo.getHistorial(),
  create:       (data: CreateTournament)                        => repo.create(data),
  update:       (id: string, data: Partial<CreateTournament>)   => repo.update(id, data),
  delete:       (id: string)                                    => repo.delete(id),
}