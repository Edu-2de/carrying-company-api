import { Deliverer } from '@domain/delivery/enterprise/entities/deliverer'

export abstract class DelivererRepository {
  abstract findByCpf(cpf: string): Promise<Deliverer | null>
  abstract findByEmail(email: string): Promise<Deliverer | null>
  abstract findById(id: string): Promise<Deliverer | null>
  abstract create(data: Deliverer): Promise<void>
}
