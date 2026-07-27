import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import {
  UserRole,
  type User as PrismaDeliverer,
} from '../generated/prisma/client'

export class PrismaDelivererMapper {
  static toPrisma(raw: Deliverer): PrismaDeliverer {
    const user = {
      id: raw.id.toString(),
      name: raw.name,
      cpf: raw.cpf.value,
      email: raw.email,
      password: raw.password,
      phone: raw.phoneNumber,
      role: UserRole.DELIVERER,
    }

    return user
  }

  static toDomain(raw: PrismaDeliverer): Deliverer {
    const deliverer = new Deliverer(
      {
        name: raw.name,
        cpf: Cpf.create(raw.cpf),
        email: raw.email,
        password: raw.password,
        phoneNumber: raw.phone,
      },
      new UniqueEntityId(raw.id),
    )

    return deliverer
  }
}
