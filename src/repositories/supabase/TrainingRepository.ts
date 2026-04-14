import { createClient } from '@/lib/supabase/client'
import type { ITrainingRepository } from '@/repositories/ITrainingRepository'
import type { Training, CreateTraining } from '@/types/domain/training.schema'

export class SupabaseTrainingRepository implements ITrainingRepository {
  async getAll(): Promise<Training[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*')
      .order('fecha', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getById(id: string): Promise<Training | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async getByCategoria(categoria: string): Promise<Training[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async create(datos: CreateTraining): Promise<Training> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entrenamientos')
      .insert(datos)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async update(id: string, datos: Partial<CreateTraining>): Promise<Training> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('entrenamientos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('entrenamientos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}