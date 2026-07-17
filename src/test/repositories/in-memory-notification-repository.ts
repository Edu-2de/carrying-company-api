import type { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }
}
