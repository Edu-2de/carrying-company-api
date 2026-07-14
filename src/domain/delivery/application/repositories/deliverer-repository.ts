import type { Deliverer } from '@domain/delivery/enterprise/entities/deliverer'

export interface DelivererRepository {
  findByCpf(cpf: string): Promise<Deliverer | null>
  findByEmail(email: string): Promise<Deliverer | null>
  findById(id: string): Promise<Deliverer | null>
  create(data: Deliverer): Promise<void>
}
