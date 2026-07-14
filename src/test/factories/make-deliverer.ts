import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Deliverer,
  type DelivererProps,
} from '@/domain/delivery/enterprise/entities/deliverer'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

export async function makeDeliverer(
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
