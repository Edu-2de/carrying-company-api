import type { Order } from '@domain/delivery/enterprise/entities/order'
import type { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'

export interface OrderRepository {
  create(data: Order): Promise<void>
  fetchNear(location: Coordinate): Promise<Order[]>
}
