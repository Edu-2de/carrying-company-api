import type { Order } from '@/domain/delivery/enterprise/entities/order'
import type { Order as PrismaOrder } from '../generated/prisma/client'

export class PrismaOrderMapper {
  static toPrisma(raw: Order): PrismaOrder {
    const order = {
      id: raw.id.toString(),
      title: raw.title,
      latitude: raw.location.latitude,
      longitude: raw.location.longitude,
      expectDate: raw.expectedDate,
      recipientId: raw.recipientId.toString(),
      delivererId: raw.delivererId?.toString(),
    }

    return order
  }
}
