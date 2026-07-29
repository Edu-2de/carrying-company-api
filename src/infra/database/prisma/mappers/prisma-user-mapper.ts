import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/delivery/enterprise/entities/user'
import type { User as PrismaUser } from '../generated/prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        cpf: raw.cpf,
        password: raw.password,
        role: raw.role === 'MANAGER' ? 'Manager' : 'Deliverer',
      },
      new UniqueEntityId(raw.id),
    )
  }
}
