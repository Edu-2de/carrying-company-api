import type { Deliverer } from '@domain/delivery/enterprise/entities/deliverer'

export interface DelivererRepository {
  create(data: Deliverer): Promise<void>
  findByCpf(cpf: string): Promise<Deliverer | null>
  findByEmail(email: string): Promise<Deliverer | null>
}
