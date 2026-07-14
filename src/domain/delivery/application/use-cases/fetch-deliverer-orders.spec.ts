import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, expect, it } from 'vitest'
import { FetchDelivererOrdersUseCase } from './fetch-deliverer-orders'

let delivererRepository: InMemoryDelivererRepository
let orderRepository: InMemoryOrderRepository
let recipientRepository: InMemoryRecipientRepository
let sut: FetchDelivererOrdersUseCase

describe('Fetch Deliverer Orders Use Case', () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    orderRepository = new InMemoryOrderRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new FetchDelivererOrdersUseCase(delivererRepository, orderRepository)
  })

  it('should be able to fetch deliverer orders', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const order1 = makeOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
    })
    orderRepository.create(order1)

    const order2 = makeOrder({
      recipientId: recipient.id,
      delivererId: deliverer.id,
    })
    orderRepository.create(order2)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({
          id: order1.id,
        }),
        expect.objectContaining({
          id: order2.id,
        }),
      ],
    })
  })
})
