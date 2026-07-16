import { right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@domain/notification/enterprise/entities/notification'
import type { NotificationRepository } from '../repositories/notification-repository'

export interface SendNotificationUseCaseRequest {
  title: string
  content: string
  recipientId: string
}

export type SendNotificationUseCaseResponse = Either<
  {},
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId: new UniqueEntityId(recipientId),
    })

    await this.notificationRepository.create(notification)

    return right({ notification })
  }
}
