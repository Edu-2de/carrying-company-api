import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
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

export class Order extends Entity<OrderProps> {
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

  pickUp(delivererId: UniqueEntityId) {
    if (this.props.status !== OrderStatus.orderProcessed) {
      throw new Error('Order is not available for pick up.')
    }
    this.props.delivererId = delivererId
    this.props.status = OrderStatus.inTransit
    this.touch()
  }

  deliver() {
    this.props.status = OrderStatus.delivered
    this.touch()
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
