import { SupabaseTrainingRepository } from '@/repositories/supabase/TrainingRepository'
import type { CreateTraining } from '@/types/domain/training.schema'

const repo = new SupabaseTrainingRepository()

export const trainingService = {
  getAll:         ()                                           => repo.getAll(),
  getById:        (id: string)                                 => repo.getById(id),
  getByCategoria: (categoria: string)                          => repo.getByCategoria(categoria),
  create:         (data: CreateTraining)                       => repo.create(data),
  update:         (id: string, data: Partial<CreateTraining>)  => repo.update(id, data),
  delete:         (id: string)                                 => repo.delete(id),
}