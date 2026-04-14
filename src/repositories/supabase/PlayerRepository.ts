import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { IPlayerRepository } from '@/repositories/IPlayerRepository'
import type { Player, CreatePlayer } from '@/types/domain/player.schema'
import type { SupabaseClient } from '@supabase/supabase-js'

export class SupabasePlayerRepository implements IPlayerRepository {
  constructor(private customClient?: SupabaseClient<any, any, any>) {}

  private getClient() {
    return this.customClient || createBrowserClient()
  }

  async getAll(): Promise<Player[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .order('apellido', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getById(id: string): Promise<Player | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async getByCategoria(categoria: string): Promise<Player[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .eq('categoria', categoria)
      .order('apellido', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async create(datos: CreatePlayer): Promise<Player> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .insert(datos)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async update(id: string, datos: Partial<CreatePlayer>): Promise<Player> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('jugadores')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async delete(id: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.from('jugadores').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}