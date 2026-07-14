import type { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import type { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async findByCpf(cpf: string) {
    const recipient = this.items.find((item) => item.cpf.value === cpf)
    if (!recipient) return null
    return recipient
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)
    if (!recipient) return null
    return recipient
  }
}
