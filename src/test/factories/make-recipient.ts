import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  type RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

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
