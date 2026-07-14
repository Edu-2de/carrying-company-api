import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import { PickUpOrderUseCase } from './pick-up-order'

let orderRepository: InMemoryOrderRepository
let delivererRepository: InMemoryDelivererRepository
let recipientRepository: InMemoryRecipientRepository
let sut: PickUpOrderUseCase

describe('Pick Up Order Use Case', () => {
  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository()
    delivererRepository = new InMemoryDelivererRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new PickUpOrderUseCase(orderRepository, delivererRepository)
  })

  it('should be able to select an order to deliver', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const order = makeOrder()
    orderRepository.create(order)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const response = await sut.execute({
      delivererId: deliverer.id.toString(),
      orderId: order.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(order.delivererId).toEqual(deliverer.id)
  })
})
