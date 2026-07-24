import type { Manager } from '@/domain/delivery/enterprise/entities/manager'
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
}
