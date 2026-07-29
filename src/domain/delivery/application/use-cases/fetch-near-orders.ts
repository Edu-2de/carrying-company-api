import { left, right, type Either } from '@/core/either'
import { Order } from '@domain/delivery/enterprise/entities/order'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Injectable } from '@nestjs/common'
import { DelivererRepository } from '../repositories/deliverer-repository'
import { OrderRepository } from '../repositories/order-repository'
import { NotAllowedError } from './errors/not-allowed-error'

export interface FetchNearOrdersUseCaseRequest {
  latitude: number
  longitude: number
  page?: number
  delivererId: string
}

export type FetchNearOrdersUseCaseResponse = Either<
  NotAllowedError,
  { orders: Order[] }
>

@Injectable()
export class FetchNearOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private delivererRepository: DelivererRepository,
  ) {}

  async execute({
    latitude,
    longitude,
    page = 1,
    delivererId,
  }: FetchNearOrdersUseCaseRequest): Promise<FetchNearOrdersUseCaseResponse> {
    const deliverer = await this.delivererRepository.findById(delivererId)
    if (!deliverer) return left(new NotAllowedError())

    const location = Coordinate.create(latitude, longitude)

    const orders = await this.orderRepository.fetchNear(location, { page })

    return right({ orders })
  }
}
