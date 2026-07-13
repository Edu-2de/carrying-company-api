import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Coordinate } from './value-objects/coordinate'

enum OrderStatus {
  orderProcessed = 'Order Processed',
  inTrasit = 'In Transit',
  outForDelivery = 'Out for Delivery',
  delivered = 'Delivered',
  returned = 'Returned',
}

export interface OrderProps {
  title: string
  location: Coordinate
  status: OrderStatus
  fileName?: string
  createdAt: Date
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

  static create(props: OrderProps, id?: UniqueEntityId) {
    const order = new Order(
      {
        ...props,
      },
      id,
    )
    return order
  }
}
