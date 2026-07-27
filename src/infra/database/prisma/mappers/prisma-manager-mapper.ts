import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Manager } from '@/domain/delivery/enterprise/entities/manager'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import {
  UserRole,
  type User as PrismaManager,
} from '../generated/prisma/client'

export class PrismaManagerMapper {
  static toPrisma(raw: Manager): PrismaManager {
    const manager = {
      id: raw.id.toString(),
      name: raw.name,
      cpf: raw.cpf.value,
      email: raw.email,
      password: raw.password,
      phone: raw.phoneNumber,
      role: UserRole.MANAGER,
    }

    return manager
  }

  static toDomain(raw: PrismaManager): Manager {
    const manager = new Manager(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        email: raw.email,
        password: raw.password,
        phoneNumber: raw.phone,
      },
      new UniqueEntityId(raw.id),
    )
    return manager
  }
}
