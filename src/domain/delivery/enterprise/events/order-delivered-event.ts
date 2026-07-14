import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { Order } from '../entities/order'

export class OrderDeliveredEvent implements DomainEvent {
  public occurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.occurredAt = new Date()
    this.order = order
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
