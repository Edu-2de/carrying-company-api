import { makeDeliverer } from '@/test/factories/make-deliverer'
import { makeOrder } from '@/test/factories/make-order'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryDelivererRepository } from '@/test/repositories/in-memory-deliverer-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { Coordinate } from '@domain/delivery/enterprise/entities/value-objects/coordinate'
import { describe, expect, it } from 'vitest'
import { FetchNearOrdersUseCase } from './fetch-near-orders'

let orderRepository: InMemoryOrderRepository
let recipientRepository: InMemoryRecipientRepository
let delivererRepository: InMemoryDelivererRepository
let sut: FetchNearOrdersUseCase

describe('Fetch Near Orders Use Case', () => {
  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository()
    recipientRepository = new InMemoryRecipientRepository()
    delivererRepository = new InMemoryDelivererRepository()
    sut = new FetchNearOrdersUseCase(orderRepository, delivererRepository)
  })

  it('should be able to fetch orders that are nearby', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const deliverer = makeDeliverer()
    delivererRepository.create(deliverer)

    const order1 = makeOrder({
      recipientId: recipient.id,
      location: Coordinate.create(-10.835, -42.735),
    })
    orderRepository.create(order1)

    const order2 = makeOrder({
      recipientId: recipient.id,
      location: Coordinate.create(-11.8302, -42.7308),
    })
    orderRepository.create(order2)

    const result = await sut.execute({
      latitude: -10.8302,
      longitude: -42.7308,
      delivererId: deliverer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({
          id: order1.id,
        }),
      ],
    })
  })
})
