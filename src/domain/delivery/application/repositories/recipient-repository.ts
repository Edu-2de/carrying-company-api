import type { Recipient } from '@domain/delivery/enterprise/entities/recipient'

export interface RecipientRepository {
  create(data: Recipient): Promise<void>
  findByCpf(cpf: string): Promise<Recipient | null>
  findById(id: string): Promise<Recipient | null>
}
