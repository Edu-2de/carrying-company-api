import { InMemoryNotificationRepository } from '@/test/repositories/in-memory-notification-repository'
import { beforeEach, describe } from 'vitest'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Sen Notification Use Case', () => {
  beforeEach(async () => {
    notificationsRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      recipientId: '123',
      content: 'content',
      title: 'title',
    })

    expect(response.isRight()).toBe(true)
    expect(notificationsRepository.items).toHaveLength(1)
  })
})
