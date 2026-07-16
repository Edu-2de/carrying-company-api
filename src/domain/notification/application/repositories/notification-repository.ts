import { Notification } from '@domain/notification/enterprise/entities/notification'

export interface NotificationRepository {
  create(data: Notification): Promise<void>
}
