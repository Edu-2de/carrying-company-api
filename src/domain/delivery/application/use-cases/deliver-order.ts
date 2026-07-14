import { left, right, type Either } from '@/core/either'
import type { DelivererRepository } from '../repositories/deliverer-repository'
import type { OrderRepository } from '../repositories/order-repository'
import { DelivererDoesNotExistsError } from './errors/deliverer-does-not-exists-error'
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error'

export interface DeliverOrderUseCaseRequest {
  orderId: string
  delivererId: string
  fileName: string
}

export type DeliverOrderUseCaseResponse = Either<
  OrderDoesNotExistsError | DelivererDoesNotExistsError,
  {}
>

export class DeliverOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private delivererRepository: DelivererRepository,
  ) {}

  async execute({
    orderId,
    delivererId,
    fileName,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const orderExists = await this.orderRepository.findById(orderId)
    if (!orderExists) return left(new OrderDoesNotExistsError())

    const delivererExists = await this.delivererRepository.findById(delivererId)
    if (!delivererExists) return left(new DelivererDoesNotExistsError())

    const result = orderExists.deliver(delivererExists.id, fileName)
    if (result.isLeft()) return left(result.value)

    await this.orderRepository.save(orderExists)

    return right({})
  }
}
