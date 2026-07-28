import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  type RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) {
  const recipient = Recipient.create(
    {
      name: faker.lorem.word(),
      cpf: Cpf.create(faker.string.numeric(11)),
      phoneNumber: faker.phone.number(),
      location: Coordinate.create(
        faker.location.latitude(),
        faker.location.longitude(),
      ),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}
