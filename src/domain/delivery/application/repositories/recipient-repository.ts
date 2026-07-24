import type { Recipient } from '@domain/delivery/enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract findByCpf(cpf: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(data: Recipient): Promise<void>
}
