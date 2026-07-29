import type { UserRepository } from '@/domain/delivery/application/repositories/user-repository'
import type { User } from '@/domain/delivery/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByCpf(cpf: string) {
    const user = this.items.find((item) => item.cpf === cpf)
    if (!user) return null
    return user
  }
}
