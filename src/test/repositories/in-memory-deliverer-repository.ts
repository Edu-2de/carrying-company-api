import type { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository'
import type { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'

export class InMemoryDelivererRepository implements DelivererRepository {
  public items: Deliverer[] = []

  constructor() {}

  async create(deliverer: Deliverer) {
    this.items.push(deliverer)
  }

  async findByCpf(cpf: string) {
    const deliverer = this.items.find((item) => item.cpf.value === cpf)
    if (!deliverer) return
    return deliverer
  }

  async findByEmail(email: string) {
    const deliverer = this.items.find((item) => item.email === email)
    if (!deliverer) return
    return deliverer
  }
}
