import { left, right, type Either } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderDeliveredEvent } from '../events/order-delivered-event'
import { OrderPickedEvent } from '../events/order-picked-event'
import { OrderReturnedEvent } from '../events/order-returned-event'
import { DelivererNotAuthorizedError } from './errors/deliverer-not-authorized-error'
import { OrderNotAvailableError } from './errors/order-not-available-error'
import type { Coordinate } from './value-objects/coordinate'

export enum OrderStatus {
  orderProcessed = 'Order Processed',
  inTransit = 'In Transit',
  outForDelivery = 'Out for Delivery',
  delivered = 'Delivered',
  returned = 'Returned',
}

export interface OrderProps {
  title: string
  location: Coordinate
  status?: OrderStatus
  fileName?: string
  createdAt?: Date
  updatedAt?: Date
  expectedDate: Date
  recipientId: UniqueEntityId
  delivererId?: UniqueEntityId
}

export class Order extends AggregateRoot<OrderProps> {
  get title() {
    return this.props.title
  }

  get location() {
    return this.props.location
  }

  get status() {
    return this.props.status
  }

  get fileName() {
    return this.props.fileName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get recipientId() {
    return this.props.recipientId
  }

  get delivererId() {
    return this.props.delivererId
  }

  pickUp(delivererId: UniqueEntityId): Either<OrderNotAvailableError, null> {
    if (this.props.status !== OrderStatus.orderProcessed) {
      return left(new OrderNotAvailableError())
    }
    this.props.delivererId = delivererId
    this.props.status = OrderStatus.inTransit
    this.touch()
    this.addDomainEvent(new OrderPickedEvent(this))

    return right(null)
  }

  deliver(
    delivererId: UniqueEntityId,
    fileName: string,
  ): Either<OrderNotAvailableError | DelivererNotAuthorizedError, null> {
    if (this.props.status !== OrderStatus.inTransit) {
      return left(new OrderNotAvailableError())
    }

    if (this.props.delivererId?.toString() !== delivererId.toString()) {
      return left(new DelivererNotAuthorizedError())
    }
    this.props.status = OrderStatus.delivered
    this.props.fileName = fileName
    this.touch()
    this.addDomainEvent(new OrderDeliveredEvent(this))

    return right(null)
  }

  return(
    delivererId: UniqueEntityId,
  ): Either<OrderNotAvailableError | DelivererNotAuthorizedError, null> {
    if (this.props.status !== OrderStatus.inTransit) {
      return left(new OrderNotAvailableError())
    }

    if (this.props.delivererId?.toString() !== delivererId.toString()) {
      return left(new DelivererNotAuthorizedError())
    }

    this.props.status = OrderStatus.returned
    this.touch()
    this.addDomainEvent(new OrderReturnedEvent(this))

    return right(null)
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: OrderProps, id?: UniqueEntityId) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? OrderStatus.orderProcessed,
      },
      id,
    )
    return order
  }
}
