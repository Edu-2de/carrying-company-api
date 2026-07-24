import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import type {
  Prisma,
  Recipient as PrismaRecipient,
} from '../generated/prisma/client'

export class PrismaRecipientMapper {
  static toPrisma(raw: Recipient): Prisma.RecipientUncheckedCreateInput {
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

  static toDomain(raw: PrismaRecipient): Recipient {
    const recipient = new Recipient(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        phoneNumber: raw.phone,
        location: Coordinate.create(raw.latitude, raw.longitude),
      },
      new UniqueEntityId(raw.id),
    )

    return recipient
  }
}
