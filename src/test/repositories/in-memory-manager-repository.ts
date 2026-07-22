import type { ManagerRepository } from '@/domain/delivery/application/repositories/manager-repository'
import type { Manager } from '@/domain/delivery/enterprise/entities/manager'

export class InMemoryManagerRepository implements ManagerRepository {
  public items: Manager[] = []

  async create(manager: Manager) {
    this.items.push(manager)
  }

  async findByCpf(cpf: string) {
    const manager = this.items.find((item) => item.cpf.value === cpf)
    if (!manager) return
    return manager
  }
}
