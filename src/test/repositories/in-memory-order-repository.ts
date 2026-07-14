import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import type { Order } from '@/domain/delivery/enterprise/entities/order'
import type { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'
import { getDistanceBetweenCoordinates } from '@/test/utils/get-distance-between-coordinates'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async fetchNear(location: Coordinate, { page }: PaginationParams) {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: location.latitude, longitude: location.longitude },
          {
            latitude: item.location.latitude,
            longitude: item.location.longitude,
          },
        )
        return distance < 10
      })
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)
    if (!order) return null
    return order
  }

  async fetchByDeliverer(delivererId: string, { page }: PaginationParams) {
    const orders = this.items
      .filter((item) => item.delivererId?.toString() === delivererId)
      .slice((page - 1) * 20, page * 20)
    return orders
  }

  async save(order: Order) {
    const orderIndex = this.items.findIndex((item) => item.id === order.id)
    if (orderIndex > -1) {
      this.items[orderIndex] = order
    }
  }

  async create(order: Order) {
    this.items.push(order)
  }
}
