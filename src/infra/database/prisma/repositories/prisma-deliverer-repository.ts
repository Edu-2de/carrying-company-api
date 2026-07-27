import { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository'
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer'
import { Injectable } from '@nestjs/common'
import { PrismaDelivererMapper } from '../mappers/prisma-deliverer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDelivererRepository implements DelivererRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })
    if (!deliverer) return null
    return PrismaDelivererMapper.toDomain(deliverer)
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!deliverer) return null
    return PrismaDelivererMapper.toDomain(deliverer)
  }

  async findById(id: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!deliverer) return null
    return PrismaDelivererMapper.toDomain(deliverer)
  }

  async create(deliverer: Deliverer): Promise<void> {
    const data = PrismaDelivererMapper.toPrisma(deliverer)
    await this.prisma.user.create({
      data,
    })
  }
}
