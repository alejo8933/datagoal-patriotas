import { SupabaseStatisticsRepository } from '@/repositories/supabase/StatisticsRepository'
import { createClient } from '@/lib/supabase/server'

export const getStatisticsServiceServer = async () => {
  const supabaseServer = await createClient()
  const repo = new SupabaseStatisticsRepository(supabaseServer)
  
  return {
    getGoalscorers:     () => repo.getGoalscorers(),
    getTeamPerformance: () => repo.getTeamPerformance(),
  }
}
