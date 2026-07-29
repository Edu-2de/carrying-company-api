import type { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { getBoundingBox } from '@/infra/utils/get-bounding-box'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async fetchNear(
    location: Coordinate,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    // Define o raio de busca em quilômetros (ex: 3km)
    const boundingBox = getBoundingBox(
      { latitude: location.latitude, longitude: location.longitude },
      3,
    )

    const orders = await this.prisma.order.findMany({
      where: {
        latitude: {
          gte: boundingBox.minLat,
          lte: boundingBox.maxLat,
        },
        longitude: {
          gte: boundingBox.minLng,
          lte: boundingBox.maxLng,
        },
      },
      take: 20, // Mantendo um padrão de paginação
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
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
