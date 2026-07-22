import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryNotificationRepository } from '@/test/repositories/in-memory-notification-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { waitFor } from '@/test/utils/wait-for'
import { beforeEach, describe, expect, it } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnOrderDelivered } from './on-order-delivered'

let notificationsRepository: InMemoryNotificationRepository
let ordersRepository: InMemoryOrderRepository
let recipientRepository: InMemoryRecipientRepository
let delivererRepository: InMemoryDelivererRepository
let sendNotification: SendNotificationUseCase
let sut: OnOrderDelivered

describe('On Order Delivered Subscriber', () => {
  beforeEach(async () => {
    notificationsRepository = new InMemoryNotificationRepository()
    ordersRepository = new InMemoryOrderRepository()
    recipientRepository = new InMemoryRecipientRepository()
    delivererRepository = new InMemoryDelivererRepository()
    sendNotification = new SendNotificationUseCase(notificationsRepository)

    sut = new OnOrderDelivered(sendNotification)
  })

  it('should be able to send a notification when an order is delvered', async () => {
    const sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    const recipient = makeRecipient()
    await recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    await delivererRepository.create(deliverer)

    const order = makeOrder({
      recipientId: recipient.id,
      status: OrderStatus.inTransit,
      delivererId: deliverer.id,
    })
    await ordersRepository.create(order)

    order.deliver(deliverer.id, '')
    await ordersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
