import { getDistanceBetweenCoordinates } from '@/test/utils/get-distance-between-coordinates'
import type { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import type { Order } from '@/domain/delivery/enterprise/entities/order'
import type { Coordinate } from '@/domain/delivery/enterprise/entities/value-objects/coordinate'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async create(order: Order) {
    this.items.push(order)
  }

  async fetchNear(location: Coordinate) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: location.latitude, longitude: location.longitude },
        {
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        },
      )
      return distance < 10
    })
  }
}
