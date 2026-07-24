import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import type { Recipient as PrismaRecipient } from '../generated/prisma/client'

export class PrismaRecipientMapper {
  static toPrisma(raw: Recipient): PrismaRecipient {
    const recipient = {
      id: raw.id.toString(),
      name: raw.name,
      cpf: raw.cpf.value,
      phone: raw.phoneNumber,
      latitude: raw.location.latitude,
      longitude: raw.location.longitude,
    }

    return recipient
  }
}
