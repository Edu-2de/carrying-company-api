import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Order,
  type OrderProps,
} from '@/domain/delivery/enterprise/entities/order'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      title: faker.lorem.word(),
      location: Coordinate.create(
        faker.location.latitude(),
        faker.location.longitude(),
      ),
      expectedDate: new Date(),
      recipientId: new UniqueEntityId(faker.string.numeric(8)),
      ...override,
    },
    id,
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}
