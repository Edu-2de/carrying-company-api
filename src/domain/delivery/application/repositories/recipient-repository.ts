import type { Recipient } from '@domain/delivery/enterprise/entities/recipient'

export interface RecipientRepository {
  findByCpf(cpf: string): Promise<Recipient | null>
  findById(id: string): Promise<Recipient | null>
  create(data: Recipient): Promise<void>
}
