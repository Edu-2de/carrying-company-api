import type { Order } from '@/domain/delivery/enterprise/entities/order'
import { OrderStatus as DomainOrderStatus } from '@/domain/delivery/enterprise/entities/order'
import {
  OrderStatus as PrismaOrderStatus,
  type Prisma,
} from '../generated/prisma/client'

const statusMap: Record<DomainOrderStatus, PrismaOrderStatus> = {
  [DomainOrderStatus.orderProcessed]: PrismaOrderStatus.PROCESSED,
  [DomainOrderStatus.inTransit]: PrismaOrderStatus.INTRANSIT,
  [DomainOrderStatus.outForDelivery]: PrismaOrderStatus.FORDELIVERY,
  [DomainOrderStatus.delivered]: PrismaOrderStatus.DELIVERED,
  [DomainOrderStatus.returned]: PrismaOrderStatus.RETURNED,
}

export class PrismaOrderMapper {
  static toPrisma(raw: Order): Prisma.OrderUncheckedCreateInput {
    // 4. Traduzimos o status do domínio para o status da infra, com fallback para PROCESSED
    const prismaStatus = raw.status
      ? statusMap[raw.status]
      : PrismaOrderStatus.PROCESSED

    const order: Prisma.OrderUncheckedCreateInput = {
      id: raw.id.toString(),
      title: raw.title,
      status: prismaStatus, // <-- Usamos o valor traduzido aqui
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
}
