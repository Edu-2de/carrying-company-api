import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Deliverer,
  type DelivererProps,
} from '@/domain/delivery/enterprise/entities/deliverer'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaDelivererMapper } from '@/infra/database/prisma/mappers/prisma-deliverer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliverer(
  override: Partial<DelivererProps> = {},
  id?: UniqueEntityId,
) {
  const deliverer = Deliverer.create(
    {
      name: faker.lorem.word(),
      cpf: Cpf.create(faker.string.numeric(11)),
      email: faker.internet.email(),
      password: faker.lorem.text(),
      phoneNumber: faker.phone.number(),
      ...override,
    },
    id,
  )

  return deliverer
}

@Injectable()
export class DelivererFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliverer(
    data: Partial<DelivererProps> = {},
  ): Promise<Deliverer> {
    const deliverer = makeDeliverer(data)

    await this.prisma.user.create({
      data: PrismaDelivererMapper.toPrisma(deliverer),
    })

    return deliverer
  }
}
