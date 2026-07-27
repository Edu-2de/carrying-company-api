import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order'
import { DelivererRepository } from '../repositories/deliverer-repository'
import { OrderRepository } from '../repositories/order-repository'
import { DelivererDoesNotExistsError } from './errors/deliverer-does-not-exists-error'

export interface FetchDelivererOrdersUseCaseRequest {
  delivererId: string
  page: number
}

export type FetchDelivererOrdersUseCaseResponse = Either<
  DelivererDoesNotExistsError,
  { orders: Order[] }
>

@Injectable()
export class FetchDelivererOrdersUseCase {
  constructor(
    private delivererRepository: DelivererRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    delivererId,
    page,
  }: FetchDelivererOrdersUseCaseRequest): Promise<FetchDelivererOrdersUseCaseResponse> {
    const delivererExists = await this.delivererRepository.findById(delivererId)
    if (!delivererExists) return left(new DelivererDoesNotExistsError())

    const orders = await this.orderRepository.fetchByDeliverer(delivererId, {
      page,
    })

    return right({ orders })
  }
}
