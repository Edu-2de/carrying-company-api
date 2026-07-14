import type { Order } from '@domain/delivery/enterprise/entities/order'
import type { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'

export interface OrderRepository {
  fetchNear(location: Coordinate): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  save(data: Order): Promise<void>
  create(data: Order): Promise<void>
}
