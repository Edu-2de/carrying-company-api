import { left, right, type Either } from '@/core/either'
import type { Order } from '../../enterprise/entities/order'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import type { OrderRepository } from '../repositories/order-repository'
import { DelivererDoesNotExistsError } from './errors/deliverer-does-not-exists-error'

export interface FetchDelivererOrdersUseCaseRequest {
  delivererId: string
}

export type FetchDelivererOrdersUseCaseResponse = Either<
  DelivererDoesNotExistsError,
  { orders: Order[] }
>

export class FetchDelivererOrdersUseCase {
  constructor(
    private delivererRepository: DelivererRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    delivererId,
  }: FetchDelivererOrdersUseCaseRequest): Promise<FetchDelivererOrdersUseCaseResponse> {
    const delivererExists = await this.delivererRepository.findById(delivererId)
    if (!delivererExists) return left(new DelivererDoesNotExistsError())

    const orders = await this.orderRepository.findByDeliverer(delivererId)

    return right({ orders })
  }
}
