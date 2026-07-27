import type { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@domain/delivery/enterprise/entities/order'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'

export abstract class OrderRepository {
  abstract fetchNear(
    location: Coordinate,
    params: PaginationParams,
  ): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract fetchByDeliverer(
    delivererId: string,
    params: PaginationParams,
  ): Promise<Order[]>
  abstract create(data: Order): Promise<void>
  abstract save(data: Order): Promise<void>
}
