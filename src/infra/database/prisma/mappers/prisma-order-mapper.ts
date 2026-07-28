import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  OrderStatus as DomainOrderStatus,
  Order,
} from '@/domain/delivery/enterprise/entities/order'
import { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import {
  Prisma,
  type Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
} from '../generated/prisma/client'

const toDomainStatus: Record<PrismaOrderStatus, DomainOrderStatus> = {
  orderProcessed: DomainOrderStatus.orderProcessed,
  inTransit: DomainOrderStatus.inTransit,
  outForDelivery: DomainOrderStatus.outForDelivery,
  delivered: DomainOrderStatus.delivered,
  returned: DomainOrderStatus.returned,
}

const toPrismaStatus: Record<DomainOrderStatus, PrismaOrderStatus> = {
  [DomainOrderStatus.orderProcessed]: PrismaOrderStatus.orderProcessed,
  [DomainOrderStatus.inTransit]: PrismaOrderStatus.inTransit,
  [DomainOrderStatus.outForDelivery]: PrismaOrderStatus.outForDelivery,
  [DomainOrderStatus.delivered]: PrismaOrderStatus.delivered,
  [DomainOrderStatus.returned]: PrismaOrderStatus.returned,
}

export class PrismaOrderMapper {
  static toPrisma(raw: Order): Prisma.OrderUncheckedCreateInput {
    const order: Prisma.OrderUncheckedCreateInput = {
      id: raw.id.toString(),
      title: raw.title,
      status: raw.status
        ? toPrismaStatus[raw.status]
        : PrismaOrderStatus.orderProcessed,
      latitude: raw.location.latitude,
      longitude: raw.location.longitude,
      expectedDate: raw.expectedDate,
      recipientId: raw.recipientId.toString(),
      delivererId: raw.delivererId?.toString() ?? null,
      updatedAt: raw.updatedAt ?? null,
      fileName: raw.fileName ?? null,
    }

    if (raw.createdAt) {
      order.createdAt = raw.createdAt
    }

    return order
  }

  static toDomain(raw: PrismaOrder): Order {
    const order = new Order(
      {
        title: raw.title,
        status: toDomainStatus[raw.status],
        expectedDate: raw.expectedDate,
        location: Coordinate.create(raw.latitude, raw.longitude),
        recipientId: new UniqueEntityId(raw.recipientId),
        delivererId: raw.delivererId
          ? new UniqueEntityId(raw.delivererId)
          : null,
        fileName: raw.fileName,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )

    return order
  }
}
