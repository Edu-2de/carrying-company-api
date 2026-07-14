import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'
import { RecipientDoesNotExistsError } from './errors/recipient-does-not-exists-error'

export interface CreateOrderUseCaseRequest {
  title: string
  latitude: number
  longitude: number
  expectedDate: Date
  recipientId: string
}

export type CreateOrderUseCaseResponse = Either<RecipientDoesNotExistsError, {}>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    title,
    latitude,
    longitude,
    expectedDate,
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipientExists = await this.recipientRepository.findById(recipientId)
    if (!recipientExists) return left(new RecipientDoesNotExistsError())

    const formattedLocation = Coordinate.create(latitude, longitude)

    const order = Order.create({
      title,
      location: formattedLocation,
      recipientId: new UniqueEntityId(recipientId),
      expectedDate,
    })

    await this.orderRepository.create(order)

    return right({})
  }
}
