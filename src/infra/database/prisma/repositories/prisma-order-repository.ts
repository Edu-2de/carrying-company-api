import type { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async fetchNear(
    location: Coordinate,
    params: PaginationParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })
    if (!order) return null
    return PrismaOrderMapper.toDomain(order)
  }

  async fetchByDeliverer(
    delivererId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        delivererId,
      },
      take: 5,
      skip: (page - 1) * 5,
    })
    return orders.map(PrismaOrderMapper.toDomain)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    })
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.order.create({
      data,
    })
  }
}
