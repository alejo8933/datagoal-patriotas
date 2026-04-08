import type { Goalscorer, TeamPerformance } from '@/types/domain/statistics.schema'

export interface IStatisticsRepository {
  getGoalscorers():     Promise<Goalscorer[]>
  getTeamPerformance(): Promise<TeamPerformance[]>
}