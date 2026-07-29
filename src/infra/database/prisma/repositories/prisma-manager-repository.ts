import { ManagerRepository } from '@/domain/delivery/application/repositories/manager-repository'
import type { Manager } from '@/domain/delivery/enterprise/entities/manager'
import { Injectable } from '@nestjs/common'
import { PrismaManagerMapper } from '../mappers/prisma-manager-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaManagerRepository implements ManagerRepository {
  constructor(private prisma: PrismaService) {}

  async create(manager: Manager): Promise<void> {
    const data = PrismaManagerMapper.toPrisma(manager)
    await this.prisma.user.create({
      data,
    })
  }

  async findByCpf(cpf: string): Promise<Manager | null> {
    const manager = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })
    if (!manager) return null
    return PrismaManagerMapper.toDomain(manager)
  }

  async findById(id: string): Promise<Manager | null> {
    const manager = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!manager) return null
    return PrismaManagerMapper.toDomain(manager)
  }
}
