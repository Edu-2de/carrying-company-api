import { left, right, type Either } from '@/core/either'
import type { DelivererNotAuthorizedError } from '../../enterprise/entities/errors/deliverer-not-authorized-error'
import type { OrderNotAvailableError } from '../../enterprise/entities/errors/order-not-available-error'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import type { OrderRepository } from '../repositories/order-repository'
import { DelivererDoesNotExistsError } from './errors/deliverer-does-not-exists-error'
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error'

export interface ReturnOrderUseCaseRequest {
  orderId: string
  delivererId: string
}

export type ReturnOrderUseCaseResponse = Either<
  | OrderDoesNotExistsError
  | DelivererDoesNotExistsError
  | OrderNotAvailableError
  | DelivererNotAuthorizedError,
  {}
>

export class ReturnOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private delivererId: DelivererRepository,
  ) {}

  async execute({
    orderId,
    delivererId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const orderExists = await this.orderRepository.findById(orderId)
    if (!orderExists) return left(new OrderDoesNotExistsError())

    const delivererExists = await this.delivererId.findById(delivererId)
    if (!delivererExists) return left(new DelivererDoesNotExistsError())

    const result = orderExists.return(delivererExists.id)
    if (result.isLeft()) return left(result.value)

    await this.orderRepository.save(orderExists)

    return right({})
  }
}
