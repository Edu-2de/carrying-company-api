import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import { OrderStatus } from '../../enterprise/entities/order'
import { DeliverOrderUseCase } from './deliver-order'

let recipientRepository: InMemoryRecipientRepository
let delivererRepository: InMemoryDelivererRepository
let orderRepository: InMemoryOrderRepository
let sut: DeliverOrderUseCase

describe('Deliver Order Use Case', () => {
  beforeEach(async () => {
    recipientRepository = new InMemoryRecipientRepository()
    delivererRepository = new InMemoryDelivererRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new DeliverOrderUseCase(orderRepository, delivererRepository)
  })

  it('should be able to deliver an order', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const order = makeOrder({
      delivererId: deliverer.id,
      recipientId: recipient.id,
      status: OrderStatus.inTransit,
    })
    orderRepository.create(order)

    const response = await sut.execute({
      delivererId: deliverer.id.toString(),
      orderId: order.id.toString(),
      fileName: 'fileName',
    })

    expect(response.isRight()).toBe(true)
    expect(order.status).toEqual(OrderStatus.delivered)
  })
})
