import { SupabaseMatchRepository } from '@/repositories/supabase/MatchRepository'
import type { CreateMatch } from '@/types/domain/match.schema'

const repo = new SupabaseMatchRepository()

export const matchService = {
  getAll:         ()                                        => repo.getAll(),
  getById:        (id: string)                              => repo.getById(id),
  getByCategoria: (categoria: string)                       => repo.getByCategoria(categoria),
  create:         (data: CreateMatch)                       => repo.create(data),
  update:         (id: string, data: Partial<CreateMatch>)  => repo.update(id, data),
  delete:         (id: string)                              => repo.delete(id),
}