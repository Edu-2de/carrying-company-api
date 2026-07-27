import { right, type Either } from '@/core/either'
import { Order } from '@domain/delivery/enterprise/entities/order'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../repositories/order-repository'

export interface FetchNearOrdersUseCaseRequest {
  latitude: number
  longitude: number
  page?: number
}

export type FetchNearOrdersUseCaseResponse = Either<{}, { orders: Order[] }>

@Injectable()
export class FetchNearOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    latitude,
    longitude,
    page = 1,
  }: FetchNearOrdersUseCaseRequest): Promise<FetchNearOrdersUseCaseResponse> {
    const location = Coordinate.create(latitude, longitude)

    const orders = await this.orderRepository.fetchNear(location, { page })

    return right({ orders })
  }
}
