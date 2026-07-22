import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryNotificationRepository } from '@/test/repositories/in-memory-notification-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { waitFor } from '@/test/utils/wait-for'
import { beforeEach, describe, it } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnOrderPicked } from './on-order-picked'

let recipientRepository: InMemoryRecipientRepository
let delivererRepository: InMemoryDelivererRepository
let orderRepository: InMemoryOrderRepository
let notificationRepository: InMemoryNotificationRepository
let sendNotification: SendNotificationUseCase
let sut: OnOrderPicked

describe('On Order Picked Subscriber', () => {
  beforeEach(async () => {
    recipientRepository = new InMemoryRecipientRepository()
    delivererRepository = new InMemoryDelivererRepository()
    orderRepository = new InMemoryOrderRepository()
    notificationRepository = new InMemoryNotificationRepository()
    sendNotification = new SendNotificationUseCase(notificationRepository)

    sut = new OnOrderPicked(sendNotification)
  })

  it('should be able to send a notification when an order is picked', async () => {
    const sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    const recipient = makeRecipient()
    await recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    await delivererRepository.create(deliverer)

    const order = makeOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
      status: OrderStatus.orderProcessed,
    })
    await orderRepository.create(order)

    order.pickUp(deliverer.id)
    await orderRepository.save(order)

    expect(notificationRepository.items).toHaveLength(1)
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
