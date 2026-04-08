import { createClient } from '@/lib/supabase/client'
import type { IMatchRepository } from '@/repositories/IMatchRepository'
import type { Match, CreateMatch } from '@/types/domain/match.schema'

export class SupabaseMatchRepository implements IMatchRepository {
  async getAll(): Promise<Match[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .order('fecha', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getById(id: string): Promise<Match | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async getByCategoria(categoria: string): Promise<Match[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async create(datos: CreateMatch): Promise<Match> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partidos')
      .insert(datos)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async update(id: string, datos: Partial<CreateMatch>): Promise<Match> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partidos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('partidos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}