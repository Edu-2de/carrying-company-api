import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order'
import { ManagerRepository } from '../repositories/manager-repository'
import { OrderRepository } from '../repositories/order-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ManagerDoesNotExistsError } from './errors/manager-does-not-exists-error'
import { RecipientDoesNotExistsError } from './errors/recipient-does-not-exists-error'

export interface CreateOrderUseCaseRequest {
  title: string
  latitude: number
  longitude: number
  expectedDate: Date
  recipientId: string
  managerId: string
}

export type CreateOrderUseCaseResponse = Either<
  RecipientDoesNotExistsError | ManagerDoesNotExistsError,
  {}
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private managerRepository: ManagerRepository,
  ) {}

  async execute({
    title,
    latitude,
    longitude,
    expectedDate,
    recipientId,
    managerId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const managerExists = await this.managerRepository.findById(managerId)
    if (!managerExists) return left(new ManagerDoesNotExistsError())

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
