import type { Tournament, CreateTournament } from '@/types/domain/tournament.schema'

export interface ITournamentRepository {
  getAll():                                               Promise<Tournament[]>
  getById(id: string):                                    Promise<Tournament | null>
  getProximos():                                          Promise<Tournament[]>
  getHistorial():                                         Promise<Tournament[]>
  create(data: CreateTournament):                         Promise<Tournament>
  update(id: string, data: Partial<CreateTournament>):    Promise<Tournament>
  delete(id: string):                                     Promise<void>
}