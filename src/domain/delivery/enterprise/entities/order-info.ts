import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderInfoProps {
  orderId: UniqueEntityId
  delivererId: UniqueEntityId
  status: string
  expectedDate: Date
  createAt: Date
  updatedAt?: Date
}

export class OrderInfo extends Entity<OrderInfoProps> {
  get orderId() {
    return this.props.orderId
  }

  get delivererId() {
    return this.props.delivererId
  }

  get status() {
    return this.props.status
  }

  get expectedDate() {
    return this.props.expectedDate
  }

  get createAt() {
    return this.props.createAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderInfoProps, id?: UniqueEntityId) {
    const orderInfo = new OrderInfo(
      {
        ...props,
      },
      id,
    )
    return orderInfo
  }
}
