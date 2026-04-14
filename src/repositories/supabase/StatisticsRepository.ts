import { createClient } from '@/lib/supabase/client'
import type { IStatisticsRepository } from '@/repositories/IStatisticsRepository'
import type { Goalscorer, TeamPerformance } from '@/types/domain/statistics.schema'

export class SupabaseStatisticsRepository implements IStatisticsRepository {
  async getGoalscorers(): Promise<Goalscorer[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jugadores')
      .select('id, nombre, apellido, categoria, goles, asistencias, foto_url')
      .gt('goles', 0)
      .order('goles', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getTeamPerformance(): Promise<TeamPerformance[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('rendimiento_equipos')
      .select('*')
      .order('puntos', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }
}