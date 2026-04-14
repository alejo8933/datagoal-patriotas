import type { Match, CreateMatch } from '@/types/domain/match.schema'

export interface IMatchRepository {
  getAll():                                        Promise<Match[]>
  getById(id: string):                             Promise<Match | null>
  getByCategoria(categoria: string):               Promise<Match[]>
  create(data: CreateMatch):                       Promise<Match>
  update(id: string, data: Partial<CreateMatch>):  Promise<Match>
  delete(id: string):                              Promise<void>
}