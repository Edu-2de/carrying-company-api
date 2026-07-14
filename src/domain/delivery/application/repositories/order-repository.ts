import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '@domain/delivery/enterprise/entities/order'
import type { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'

export interface OrderRepository {
  fetchNear(location: Coordinate, params: PaginationParams): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  fetchByDeliverer(
    delivererId: string,
    params: PaginationParams,
  ): Promise<Order[]>
  save(data: Order): Promise<void>
  create(data: Order): Promise<void>
}
