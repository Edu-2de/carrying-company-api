import { Order } from '@/domain/delivery/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      title: order.title,
      status: order.status,
      latitude: order.location.latitude,
      longitude: order.location.longitude,
      expectedDate: order.expectedDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      delivererId: order.delivererId?.toString() ?? null,
      recipientId: order.recipientId.toString(),
    }
  }
}
