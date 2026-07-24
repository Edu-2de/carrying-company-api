import type { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'
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
}
