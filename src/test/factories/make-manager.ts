import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Manager,
  type ManagerProps,
} from '@/domain/delivery/enterprise/entities/manager'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

export function makeManager(
  override: Partial<ManagerProps> = {},
  id?: UniqueEntityId,
) {
  const manager = Manager.create(
    {
      name: faker.internet.username(),
      email: faker.internet.email(),
      cpf: Cpf.create(faker.string.numeric(11)),
      password: faker.internet.password(),
      phoneNumber: faker.phone.imei(),
      ...override,
    },
    id,
  )
  return manager
}
