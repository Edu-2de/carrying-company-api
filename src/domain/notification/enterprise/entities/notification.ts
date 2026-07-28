import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  title: string
  content: string
  recipientId: UniqueEntityId
  createdAt?: Date
}

export class Notification extends AggregateRoot<NotificationProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get recipientId() {
    return this.props.recipientId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: NotificationProps, id?: UniqueEntityId) {
    const notification = new Notification(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return notification
  }
}
