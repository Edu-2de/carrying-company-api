import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import type { OrderRepository } from '../repositories/order-repository'
import { CreateOrderUseCase } from './create-order'

let orderRepository: OrderRepository
let recipientRepository: InMemoryRecipientRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new CreateOrderUseCase(orderRepository, recipientRepository)
  })

  it('should be able to create a order', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const order = {
      title: 'title',
      latitude: -10.8302,
      longitude: -42.7308,
      expectedDate: new Date(),
      recipientId: recipient.id.toString(),
    }

    const response = await sut.execute(order)

    expect(response.isRight()).toBe(true)
  })
})
