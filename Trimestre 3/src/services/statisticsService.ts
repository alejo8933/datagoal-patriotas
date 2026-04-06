import { SupabaseStatisticsRepository } from '@/repositories/supabase/StatisticsRepository'

const repo = new SupabaseStatisticsRepository()

export const statisticsService = {
  getGoalscorers:     () => repo.getGoalscorers(),
  getTeamPerformance: () => repo.getTeamPerformance(),
}