import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Manager,
  type ManagerProps,
} from '@/domain/delivery/enterprise/entities/manager'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaManagerMapper } from '@/infra/database/prisma/mappers/prisma-manager-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class ManagerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaManager(data: Partial<ManagerProps> = {}): Promise<Manager> {
    const manager = makeManager(data)
    await this.prisma.user.create({
      data: PrismaManagerMapper.toPrisma(manager),
    })
    return manager
  }
}
