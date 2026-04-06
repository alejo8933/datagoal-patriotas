import type { Training, CreateTraining } from '@/types/domain/training.schema'

export interface ITrainingRepository {
  getAll():                                            Promise<Training[]>
  getById(id: string):                                 Promise<Training | null>
  getByCategoria(categoria: string):                   Promise<Training[]>
  create(data: CreateTraining):                        Promise<Training>
  update(id: string, data: Partial<CreateTraining>):   Promise<Training>
  delete(id: string):                                  Promise<void>
}