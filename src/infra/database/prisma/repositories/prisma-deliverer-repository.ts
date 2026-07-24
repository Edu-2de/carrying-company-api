import type { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository'
import type { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'
import { PrismaDelivererMapper } from '../mappers/prisma-deliverer-mapper'
import type { PrismaService } from '../prisma.service'

export class PrismaDelivererRepository implements DelivererRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })
    if (!deliverer) return null
    return deliverer
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!deliverer) return null
    return deliverer
  }

  async findById(id: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!deliverer) return null
    return deliverer
  }

  async create(deliverer: Deliverer): Promise<void> {
    const data = PrismaDelivererMapper.toPrisma(deliverer)
    await this.prisma.user.create({
      data,
    })
  }
}
