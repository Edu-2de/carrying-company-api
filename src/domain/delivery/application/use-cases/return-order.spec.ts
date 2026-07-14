import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import { DelivererNotAuthorizedError } from '../../enterprise/entities/errors/deliverer-not-authorized-error'
import { OrderStatus } from '../../enterprise/entities/order'
import { ReturnOrderUseCase } from './return-order'

let orderRepository: InMemoryOrderRepository
let delivererRepository: InMemoryDelivererRepository
let recipientRepository: InMemoryRecipientRepository
let sut: ReturnOrderUseCase

describe('Return Order Use Case', () => {
  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository()
    delivererRepository = new InMemoryDelivererRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new ReturnOrderUseCase(orderRepository, delivererRepository)
  })

  it('should be possible to return an order that has been delivered', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const order = makeOrder({
      delivererId: deliverer.id,
      recipientId: recipient.id,
      status: OrderStatus.delivered,
    })
    orderRepository.create(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      delivererId: deliverer.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(order.status).toEqual(OrderStatus.returned)
  })

  it('should not be possible to return an order from another deliverer', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const delivererError = makeDeliverer()
    delivererRepository.create(delivererError)

    const order = makeOrder({
      delivererId: deliverer.id,
      recipientId: recipient.id,
      status: OrderStatus.delivered,
    })
    orderRepository.create(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      delivererId: delivererError.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(DelivererNotAuthorizedError)
  })
})
