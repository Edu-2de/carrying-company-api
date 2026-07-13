import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderProps {
  title: string
  destination: string
  recipientId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get title() {
    return this.props.title
  }

  get destination() {
    return this.props.destination
  }

  get recipientId() {
    return this.props.recipientId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
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
