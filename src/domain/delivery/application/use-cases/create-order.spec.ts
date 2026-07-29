import { makeManager } from '@/test/factories/make-manager'
import { makeRecipient } from '@/test/factories/make-recipient'
import { InMemoryManagerRepository } from '@/test/repositories/in-memory-manager-repository'
import { InMemoryOrderRepository } from '@/test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from '@/test/repositories/in-memory-recipient-repository'
import { describe, it } from 'vitest'
import type { OrderRepository } from '../repositories/order-repository'
import { CreateOrderUseCase } from './create-order'

let orderRepository: OrderRepository
let recipientRepository: InMemoryRecipientRepository
let managerRepository: InMemoryManagerRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository()
    managerRepository = new InMemoryManagerRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new CreateOrderUseCase(
      orderRepository,
      recipientRepository,
      managerRepository,
    )
  })

  it('should be able to create a order', async () => {
    const recipient = makeRecipient()
    recipientRepository.create(recipient)

    const manager = makeManager()
    managerRepository.create(manager)

    const order = {
      title: 'title',
      latitude: -10.8302,
      longitude: -42.7308,
      expectedDate: new Date(),
      recipientId: recipient.id.toString(),
      managerId: manager.id.toString(),
    }

    const response = await sut.execute(order)

    expect(response.isRight()).toBe(true)
  })
})
