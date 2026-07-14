import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Order,
  type OrderProps,
} from '@/domain/delivery/enterprise/entities/order'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { faker } from '@faker-js/faker'

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
