import type { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import type { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import type { PrismaClient } from '../generated/prisma/client'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaClient) {}

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        cpf,
      },
    })
    if (!recipient) return null
    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })
    if (!recipient) return null
    return PrismaRecipientMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.recipient.create({
      data,
    })
  }
}
