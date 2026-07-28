import type { Notification } from '@/domain/notification/enterprise/entities/notification'
import type { Notification as PrismaNotification } from '../generated/prisma/client'

export class PrismaNotificationMapper {
  static toPrisma(raw: Notification): PrismaNotification {
    const notification = {
      id: raw.id.toString(),
      title: raw.title,
      content: raw.content,
      createdAt: raw.createdAt!,
      recipientId: raw.recipientId.toString(),
    }
    return notification
  }
}
