import { createClient } from '@/lib/supabase/client'
import type { ITournamentRepository } from '@/repositories/ITournamentRepository'
import type { Tournament, CreateTournament } from '@/types/domain/tournament.schema'

export class SupabaseTournamentRepository implements ITournamentRepository {
  async getAll(): Promise<Tournament[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .order('fecha_inicio', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getById(id: string): Promise<Tournament | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async getProximos(): Promise<Tournament[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .eq('estado', 'proximo')
      .order('fecha_inicio', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getHistorial(): Promise<Tournament[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .eq('estado', 'finalizado')
      .order('fecha_inicio', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async create(datos: CreateTournament): Promise<Tournament> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .insert(datos)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async update(id: string, datos: Partial<CreateTournament>): Promise<Tournament> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('torneos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('torneos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}