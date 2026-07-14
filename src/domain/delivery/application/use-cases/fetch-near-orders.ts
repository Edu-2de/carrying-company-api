import { right, type Either } from '@/core/either'
import type { Order } from '@domain/delivery/enterprise/entities/order'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import type { OrderRepository } from '../repositories/order-repository'

export interface FetchNearOrdersUseCaseRequest {
  latitude: number
  longitude: number
}

export type FetchNearOrdersUseCaseResponse = Either<{}, { orders: Order[] }>

export class FetchNearOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearOrdersUseCaseRequest): Promise<FetchNearOrdersUseCaseResponse> {
    const location = Coordinate.create(latitude, longitude)

    const orders = await this.orderRepository.fetchNear(location)

    return right({ orders })
  }
}
