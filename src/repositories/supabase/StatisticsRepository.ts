import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { IStatisticsRepository } from '@/repositories/IStatisticsRepository'
import type { Goalscorer, TeamPerformance } from '@/types/domain/statistics.schema'
import type { SupabaseClient } from '@supabase/supabase-js'

export class SupabaseStatisticsRepository implements IStatisticsRepository {
  constructor(private customClient?: SupabaseClient<any, any, any>) {}

  private getClient() {
    return this.customClient || createBrowserClient()
  }

  async getGoalscorers(): Promise<Goalscorer[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .select('id, nombre, apellido, categoria, goles, asistencias, foto_url')
      .gt('goles', 0)
      .order('goles', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getTeamPerformance(): Promise<TeamPerformance[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('rendimiento_equipos')
      .select('*')
      .order('puntos', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }
}